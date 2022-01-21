'use strict';

const assert = require('assert');
const bitcoin = require('bitcoinjs-lib');
const wallets = require('../lib');

describe('btc', () => {
  before(() => {
    wallets.config.network = 'regtest';
  });

  describe('#createWallet()', () => {
    it('should create a native segwit address by default', async () => {
      const wallet = await wallets.btc.createWallet();
      console.log(wallet)
    });
  });

  describe('#importWallet()', () => {
    it('should import a native segwit address by default', async() => {
      const wallet = await wallets.btc.importWallet('front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock');
      console.log(wallet)
    });
  });

 describe('#createTransaction()', () => {
    it('should create a transaction', async() => {
      const privateKey = 'cTuc3sRj3jhYMorfAj9TkyKYQ7BXQyUzqfHM9R4Yawhh1FpCtGgM';
      const inputs = [{
        hash: "26050469cf1fcd026f22ecbac67116d85e5f3d28bea4719c920b3167ba59c35c",
        vout: 0,
        value: 1250000000,
        raw: "020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff05029e010101ffffffff02807c814a000000001600143939a3ad9b00ccb9d1476725711746288c99eef70000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000"
      }];
      const outputs = [
        {
          address: "mus1omSG8Dxy7KxEBZ1i21sH8juWKZJ8h9",
          value: 10000000,
        },
        {
          address: "bcrt1q8yu68tvmqrxtn528vujhz96x9zxfnmhhn9j78x",
          value: 1239977400,
        }
      ];
      const transaction = await wallets.btc.createTransaction(privateKey, inputs, outputs);
      console.log(transaction);
    });
  });
});
