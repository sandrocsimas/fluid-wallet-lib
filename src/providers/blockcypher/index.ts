import axios from 'axios';

import Provider from '../provider';

import Balance from '../../models/balance';
import { Input, Transaction } from '../../models/transaction';

export default class BlockCypherProvider implements Provider {
  private blockchainPaths: any = {
    btc: {
      mainnet: 'btc/main',
      testnet: 'btc/test3',
    },
  };

  public getId(): string {
    return 'blockcypher';
  }

  public async getBalance(symbol: string, network: string, address: string): Promise<Balance> {
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath(symbol, network)}/addrs/${address}/balance`);
    return {
      value: data.final_balance,
    };
  }

  public async getTransaction(symbol: string, network: string, hash: string): Promise<Transaction> {
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath(symbol, network)}/txs/${hash}?includeHex=true`);
    return {
      hash,
      hex: data.hex,
    };
  }

  public async listUnspent(symbol: string, network: string, address: string): Promise<Input[]> {
    const { data } = await axios.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath(symbol, network)}/addrs/${address}?unspentOnly=true`);
    return data.unspent_outputs.map((utxo: any): Input => ({
      hash: utxo.tx_hash,
      vout: utxo.tx_output_n,
      value: utxo.value,
    }));
  }

  public async broadcastTransaction(symbol: string, network: string, transaction: Transaction): Promise<void> {
    await axios.post(`https://api.blockcypher.com/v1/${this.getBlockchainPath(symbol, network)}/txs/push`, { tx: transaction.hex });
  }

  private getBlockchainPath(symbol: string, network: string): string {
    return this.blockchainPaths[symbol][network];
  }
}
