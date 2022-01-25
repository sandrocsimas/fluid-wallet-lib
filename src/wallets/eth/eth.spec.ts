/* eslint-disable prefer-arrow-callback, func-names */

import Config from '../../config';
import ETHWallet from '.';

const config = new Config({ network: 'testnet' });

describe('eth', function () {
  describe('#createWallet()', function () {
    it('should create a address', async function () {
      const wallet = await new ETHWallet(config).createWallet();
      console.log(wallet);
    });
  });

  describe('#importWallet()', function () {
    it('should import a address', async function () {
      const wallet = await new ETHWallet(config).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet);
    });
  });
});
