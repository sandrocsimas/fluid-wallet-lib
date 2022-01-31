import * as bitcoin from 'bitcoinjs-lib';
import { Network } from 'bitcoinjs-lib';
import * as jayson from 'jayson/promise';

import BaseProvider from './base-provider';

import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';
import LibError from '../models/lib-error';

import btcConfig from '../wallets/btc/btc-config';
import ltcConfig from '../wallets/ltc/ltc-config';

interface RpcConfig {
  host: string;
  port: number;
  rejectUnauthorized: boolean;
}

interface NetworkConfig {
  [symbol: string]: { [network: string]: Network };
}

export default class ElectrumProvider extends BaseProvider {
  private static NETWORKS: NetworkConfig = {
    btc: btcConfig.networks,
    ltc: ltcConfig.networks,
  };

  private rpcClient: jayson.TlsClient;

  public constructor(symbol: string, network: string, rpcConfig: RpcConfig) {
    super(symbol, network);
    this.rpcClient = jayson.client.tls(rpcConfig);
  }

  protected isSupportedBlockchain(symbol: string, network: string): boolean {
    return !!ElectrumProvider.NETWORKS[symbol][network];
  }

  protected async doConnect(): Promise<void> {
    // Nothing to do...
  }

  protected async doGetBalance(address: string): Promise<Balance> {
    const data = await this.rpcRequest('blockchain.scripthash.get_balance', [this.getScriptHash(address)]);
    return {
      value: String(data.confirmed),
    };
  }

  protected async doGetTransaction(hash: string): Promise<Transaction> {
    const data = await this.rpcRequest('blockchain.transaction.get', [hash]);
    return {
      hash,
      raw: data,
    };
  }

  protected async doListUnspent(address: string): Promise<UnspentTransaction[]> {
    const data = await this.rpcRequest('blockchain.scripthash.listunspent', [this.getScriptHash(address)]);
    return data.filter((utxo: any) => utxo.height > 0)
      .map((utxo: any): UnspentTransaction => ({
        hash: utxo.tx_hash,
        vout: utxo.tx_pos,
        value: utxo.value,
      }));
  }

  protected async doBroadcastTransaction(transaction: Transaction): Promise<Transaction> {
    await this.rpcRequest('blockchain.transaction.broadcast', [transaction.raw]);
    return transaction;
  }

  private getScriptHash(address: string): string {
    const script = bitcoin.address.toOutputScript(address, ElectrumProvider.NETWORKS[this.symbol][this.network]);
    const hash = bitcoin.crypto.sha256(script);
    return Buffer.from(hash.reverse()).toString('hex');
  }

  private async rpcRequest(method: string, params: string[]): Promise<any> {
    const response = await this.rpcClient.request(method, params);
    if (response.error) {
      throw new LibError('RPC server returned error', response.error);
    }
    return response.result;
  }
}
