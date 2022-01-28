import LTCWallet from '../../src/wallets/ltc';

import Constants from '../constants';

describe('LTCWallet', function () {
  describe('#createWallet()', function () {
    it('should create a native segwit address by default', async function () {
      const wallet = await new LTCWallet(Constants.NETWORK_TESTNET).createWallet();
      console.log(wallet);
    });

    it('should create a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new LTCWallet(Constants.NETWORK_TESTNET).createWallet('p2pkh');
      console.log(wallet);
    });
  });

  describe('#importWallet()', function () {
    it('should import a native segwit address by default', async function () {
      const wallet = await new LTCWallet(Constants.NETWORK_TESTNET).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet);
    });

    it('should import a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new LTCWallet(Constants.NETWORK_TESTNET).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock', 'p2pkh');
      console.log(wallet);
    });
  });
});
