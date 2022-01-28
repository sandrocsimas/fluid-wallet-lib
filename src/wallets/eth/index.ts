import { ethers } from 'ethers';

import ethConfig from './eth-config';
import MnemonicWords from './mnemonic-words';

import BaseWallet from '../base-wallet';

import Wallet from '../../models/wallet';
import WalletConfig from '../../models/wallet-config';
import { Transaction } from '../../models/transaction';

export default class ETHWallet extends BaseWallet {
  public mnemonicWords = new MnemonicWords();

  public async createWallet(addressFormat = 'eth'): Promise<Wallet> {
    const derivationPath = this.getDerivationPath(addressFormat);
    const wallet = ethers.Wallet.createRandom({ path: derivationPath });
    return this.getWalletDetails(wallet, addressFormat);
  }

  public async importWallet(mnemonic: string, addressFormat = 'eth'): Promise<Wallet> {
    const derivationPath = this.getDerivationPath(addressFormat);
    const wallet = ethers.Wallet.fromMnemonic(mnemonic, derivationPath, this.mnemonicWords);
    return this.getWalletDetails(wallet, addressFormat);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public send(fromAddress: string, toAddess: string, changeAddress: string | undefined, privateKey: string, amount: number): Promise<Transaction> {
    throw new Error('Method not implemented.');
  }

  protected getWalletConfig(): WalletConfig {
    return ethConfig;
  }

  private getWalletDetails(wallet: ethers.Wallet, addressFormat: string): Wallet {
    return {
      address: wallet.address,
      address_format: addressFormat,
      mnemonic: wallet.mnemonic.phrase,
      public_key: wallet.publicKey,
      private_key: wallet.privateKey,
    };
  }
}
