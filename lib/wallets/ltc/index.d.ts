import BTCBasedWallet from '../btc-based-wallet';
import walletConfig from '../../models/wallet-config';
export default class LTCWallet extends BTCBasedWallet {
    protected getWalletConfig(): walletConfig;
}
