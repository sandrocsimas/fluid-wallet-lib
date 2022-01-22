import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import Input from '../models/input';
import Output from '../models/output';

export default interface BaseWallet {

  createWallet(scriptPubKeyType?: string): Promise<Wallet>;

  importWallet(scriptPubKeyType?: string): Promise<Wallet>;

  createTransaction(fromAddress: string, privateKey: string, inputs: [Input], outputs: [Output]): Promise<Transaction>;

}
