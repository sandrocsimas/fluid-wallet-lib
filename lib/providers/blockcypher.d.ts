import BaseProvider from './base-provider';
import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';
export default class BlockCypherProvider extends BaseProvider {
    private static BLOCKCHAIN_PATHS;
    isSupportedBlockchain(symbol: string, network: string): boolean;
    protected doConnect(): Promise<void>;
    protected doGetBalance(address: string): Promise<Balance>;
    protected doGetTransaction(hash: string): Promise<Transaction>;
    protected doListUnspent(address: string): Promise<UnspentTransaction[]>;
    protected doBroadcastTransaction(transaction: Transaction): Promise<void>;
}
