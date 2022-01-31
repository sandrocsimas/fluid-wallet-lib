import { ethers } from 'ethers';
import BaseProvider from './base-provider';
import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';
export default class EthersProvider extends BaseProvider {
    private ethersProvider;
    constructor(ethersProvider: ethers.providers.BaseProvider);
    protected isSupportedBlockchain(symbol: string, network: string): boolean;
    protected doConnect(): Promise<void>;
    protected doGetBalance(address: string): Promise<Balance>;
    protected doGetTransaction(hash: string): Promise<Transaction>;
    protected doListUnspent(address: string): Promise<UnspentTransaction[]>;
    protected doBroadcastTransaction(transaction: Transaction): Promise<Transaction>;
    private getRawTransaction;
    private getNonEmptyValues;
}
