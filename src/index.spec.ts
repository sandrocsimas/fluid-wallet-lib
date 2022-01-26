/* eslint-disable prefer-arrow-callback, func-names */

import Wallets from '.';

import EnvConfig from './models/env-config';

const envConfig: EnvConfig = {
  network: 'testnet',
  wallets: {
    btc: {},
  },
};

describe('Wallets', function () {
  describe('#btc', function () {
    it('should get an instance of BTCWallet', async function () {
      const btcWallet = new Wallets(envConfig).btc;
      console.log(btcWallet);
    });
  });
});
