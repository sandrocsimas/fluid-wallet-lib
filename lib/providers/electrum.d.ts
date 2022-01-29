import BaseProvider from './base-provider';
import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';
interface RpcConfig {
    host: string;
    port: number;
    rejectUnauthorized: boolean;
}
export default class ElectrumProvider extends BaseProvider {
    private static NETWORKS;
    private rpcClient;
    constructor(symbol: string, network: string, rpcConfig: RpcConfig);
    protected isSupportedBlockchain(symbol: string, network: string): boolean;
    protected doConnect(): Promise<void>;
    protected doGetBalance(address: string): Promise<Balance>;
    protected doGetTransaction(hash: string): Promise<Transaction>;
    protected doListUnspent(address: string): Promise<UnspentTransaction[]>;
    protected doBroadcastTransaction(transaction: Transaction): Promise<Transaction>;
    private getScriptHash;
    private rpcRequest;
}
export {};
