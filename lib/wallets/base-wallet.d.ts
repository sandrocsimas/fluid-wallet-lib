import Wallet from '../models/wallet';
import WalletConfig from '../models/wallet-config';
import WalletSummary from '../models/wallet-summary';
import { Transaction } from '../models/transaction';
import BaseProvider from '../providers/base-provider';
export default abstract class BaseWallet {
    readonly network: string;
    private provider;
    constructor(network: string);
    abstract createWallet(addressFormat?: string): Promise<Wallet>;
    abstract importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet>;
    getWallet(address: string): Promise<WalletSummary>;
    abstract send(privateKey: string, fromAddress: string, toAddess: string, changeAddress: string | undefined, amount: string): Promise<Transaction>;
    protected abstract getWalletConfig(): WalletConfig;
    getName(): string;
    getSymbol(): string;
    connect(provider: BaseProvider): Promise<void>;
    isConnected(): boolean;
    protected getProvider(): BaseProvider;
}
