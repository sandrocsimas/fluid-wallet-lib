import BTCWallet from '../../src/wallets/btc';

import Constants from '../constants';

describe('BTCWallet', function () {
  describe('#createWallet()', function () {
    it('should create a native segwit address by default', async function () {
      const wallet = await new BTCWallet(Constants.NETWORK_REGTEST).createWallet();
      console.log(wallet);
    });

    it('should create a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new BTCWallet(Constants.NETWORK_REGTEST).createWallet('p2pkh');
      console.log(wallet);
    });
  });

  describe('#importWallet()', function () {
    it('should import a native segwit address by default', async function () {
      const wallet = await new BTCWallet(Constants.NETWORK_REGTEST).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet);
    });

    it('should import a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new BTCWallet(Constants.NETWORK_REGTEST).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock', 'p2pkh');
      console.log(wallet);
    });
  });
});
