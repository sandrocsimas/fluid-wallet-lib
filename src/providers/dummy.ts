import balance from '../models/balance';
import { Transaction } from '../models/transaction';
import Provider from './provider';

export default class DummyProvider implements Provider {
  public getId(): string {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public getBalance(address: string): Promise<balance> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public broadcastTransaction(transaction: Transaction): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
