import { ethers } from 'ethers';

import ethConfig from './eth-config';
import MnemonicWords from './mnemonic-words';

import BaseWallet from '../base-wallet';

import Wallet from '../../models/wallet';
import WalletConfig from '../../models/wallet-config';
import { Transaction } from '../../models/transaction';

export default class ETHWallet extends BaseWallet {
  public mnemonicWords = new MnemonicWords();

  public async createWallet(addressFormat = 'default'): Promise<Wallet> {
    const derivationPath = this.getDerivationPath(addressFormat);
    const wallet = ethers.Wallet.createRandom({ path: derivationPath });
    return this.getWalletDetails(wallet, addressFormat, derivationPath);
  }

  public async importWallet(mnemonic: string, addressFormat = 'default'): Promise<Wallet> {
    const derivationPath = this.getDerivationPath(addressFormat);
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, derivationPath, this.mnemonicWords);
    return this.getWalletDetails(wallet, addressFormat, derivationPath);
  }

  public async send(privateKey: string, fromAddress: string, toAddess: string, changeAddress: string | undefined, amount: string): Promise<Transaction> {
    const wallet = new ethers.Wallet(privateKey);
    const signedTx = await wallet.signTransaction({
      to: toAddess,
      value: ethers.utils.parseEther(amount),
    });
    return this.getProvider().broadcastTransaction({
      hash: '',
      raw: signedTx,
    });
  }

  protected getWalletConfig(): WalletConfig {
    return ethConfig;
  }

  protected convertUnit(value: string): string {
    return ethers.utils.formatEther(value);
  }

  private getDerivationPath(addressFormat: string): string {
    const addressFormatConfig = ethConfig.address_formats.all[addressFormat];
    if (!addressFormatConfig) {
      throw new Error(`Address format ${addressFormat} is not supported`);
    }
    return addressFormatConfig.derivationPath;
  }

  private getWalletDetails(wallet: ethers.Wallet, addressFormat: string, derivationPath: string): Wallet {
    return {
      address: wallet.address,
      address_format: addressFormat,
      derivation_path: derivationPath,
      mnemonic: wallet.mnemonic.phrase,
      public_key: wallet.publicKey,
      private_key: wallet.privateKey,
    };
  }
}
