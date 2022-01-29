import Wallet from '../models/wallet';
import WalletConfig from '../models/wallet-config';
import { Transaction } from '../models/transaction';

import BaseProvider from '../providers/base-provider';

export default abstract class BaseWallet {
  public readonly network: string;

  private provider!: BaseProvider;

  public constructor(network: string) {
    this.network = network;
  }

  public abstract createWallet(addressFormat?: string): Promise<Wallet>;

  public abstract importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet>;

  public abstract send(privateKey: string, fromAddress: string, toAddess: string, changeAddress: string | undefined, amount: string): Promise<Transaction>;

  protected abstract getWalletConfig(): WalletConfig;

  public getName(): string {
    return this.getWalletConfig().name;
  }

  public getSymbol(): string {
    return this.getWalletConfig().symbol;
  }

  public async connect(provider: BaseProvider): Promise<void> {
    if (provider.symbol !== this.getSymbol()) {
      throw new Error('Provider was created for another crypto');
    }
    if (provider.network !== this.network) {
      throw new Error('Provider was created for another network');
    }
    if (!provider.isConnected()) {
      await provider.connect();
    }
    this.provider = provider;
  }

  public isConnected(): boolean {
    return this.provider && this.provider.isConnected();
  }

  protected getProvider(): BaseProvider {
    if (!this.provider) {
      throw new Error('Provider is not connected');
    }
    return this.provider;
  }
}
