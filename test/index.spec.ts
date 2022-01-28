import { expect } from 'chai';

import Constants from './constants';

import Wallets from '../src';

import BTCWallet from '../src/wallets/btc';

describe('Wallets', function () {
  describe('#BTC', function () {
    it('should get an instance of BTCWallet', async function () {
      const btcWallet = new Wallets.BTC(Constants.NETWORK_TESTNET);
      expect(btcWallet).to.be.instanceOf(BTCWallet);
    });
  });
});
