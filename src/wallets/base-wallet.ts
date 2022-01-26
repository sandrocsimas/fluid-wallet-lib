import Wallet from '../models/wallet';
import WalletConfig, { AddressFormat } from '../models/wallet-config';
import { WalletEnvConfig } from '../models/env-config';
import { Transaction, Input, Output } from '../models/transaction';

export default abstract class BaseWallet {
  protected network: string;

  protected config: WalletEnvConfig;

  public constructor(network: string, config: WalletEnvConfig) {
    this.network = network;
    this.config = config;
  }

  public getName(): string {
    return this.getWalletConfig().name;
  }

  public getSymbol(): string {
    return this.getWalletConfig().symbol;
  }

  public abstract createWallet(addressFormat?: string): Promise<Wallet>;

  public abstract importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet>;

  public abstract createTransaction(fromAddress: string, privateKey: string, inputs: [Input], outputs: [Output]): Promise<Transaction>;

  protected abstract getWalletConfig(): WalletConfig;

  protected getDerivationPath(addressFormat: string): string {
    const addressFormats = this.getWalletConfig().address_formats[this.network];
    const addressFormatConfig = addressFormats[addressFormat];
    if (!addressFormatConfig) {
      throw new Error(`Address format ${addressFormat} is not supported`);
    }
    return addressFormatConfig.derivationPath;
  }

  protected getAddressFormat(address: string): string {
    const addressFormats = this.getWalletConfig().address_formats[this.network];
    const addressFormat = Object.keys(addressFormats).find((addressFormatKey) => addressFormats[addressFormatKey].prefixes.some((prefix) => address.startsWith(prefix)));
    if (!addressFormat) {
      throw new Error('Address format not supported');
    }
    return addressFormat;
  }

  protected getAddressFormatConfig(address: string): AddressFormat {
    const addressFormat = this.getAddressFormat(address);
    return this.getWalletConfig().address_formats[this.network][addressFormat];
  }
}
