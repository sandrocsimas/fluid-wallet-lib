import Wallet from '../models/wallet';
import WalletConfig, { AddressFormat } from '../models/wallet-config';
import Transaction from '../models/transaction';
import Input from '../models/input';
import Output from '../models/output';
import Config from '../config';

export default abstract class BaseWallet {
  config: Config;

  constructor(config: Config) {
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
    const addressFormats = this.getWalletConfig().address_formats[this.config.network];
    const addressFormatConfig = addressFormats[addressFormat];
    if (!addressFormatConfig) {
      throw new Error(`Address format ${addressFormat} is not supported`);
    }
    return addressFormatConfig.derivationPath;
  }

  protected getAddressFormat(address: string): string {
    const addressFormats = this.getWalletConfig().address_formats[this.config.network];
    const addressFormat = Object.keys(addressFormats).find((addressFormatKey) => addressFormats[addressFormatKey].prefixes.some((prefix) => address.startsWith(prefix)));
    if (!addressFormat) {
      throw new Error('Address format not supported');
    }
    return addressFormat;
  }

  protected getAddressFormatConfig(address: string): AddressFormat {
    const addressFormat = this.getAddressFormat(address);
    return this.getWalletConfig().address_formats[this.config.network][addressFormat];
  }
}
