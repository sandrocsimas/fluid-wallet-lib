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

import Config from '../../config';
import WalletConfig, { AddressType } from '../../models/wallet-config';
import Wallet from '../../models/wallet';
import Transaction from '../../models/transaction';
import Input from '../../models/input';
import Output from '../../models/output';

import btcJson from './btc.json';
import BaseWallet from '../base-wallet';

export default class BTCWallet implements BaseWallet {
  private config: Config;

  private walletConfig = btcJson as WalletConfig;

  private bip32Factory = BIP32Factory(ecc);

  private ecPairFactory = ECPairFactory(ecc);

  constructor(config: Config) {
    this.config = config;
  }

  public async createWallet(scriptPubKeyType?: string): Promise<Wallet> {
    const mnemonic = bip39.generateMnemonic();
    return this.getWalletDetails(mnemonic, scriptPubKeyType);
  }

  public async importWallet(mnemonic: string, scriptPubKeyType?: string): Promise<Wallet> {
    const valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
      throw new Error('Invalid recovery phrase');
    }
    return this.getWalletDetails(mnemonic, scriptPubKeyType);
  }

  public async createTransaction(fromAddress: string, privateKey: string, inputs: Input[], outputs: Output[]): Promise<Transaction> {
    const network = this.getNetwork();
    const keyPair = this.ecPairFactory.fromWIF(privateKey, network);

    const psbt = new Psbt({ network });

    const addressType = this.getAddressType(fromAddress);
    const addressTypeConfig = this.getAddressTypeConfig(fromAddress);
    await Promise.all(inputs.map(async (input: any) => {
      const psbtInput: any = {
        hash: input.hash,
        index: input.vout,
      };
      if (addressTypeConfig.witness) {
        psbtInput.witnessUtxo = {
          script: this.getScriptPubKey(keyPair.publicKey, addressType).output,
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
    const networks: { [key: string]: Network } = bitcoin.networks;
    const network = networks[this.config.network];
    if (!network) {
      throw new Error(`Network ${this.config.network} is not supported`);
    }
    return network;
  }

  private getAddressType(address: string): string {
    const addressTypes = this.walletConfig.address_types[this.config.network];
    const addressType = Object.keys(addressTypes).find((addressTypeKey) => addressTypes[addressTypeKey].prefixes.some((prefix) => address.startsWith(prefix)));
    if (!addressType) {
      throw new Error('Address type not supported');
    }
    return addressType;
  }

  private getAddressTypeConfig(address: string): AddressType {
    const addressTypes = this.walletConfig.address_types[this.config.network];
    const addressTypesConfigs = Object.keys(addressTypes).map((addressTypeKey) => addressTypes[addressTypeKey]);
    const addressTypeConfig = addressTypesConfigs.find((addressType) => addressType.prefixes.some((prefix) => address.startsWith(prefix)));
    if (!addressTypeConfig) {
      throw new Error('Address type not supported');
    }
    return addressTypeConfig;
  }

  private getDerivationPath(scriptPubKeyType = 'p2wpkh'): string {
    const addressTypes = this.walletConfig.address_types[this.config.network];
    const addressTypeConfig = addressTypes[scriptPubKeyType];
    if (!addressTypeConfig) {
      throw new Error('Address type not supported');
    }
    return addressTypeConfig.derivationPath;
  }

  private getScriptPubKey(publicKey: Buffer, scriptPubKeyType = 'p2wpkh'): Payment {
    // eslint-disable-next-line prefer-destructuring
    const payments: { [key: string]: PaymentCreator } = bitcoin.payments;
    const scriptPubKey = payments[scriptPubKeyType];
    if (!scriptPubKey) {
      throw new Error(`Script pub key ${scriptPubKeyType} is not supported`);
    }
    return scriptPubKey({
      network: this.getNetwork(),
      pubkey: publicKey,
    });
  }

  private validateInputSignature(publicKey: Buffer, msgHash: Buffer, signature: Buffer): boolean {
    return this.ecPairFactory.fromPublicKey(publicKey).verify(msgHash, signature);
  }

  private async getWalletDetails(mnemonic: string, scriptPubKeyType?: string): Promise<Wallet> {
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = this.bip32Factory.fromSeed(seed, this.getNetwork());
    const node = root.derivePath(this.getDerivationPath(scriptPubKeyType));
    const address = this.getScriptPubKey(node.publicKey, scriptPubKeyType).address!;
    const addressType = this.getAddressType(address);
    return {
      address,
      mnemonic,
      seed: seed.toString('hex'),
      public_key: node.publicKey.toString('hex'),
      private_key: node.toWIF(),
      address_type: addressType,
    };
  }
}
