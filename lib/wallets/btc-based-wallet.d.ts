import BaseWallet from './base-wallet';
import Wallet from '../models/wallet';
import { Transaction } from '../models/transaction';
export default abstract class BTCBasedWallet extends BaseWallet {
    private bip32Factory;
    private ecPairFactory;
    createWallet(addressFormat?: string): Promise<Wallet>;
    importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet>;
    send(fromAddress: string, toAddess: string, changeAddress: string | undefined, privateKey: string, amount: number): Promise<Transaction>;
    private getNetwork;
    private getScriptPubKey;
    private validateInputSignature;
    private getWalletDetails;
    private getTransactionParams;
}
