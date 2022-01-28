import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';
export default abstract class BaseProvider {
    readonly symbol: string;
    readonly network: string;
    private connected;
    constructor(symbol: string, network: string);
    protected abstract isSupportedBlockchain(symbol: string, network: string): boolean;
    protected abstract doConnect(): Promise<void>;
    protected abstract doGetBalance(address: string): Promise<Balance>;
    protected abstract doGetTransaction(hash: string): Promise<Transaction>;
    protected abstract doListUnspent(address: string): Promise<UnspentTransaction[]>;
    protected abstract doBroadcastTransaction(transaction: Transaction): Promise<void>;
    isConnected(): boolean;
    connect(): Promise<void>;
    getBalance(address: string): Promise<Balance>;
    getTransaction(hash: string): Promise<Transaction>;
    listUnspent(address: string): Promise<UnspentTransaction[]>;
    broadcastTransaction(transaction: Transaction): Promise<void>;
    private assertConnected;
}
