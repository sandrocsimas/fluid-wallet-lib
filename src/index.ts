import bitcoin, { Network, PaymentCreator } from 'bitcoinjs-lib';
import bip39 from 'bip39';
import BIP32Factory from 'bip32';
import * as ecc from 'tiny-secp256k1';

import { Wallet } from './wallet';

import btcConfig from './wallets/btc/btc.json';

export class Wallets {

  private networkName: string;

  private bip32Factory = BIP32Factory(ecc);

  constructor(networkName: string) {
    this.networkName = networkName;
  }

  public async createWallet(scriptPubKeyType: string) {
    const mnemonic = bip39.generateMnemonic();
    return this.getWalletDetails(mnemonic, scriptPubKeyType);
  }

  public async importWallet(mnemonic: string, scriptPubKeyType: string) {
    const valid = bip39.validateMnemonic(mnemonic);
    if (!valid) {
      throw new Error('Invalid recovery phrase');
    }
    return this.getWalletDetails(mnemonic, scriptPubKeyType);
  }

  private getNetwork(): Network {
    const networks: {[key: string]: Network} = bitcoin.networks;
    const network = networks[this.networkName];
    if (!network) {
      throw new Error('Network ' + this.networkName + ' is not supported');
    }
    return network;
  }

  private getAddressType(address: string) {
    const addressTypes = (btcConfig.address_types as any)[this.networkName];
    const addressType = Object.keys(addressTypes).find((addressTypeKey) => addressTypes[addressTypeKey].prefixes.some((prefix) => address.startsWith(prefix)));
    if (!addressType) {
      throw new Error('Address type not supported');
    }
    return addressType;
  }

  private getDerivationPath(scriptPubKeyType = 'p2wpkh') {
    const addressTypes = (btcConfig.address_types as any)[this.networkName];
    return addressTypes[scriptPubKeyType].derivationPath;
  }

  private getScriptPubKey(network: Network, publicKey: any, scriptPubKeyType = 'p2wpkh') {
    const payments: {[key: string]: PaymentCreator} = bitcoin.payments;
    const scriptPubKey = payments[scriptPubKeyType];
    if (!scriptPubKey) {
      throw new Error('Script pub key ' + scriptPubKeyType + ' is not supported');
    }
    return scriptPubKey({
      network,
      pubkey: publicKey,
    });
  }

  private async getWalletDetails(mnemonic: string, scriptPubKeyType: string): Promise<Wallet> {
    const network = this.getNetwork();
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const root = this.bip32Factory.fromSeed(seed, network);
    const node = root.derivePath(this.getDerivationPath(scriptPubKeyType));
    const address = this.getScriptPubKey(network, node.publicKey, scriptPubKeyType).address!;
    const addressType = this.getAddressType(address);
    return new Wallet({
      address,
      mnemonic,
      seed: seed.toString('hex'),
      public_key: node.publicKey.toString('hex'),
      private_key: node.toWIF(),
      address_type: addressType,
    });
  }
}
