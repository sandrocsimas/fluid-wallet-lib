import Wallet from '../models/wallet';
import WalletConfig, { AddressFormat } from '../models/wallet-config';
import { Transaction } from '../models/transaction';
import BaseProvider from '../providers/base-provider';
export default abstract class BaseWallet {
    readonly network: string;
    private provider;
    constructor(network: string);
    abstract createWallet(addressFormat?: string): Promise<Wallet>;
    abstract importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet>;
    abstract send(fromAddress: string, toAddess: string, changeAddress: string | undefined, privateKey: string, amount: number): Promise<Transaction>;
    protected abstract getWalletConfig(): WalletConfig;
    getName(): string;
    getSymbol(): string;
    connect(provider: BaseProvider): Promise<void>;
    isConnected(): boolean;
    protected getProvider(): BaseProvider;
    protected getDerivationPath(addressFormat: string): string;
    protected getAddressFormat(address: string): string;
    protected getAddressFormatConfig(address: string): AddressFormat;
}
