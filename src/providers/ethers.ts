import { ethers } from 'ethers';

import BaseProvider from './base-provider';

import ethConfig from '../wallets/eth/eth-config';

import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';

export default class EthersProvider extends BaseProvider {
  private ethersProvider: ethers.providers.BaseProvider;

  public constructor(ethersProvider: ethers.providers.BaseProvider) {
    super('eth', ethersProvider.network.name);
    this.ethersProvider = ethersProvider;
  }

  protected isSupportedBlockchain(symbol: string, network: string): boolean {
    return symbol === this.symbol && !!ethConfig.address_formats[network];
  }

  protected async doConnect(): Promise<void> {
    // Nothing to do...
  }

  protected async doGetBalance(address: string): Promise<Balance> {
    const balance = await this.ethersProvider.getBalance(address);
    return {
      value: balance.toString(),
    };
  }

  protected async doGetTransaction(hash: string): Promise<Transaction> {
    const transaction = await this.ethersProvider.getTransaction(hash);
    return {
      hash: transaction.hash,
      hex: transaction.raw!,
    };
  }

  protected doListUnspent(address: string): Promise<UnspentTransaction[]> {
    throw new Error('Method not implemented.');
  }

  protected async doBroadcastTransaction(transaction: Transaction): Promise<Transaction> {
    const response = await this.ethersProvider.sendTransaction(transaction.hex);
    return {
      hash: response.hash,
      hex: response.raw!,
    };
  }
}
