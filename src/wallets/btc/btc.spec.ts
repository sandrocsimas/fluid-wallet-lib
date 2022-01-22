/* eslint-disable prefer-arrow-callback, func-names */

import Config from '../../config';
import BTCWallet from '.';

const config = new Config({ network: 'regtest' });

describe('btc', function () {
  describe('#createWallet()', function () {
    it('should create a native segwit address by default', async function () {
      const wallet = await new BTCWallet(config).createWallet();
      console.log(wallet);
    });
  });

  describe('#importWallet()', function () {
    it('should import a native segwit address by default', async function () {
      const wallet = await new BTCWallet(config).importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet);
    });
  });

  describe('#createTransaction()', function () {
    it('should create a transaction', async function () {
      const fromAddress = 'bcrt1q8yu68tvmqrxtn528vujhz96x9zxfnmhhn9j78x';
      const privateKey = 'cTuc3sRj3jhYMorfAj9TkyKYQ7BXQyUzqfHM9R4Yawhh1FpCtGgM';
      const inputs = [
        {
          hash: '26050469cf1fcd026f22ecbac67116d85e5f3d28bea4719c920b3167ba59c35c',
          vout: 0,
          value: 1250000000,
          raw: '020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff05029e010101ffffffff02807c814a000000001600143939a3ad9b00ccb9d1476725711746288c99eef70000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000',
        },
      ];
      const outputs = [
        {
          address: 'mus1omSG8Dxy7KxEBZ1i21sH8juWKZJ8h9',
          value: 10000000,
        },
        {
          address: fromAddress,
          value: 1239977400,
        },
      ];
      const transaction = await new BTCWallet(config).createTransaction(fromAddress, privateKey, inputs, outputs);
      console.log(transaction);
    });
  });
});
