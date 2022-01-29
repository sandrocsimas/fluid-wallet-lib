import MnemonicWords from './mnemonic-words';
import BaseWallet from '../base-wallet';
import Wallet from '../../models/wallet';
import WalletConfig from '../../models/wallet-config';
import { Transaction } from '../../models/transaction';
export default class ETHWallet extends BaseWallet {
    mnemonicWords: MnemonicWords;
    createWallet(addressFormat?: string): Promise<Wallet>;
    importWallet(mnemonic: string, addressFormat?: string): Promise<Wallet>;
    send(privateKey: string, fromAddress: string, toAddess: string, changeAddress: string | undefined, amount: string): Promise<Transaction>;
    protected getWalletConfig(): WalletConfig;
    private getDerivationPath;
    private getWalletDetails;
}
