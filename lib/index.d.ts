import BTCWallet from './wallets/btc';
import ETHWallet from './wallets/eth';
import LTCWallet from './wallets/ltc';
export default class Wallets {
    static BTC: typeof BTCWallet;
    static LTC: typeof LTCWallet;
    static ETH: typeof ETHWallet;
    static generateMnemonic(): string;
}
