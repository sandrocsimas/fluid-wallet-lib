import axios from 'axios';

import BaseProvider from './base-provider';

import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';

export default class BlockCypherProvider extends BaseProvider {
  private static BLOCKCHAIN_PATHS: any = {
    btc: { mainnet: 'btc/main', testnet: 'btc/test3' },
    dash: { mainnet: 'dash/main' },
    doge: { mainnet: 'doge/main' },
    ltc: { mainnet: 'ltc/main' },
  };

  public isSupportedBlockchain(symbol: string, network: string): boolean {
    return !!BlockCypherProvider.BLOCKCHAIN_PATHS[symbol][network];
  }

  protected async doConnect(): Promise<void> {
    // Nothing to do...
  }

  protected async doGetBalance(address: string): Promise<Balance> {
    const networkPath = BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${networkPath}/addrs/${address}/balance`);
    return {
      value: data.final_balance,
    };
  }

  protected async doGetTransaction(hash: string): Promise<Transaction> {
    const networkPath = BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${networkPath}/txs/${hash}?includeHex=true`);
    return {
      hash,
      hex: data.hex,
    };
  }

  protected async doListUnspent(address: string): Promise<UnspentTransaction[]> {
    const networkPath = BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${networkPath}/addrs/${address}?unspentOnly=true&limit=2000`);
    return data.txrefs.map((utxo: any): UnspentTransaction => ({
      hash: utxo.tx_hash,
      vout: utxo.tx_output_n,
      value: utxo.value,
    }));
  }

  protected async doBroadcastTransaction(transaction: Transaction): Promise<void> {
    const networkPath = BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
    await axios.post(`https://api.blockcypher.com/v1/${networkPath}/txs/push`, { tx: transaction.hex });
  }
}
