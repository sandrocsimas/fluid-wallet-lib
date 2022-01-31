import { ethers } from 'ethers';

import BaseProvider from './base-provider';

import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';

export default class EthersProvider extends BaseProvider {
  private ethersProvider: ethers.providers.BaseProvider;

  public constructor(ethersProvider: ethers.providers.BaseProvider) {
    super('eth', ethersProvider.network.name);
    this.ethersProvider = ethersProvider;
  }

  protected isSupportedBlockchain(symbol: string, network: string): boolean {
    return symbol === this.symbol && network === this.network;
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
      raw: transaction.raw || this.getRawTransaction(transaction),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected doListUnspent(address: string): Promise<UnspentTransaction[]> {
    throw new Error('Method not implemented.');
  }

  protected async doBroadcastTransaction(transaction: Transaction): Promise<Transaction> {
    const response = await this.ethersProvider.sendTransaction(transaction.raw);
    return {
      hash: response.hash,
      raw: response.raw!,
    };
  }

  private getRawTransaction(transaction: ethers.Transaction): string {
    // Extract the relevant parts of the transaction
    const unsignedTransaction = this.getNonEmptyValues({
      accessList: transaction.accessList,
      chainId: transaction.chainId,
      data: transaction.data,
      gasLimit: transaction.gasLimit,
      gasPrice: transaction.gasPrice,
      maxFeePerGas: transaction.maxFeePerGas,
      maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
      nonce: transaction.nonce,
      to: transaction.to,
      type: transaction.type,
      value: transaction.value,
    });
    // Extract the relevant parts of the signature
    const signature = this.getNonEmptyValues({
      r: transaction.r,
      s: transaction.s,
      v: transaction.v,
    });

    const raw = ethers.utils.serializeTransaction(unsignedTransaction, signature);

    // Double check if things went well
    if (ethers.utils.keccak256(raw) !== transaction.hash) {
      throw new Error('Serializing failed');
    }
    return raw;
  }

  private getNonEmptyValues(obj: any): any {
    const result: any = {};
    Object.keys(obj).forEach((key) => {
      if (obj[key]) {
        result[key] = obj[key];
      }
    });
    return result;
  }
}
