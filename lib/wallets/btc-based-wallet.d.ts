import BaseWallet from './base-wallet';
import Wallet from '../models/wallet';
import { Transaction } from '../models/transaction';
export default abstract class BTCBasedWallet extends BaseWallet {
    private bip32Factory;
    private ecPairFactory;
    createWallet(addressFormat?: string): Promise<Wallet>;
    importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet>;
    send(privateKey: string, fromAddress: string, toAddess: string, changeAddress: string | undefined, amount: string): Promise<Transaction>;
    protected convertUnit(value: string): string;
    private getNetwork;
    private getDerivationPath;
    private getAddressFormat;
    private getScriptPubKey;
    private isWitness;
    private validateInputSignature;
    private getWalletDetails;
    private getTransactionParams;
}
