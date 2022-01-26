/* eslint-disable prefer-arrow-callback, func-names */

import ETHWallet from '.';

import { WalletEnvConfig } from '../../models/env-config';

const network = 'testnet';
const walletEnvConfig: WalletEnvConfig = {};

describe('ETHWallet', function () {
  describe('#createWallet()', function () {
    it('should create a address', async function () {
      const wallet = await new ETHWallet(network, walletEnvConfig).createWallet();
      console.log(wallet);
    });
  });

  describe('#importWallet()', function () {
    it('should import a address', async function () {
      const wallet = await new ETHWallet(network, walletEnvConfig).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet);
    });
  });
});
