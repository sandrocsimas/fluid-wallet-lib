import Balance from '../models/balance';
import { Input, Transaction } from '../models/transaction';

export default interface Provider {
  getId(): string;
  getBalance(symbol: string, network: string, address: string): Promise<Balance>;
  getTransaction(symbol: string, network: string, hash: string): Promise<Transaction>;
  listUnspent(symbol: string, network: string, address: string): Promise<Input[]>;
  broadcastTransaction(symbol: string, network: string, transaction: Transaction): Promise<void>;
}
