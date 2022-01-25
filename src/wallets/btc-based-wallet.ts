import * as bitcoin from 'bitcoinjs-lib';
import {
  Network,
  Payment,
  PaymentCreator,
  Psbt,
} from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import BIP32Factory from 'bip32';
import * as bip39 from 'bip39';
import * as ecc from 'tiny-secp256k1';

import BaseWallet from './base-wallet';
import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import Input from '../models/input';
import Output from '../models/output';

export default abstract class BTCBasedWallet extends BaseWallet {
  private bip32Factory = BIP32Factory(ecc);

  private ecPairFactory = ECPairFactory(ecc);

  public async createWallet(addressFormat?: string): Promise<Wallet> {
    const mnemonic = bip39.generateMnemonic();
    return this.getWalletDetails(mnemonic, addressFormat);
  }

  public async importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet> {
    const valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
      throw new Error('Invalid recovery phrase');
    }
    return this.getWalletDetails(mnemonic, addressFormat);
  }

  public async createTransaction(fromAddress: string, privateKey: string, inputs: Input[], outputs: Output[]): Promise<Transaction> {
    const network = this.getNetwork();
    const keyPair = this.ecPairFactory.fromWIF(privateKey, network);

    const psbt = new Psbt({ network });

    const addressFormat = this.getAddressFormat(fromAddress);
    const addressFormatConfig = this.getAddressFormatConfig(fromAddress);
    await Promise.all(inputs.map(async (input: any) => {
      const psbtInput: any = {
        hash: input.hash,
        index: input.vout,
      };
      if (addressFormatConfig.witness) {
        psbtInput.witnessUtxo = {
          script: this.getScriptPubKey(keyPair.publicKey, addressFormat).output,
          value: input.value,
        };
      } else {
        psbtInput.nonWitnessUtxo = Buffer.from(input.raw, 'hex');
      }
      psbt.addInput(psbtInput);
    }));

    outputs.forEach((output) => {
      psbt.addOutput(output);
    });

    psbt.signAllInputs(keyPair);
    if (!psbt.validateSignaturesOfAllInputs(this.validateInputSignature.bind(this))) {
      throw new Error('Invalid signature');
    }
    psbt.finalizeAllInputs();

    const tx = psbt.extractTransaction();
    return {
      id: tx.getId(),
      hex: tx.toHex(),
    };
  }

  private getNetwork(): Network {
    // eslint-disable-next-line prefer-destructuring
    const network = this.getWalletConfig().networks[this.config.network];
    if (!network) {
      throw new Error(`Network ${this.config.network} is not supported`);
    }
    return network;
  }

  private getScriptPubKey(publicKey: Buffer, addressFormat: string): Payment {
    // eslint-disable-next-line prefer-destructuring
    const payments: { [key: string]: PaymentCreator } = bitcoin.payments;
    const scriptPubKey = payments[addressFormat];
    if (!scriptPubKey) {
      throw new Error(`Script pub key ${addressFormat} is not supported`);
    }
    return scriptPubKey({
      network: this.getNetwork(),
      pubkey: publicKey,
    });
  }

  private validateInputSignature(publicKey: Buffer, msgHash: Buffer, signature: Buffer): boolean {
    return this.ecPairFactory.fromPublicKey(publicKey).verify(msgHash, signature);
  }

  private async getWalletDetails(mnemonic: string, addressFormat = 'p2wpkh'): Promise<Wallet> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = this.bip32Factory.fromSeed(seed, this.getNetwork());
    const node = root.derivePath(this.getDerivationPath(addressFormat));
    const address = this.getScriptPubKey(node.publicKey, addressFormat).address!;
    return {
      address,
      address_format: addressFormat,
      mnemonic,
      seed: seed.toString('hex'),
      public_key: node.publicKey.toString('hex'),
      private_key: node.toWIF(),
    };
  }
}
