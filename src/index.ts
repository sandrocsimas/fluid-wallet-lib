import Config from './config';
import BTCWallet from './wallets/btc';

export default class Wallets {
  static config = new Config();

  static btc = new BTCWallet(Wallets.config);

  private constructor() {

  }
}
