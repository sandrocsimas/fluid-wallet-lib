import * as bip39 from 'bip39';

import EnvConfig, { WalletEnvConfig } from './models/env-config';

import mnemonicWords from './wallets/mnemonic-words.json';

import BaseWallet from './wallets/base-wallet';
import BTCWallet from './wallets/btc';
import LTCWallet from './wallets/ltc';
import ETHWallet from './wallets/eth';
import DummyWallet from './wallets/dummy-wallet';

export default class Wallets {
  public config: EnvConfig;

  public btc: BaseWallet;

  public ltc: BaseWallet;

  public eth: BaseWallet;

  public constructor(config: EnvConfig) {
    this.config = config;
    this.btc = this.createWallet('btc', (network, walletEnvConfig) => new BTCWallet(network, walletEnvConfig));
    this.ltc = this.createWallet('ltc', (network, walletEnvConfig) => new LTCWallet(network, walletEnvConfig));
    this.eth = this.createWallet('eth', (network, walletEnvConfig) => new ETHWallet(network, walletEnvConfig));
  }

  public generateMnemonic(): string {
    return bip39.generateMnemonic(undefined, undefined, mnemonicWords);
  }

  private createWallet(walletKey: string, createWalletFunction: (network: string, walletEnvConfig: WalletEnvConfig) => BaseWallet): BaseWallet {
    if (this.config.wallets[walletKey]) {
      return createWalletFunction(this.config.network, this.config.wallets[walletKey]);
    }
    return new DummyWallet(this.config.network, {});
  }
}
