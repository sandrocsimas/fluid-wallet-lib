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
import * as unit from 'satoshi-bitcoin';
import * as coinSelect from 'coinselect';

import mnemonicWords from './mnemonic-words.json';

import BaseWallet from './base-wallet';

import Wallet from '../models/wallet';
import { Transaction, Output, UnspentTransaction } from '../models/transaction';

interface TransactionParams {
  inputs: UnspentTransaction[],
  outputs: Output[],
  fee: number,
}

export default abstract class BTCBasedWallet extends BaseWallet {
  private bip32Factory = BIP32Factory(ecc);

  private ecPairFactory = ECPairFactory(ecc);

  public async createWallet(addressFormat?: string): Promise<Wallet> {
    const mnemonic = bip39.generateMnemonic(undefined, undefined, mnemonicWords);
    return this.getWalletDetails(mnemonic, addressFormat);
  }

  public async importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet> {
    const valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
      throw new Error('Invalid recovery phrase');
    }
    return this.getWalletDetails(mnemonic, addressFormat);
  }

  public async send(fromAddress: string, toAddess: string, changeAddress: string | undefined, privateKey: string, amount: number): Promise<Transaction> {
    const network = this.getNetwork();
    const keyPair = this.ecPairFactory.fromWIF(privateKey, network);

    const psbt = new Psbt({ network });

    const addressFormat = this.getAddressFormat(fromAddress);
    const addressFormatConfig = this.getAddressFormatConfig(fromAddress);

    const { inputs, outputs } = await this.getTransactionParams(fromAddress, toAddess, changeAddress, amount);
    await Promise.all(inputs.map(async (input) => {
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
        const tx = await this.getProvider().getTransaction(input.hash);
        psbtInput.nonWitnessUtxo = Buffer.from(tx.hex, 'hex');
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
      hash: tx.getId(),
      hex: tx.toHex(),
    };
  }

  private getNetwork(): Network {
    // eslint-disable-next-line prefer-destructuring
    const network = this.getWalletConfig().networks[this.network];
    if (!network) {
      throw new Error(`Network ${this.network} is not supported`);
    }
    return network;
  }

  private getScriptPubKey(publicKey: Buffer, addressFormat: string): Payment {
    // eslint-disable-next-line prefer-destructuring
    const payments: { [scriptPubKey: string]: PaymentCreator } = bitcoin.payments;
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

  private async getTransactionParams(fromAddress: string, toAddress: string, changeAddress: string | undefined, amount: number): Promise<TransactionParams> {
    // let estimatedFee = await this.config.provider.('estimatesmartfee', [1]);
    // if (estimatedFee.errors) {
    //   if (NETWORK_NAME === 'mainnet') {
    //     throw new Error('Error estimating fee');
    //   }
    //   estimatedFee = {feerate: 0.000001};
    // }

    // TODO: calculate fee
    const feeRate = unit.toSatoshi(0.000001);
    const utxos = await this.getProvider().listUnspent(fromAddress);
    const target = {
      address: toAddress,
      value: unit.toSatoshi(amount),
    };

    const { inputs, outputs, fee } = coinSelect(utxos, [target], feeRate);
    if (!inputs || !outputs) {
      throw new Error('No inputs or outputs provided to create the transaction');
    }
    return {
      fee,
      inputs,
      outputs: outputs.map((output: Output) => (output.address ? output : { address: changeAddress || fromAddress, value: output.value })),
    };
  }
}
