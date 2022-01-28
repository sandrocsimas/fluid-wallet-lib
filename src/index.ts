import * as bip39 from 'bip39';

import mnemonicWords from './wallets/mnemonic-words.json';

import BTCWallet from './wallets/btc';
import ETHWallet from './wallets/eth';
import LTCWallet from './wallets/ltc';

export default class Wallets {
  public static BTC = BTCWallet;

  public static LTC = LTCWallet;

  public static ETH = ETHWallet;

  public static generateMnemonic(): string {
    return bip39.generateMnemonic(undefined, undefined, mnemonicWords);
  }
}
