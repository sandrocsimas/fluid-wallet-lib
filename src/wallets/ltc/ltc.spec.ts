/* eslint-disable prefer-arrow-callback, func-names */

import Config from '../../config';
import LTCWallet from '.';

const config = new Config({ network: 'testnet' });

describe('ltc', function () {
  describe('#createWallet()', function () {
    it('should create a native segwit address by default', async function () {
      const wallet = await new LTCWallet(config).createWallet();
      console.log(wallet);
    });

    it('should create a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new LTCWallet(config).createWallet('p2pkh');
      console.log(wallet);
    });
  });

  describe('#importWallet()', function () {
    it('should import a native segwit address by default', async function () {
      const wallet = await new LTCWallet(config).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet);
    });

    it('should import a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new LTCWallet(config).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock', 'p2pkh');
      console.log(wallet);
    });
  });
});
