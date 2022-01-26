import axios from 'axios';

import Provider from '../provider';

import Balance from '../../models/balance';
import { Input, Transaction } from '../../models/transaction';

export default class BlockchainInfoProvider implements Provider {
  public getId(): string {
    return 'blockchain.info';
  }

  public async getBalance(symbol: string, network: string, address: string): Promise<Balance> {
    const { data } = await axios.get(`https://blockchain.info/rawaddr/${address}`);
    return {
      value: data.final_balance,
    };
  }

  public async getTransaction(symbol: string, network: string, hash: string): Promise<Transaction> {
    const { data } = await axios.get(`https://blockchain.info/rawtx/${hash}?format=hex`);
    return {
      hash,
      hex: data,
    };
  }

  public async listUnspent(symbol: string, network: string, address: string): Promise<Input[]> {
    const { data } = await axios.get(`https://blockchain.info/unspent?active=${address}`);
    return data.unspent_outputs.map((utxo: any): Input => ({
      hash: utxo.tx_hash,
      vout: utxo.tx_output_n,
      value: utxo.value,
    }));
  }

  public async broadcastTransaction(symbol: string, network: string, transaction: Transaction): Promise<void> {
    await axios.post(`https://blockchain.info/pushtx?tx=${transaction.hex}`);
  }
}
