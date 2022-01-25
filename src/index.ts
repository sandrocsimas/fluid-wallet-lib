import Config from './config';
import BTCWallet from './wallets/btc';
import LTCWallet from './wallets/ltc';
import ETHWallet from './wallets/eth';

export default class Wallets {
  static config = new Config();

  static btc = new BTCWallet(Wallets.config);

  static ltc = new LTCWallet(Wallets.config);

  static eth = new ETHWallet(Wallets.config);

  private constructor() {

  }
}
