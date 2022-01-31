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

  public constructor(symbol: string, network: string) {
    super(symbol, network);
  }

  protected isSupportedBlockchain(symbol: string, network: string): boolean {
    return !!BlockCypherProvider.BLOCKCHAIN_PATHS[symbol][network];
  }

  protected async doConnect(): Promise<void> {
    // Nothing to do...
  }

  protected async doGetBalance(address: string): Promise<Balance> {
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath()}/addrs/${address}/balance`);
    return {
      value: String(data.balance),
    };
  }

  protected async doGetTransaction(hash: string): Promise<Transaction> {
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath()}/txs/${hash}?includeHex=true`);
    return {
      hash,
      raw: data.hex,
    };
  }

  protected async doListUnspent(address: string): Promise<UnspentTransaction[]> {
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath()}/addrs/${address}?unspentOnly=true&limit=2000`);
    return data.txrefs.map((utxo: any): UnspentTransaction => ({
      hash: utxo.tx_hash,
      vout: utxo.tx_output_n,
      value: utxo.value,
    }));
  }

  protected async doBroadcastTransaction(transaction: Transaction): Promise<Transaction> {
    await axios.post(`https://api.blockcypher.com/v1/${this.getBlockchainPath()}/txs/push`, { tx: transaction.raw });
    return transaction;
  }

  private getBlockchainPath(): string {
    return BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
  }
}
