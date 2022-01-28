import ETHWallet from '../../src/wallets/eth';

import Constants from '../constants';

describe('ETHWallet', function () {
  describe('#createWallet()', function () {
    it('should create a address', async function () {
      const wallet = await new ETHWallet(Constants.NETWORK_TESTNET).createWallet();
      console.log(wallet);
    });
  });

  describe('#importWallet()', function () {
    it('should import a address', async function () {
      const wallet = await new ETHWallet(Constants.NETWORK_TESTNET).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet);
    });
  });
});
