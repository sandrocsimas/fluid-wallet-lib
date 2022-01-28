import axios from 'axios';

import BaseProvider from './base-provider';

import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';

export default class BlockchainInfoProvider extends BaseProvider {
  protected isSupportedBlockchain(symbol: string, network: string): boolean {
    return symbol === 'btc' && network === 'mainnet';
  }

  protected async doConnect(): Promise<void> {
    // Nothing to do...
  }

  protected async doGetBalance(address: string): Promise<Balance> {
    const { data } = await axios.get(`https://blockchain.info/balance?active=${address}`);
    return {
      value: data[address].final_balance,
    };
  }

  protected async doGetTransaction(hash: string): Promise<Transaction> {
    const { data } = await axios.get(`https://blockchain.info/rawtx/${hash}?format=hex`);
    return {
      hash,
      hex: data,
    };
  }

  protected async doListUnspent(address: string): Promise<UnspentTransaction[]> {
    const { data } = await axios.get(`https://blockchain.info/unspent?active=${address}&limit=1000`);
    return data.unspent_outputs.map((utxo: any): UnspentTransaction => ({
      hash: utxo.tx_hash_big_endian,
      vout: utxo.tx_output_n,
      value: utxo.value,
    }));
  }

  protected async doBroadcastTransaction(transaction: Transaction): Promise<void> {
    await axios.post(`https://blockchain.info/pushtx?tx=${transaction.hex}`);
  }
}
