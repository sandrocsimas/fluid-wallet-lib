import Balance from '../models/balance';
import { Transaction, UnspentTransaction } from '../models/transaction';

export default abstract class BaseProvider {
  public readonly symbol: string;

  public readonly network: string;

  private connected = false;

  public constructor(symbol: string, network: string) {
    this.symbol = symbol;
    this.network = network;
    if (!this.isSupportedBlockchain(symbol, network)) {
      throw new Error('Blockchain not supported');
    }
  }

  protected abstract isSupportedBlockchain(symbol: string, network: string): boolean;

  protected abstract doConnect(): Promise<void>;

  protected abstract doGetBalance(address: string): Promise<Balance>;

  protected abstract doGetTransaction(hash: string): Promise<Transaction>;

  protected abstract doListUnspent(address: string): Promise<UnspentTransaction[]>;

  protected abstract doBroadcastTransaction(transaction: Transaction): Promise<void>;

  public isConnected(): boolean {
    return this.connected;
  }

  public async connect(): Promise<void> {
    if (this.connected) {
      throw new Error('Provider already connected');
    }
    await this.doConnect();
    this.connected = true;
  }

  public getBalance(address: string): Promise<Balance> {
    this.assertConnected();
    return this.doGetBalance(address);
  }

  public getTransaction(hash: string): Promise<Transaction> {
    this.assertConnected();
    return this.doGetTransaction(hash);
  }

  public listUnspent(address: string): Promise<UnspentTransaction[]> {
    this.assertConnected();
    return this.doListUnspent(address);
  }

  public broadcastTransaction(transaction: Transaction): Promise<void> {
    this.assertConnected();
    return this.doBroadcastTransaction(transaction);
  }

  private assertConnected(): void {
    if (!this.connected) {
      throw new Error('Provider not connected');
    }
  }
}
