import { Input, Output, Transaction } from '../models/transaction';
import Wallet from '../models/wallet';
import WalletConfig from '../models/wallet-config';
import BaseWallet from './base-wallet';

export default class DummyWallet extends BaseWallet {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public createWallet(addressFormat?: string): Promise<Wallet> {
    throw new Error('Wallet not configured');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet> {
    throw new Error('Wallet not configured');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public createTransaction(fromAddress: string, privateKey: string, inputs: [Input], outputs: [Output]): Promise<Transaction> {
    throw new Error('Wallet not configured');
  }

  protected getWalletConfig(): WalletConfig {
    throw new Error('Wallet not configured');
  }
}
