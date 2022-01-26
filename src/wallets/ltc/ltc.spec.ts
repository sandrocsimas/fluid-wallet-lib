/* eslint-disable prefer-arrow-callback, func-names */

import LTCWallet from '.';

import { WalletEnvConfig } from '../../models/env-config';

import BlockchainInfoProvider from '../../providers/blockchain-info';

const network = 'testnet';
const walletEnvConfig: WalletEnvConfig = {
  provider: new BlockchainInfoProvider(),
};

describe('LTCWallet', function () {
  describe('#createWallet()', function () {
    it('should create a native segwit address by default', async function () {
      const wallet = await new LTCWallet(network, walletEnvConfig).createWallet();
      console.log(wallet);
    });

    it('should create a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new LTCWallet(network, walletEnvConfig).createWallet('p2pkh');
      console.log(wallet);
    });
  });

  describe('#importWallet()', function () {
    it('should import a native segwit address by default', async function () {
      const wallet = await new LTCWallet(network, walletEnvConfig).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet);
    });

    it('should import a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new LTCWallet(network, walletEnvConfig).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock', 'p2pkh');
      console.log(wallet);
    });
  });
});
