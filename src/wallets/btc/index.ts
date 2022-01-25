import btcConfig from './btc-config';

import BTCBasedWallet from '../btc-based-wallet';

import WalletConfig from '../../models/wallet-config';

export default class BTCWallet extends BTCBasedWallet {
  protected getWalletConfig(): WalletConfig {
    return btcConfig;
  }
}
