import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';

import Constants from '../constants';

import BlockchainInfoProvider from '../../src/providers/blockchain-info';

import BaseProvider from '../../src/providers/base-provider';

async function getProvider(symbol: string, network: string): Promise<BaseProvider> {
  const provider = new BlockchainInfoProvider(symbol, network);
  await provider.connect();
  return provider;
}

describe('BlockchainInfoProvider', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('#constructor()', function () {
    it('should support only Bitcoin\'s mainnet blockchain', async function () {
      expect(() => new BlockchainInfoProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET)).to.not.throw();
      expect(() => new BlockchainInfoProvider(Constants.SYMBOL_BTC, Constants.NETWORK_TESTNET)).to.throw();

      expect(() => new BlockchainInfoProvider('ltc', Constants.NETWORK_MAINNET)).to.throw();
      expect(() => new BlockchainInfoProvider('ltc', Constants.NETWORK_TESTNET)).to.throw();
    });
  });

  describe('#getBalance()', function () {
    it('should get the address balance', async function () {
      const address = '1BYsmmrrfTQ1qm7KcrSLxnX7SaKQREPYFP';
      const mock = sinon.stub(axios, 'get').withArgs(`https://blockchain.info/balance?active=${address}`).returns(Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          [address]: {
            final_balance: 1334623579,
            n_tx: 360,
            total_received: 1334623579,
          },
        },
      }));

      const provider = await getProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET);

      const balance = await provider.getBalance(address);
      sinon.assert.calledOnce(mock);
      expect(balance).to.eql({
        value: '1334623579',
      });
    });
  });

  describe('#getTransaction()', function () {
    it('should get the transaction information', async function () {
      const txHash = 'aaec2d6567bcabf1c0a827177b92bf40ed00e5bde0b11dd75d1b9b6ba0048d12';
      const txHex = '010000000153c79a67efd273e211d281eeb33d6a1948bf829a50ab98bc84047d6d5aeff979000000008a4730440220485f6389729dbe827c222b48c9ce27deee1d99cce005a37742df1678374383e60220196b06f5c0f356af4b4e3cf6d0a6e145161b3534b0b2e8175f11a5e231fca3c9014104a5fb9ade88da74fc9e0b68185633f25e0fd928888c022271c1bea53e0cfe529eec278ad8b5318446659f19bbc84ce2cb3d8c9c837312b4d1c9e18873ce6bca8cffffffff02a0860100000000001976a91473b888f254656b78dc6ededf2cb58e26249129f188ac806d0d00000000001976a91484d6f1f013bbcc3106e31609a6ea04b9a005c69688ac00000000';
      const mock = sinon.stub(axios, 'get').withArgs(`https://blockchain.info/rawtx/${txHash}?format=hex`).returns(Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: txHex,
      }));

      const provider = await getProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET);

      const transaction = await provider.getTransaction(txHash);
      sinon.assert.calledOnce(mock);
      expect(transaction).to.eql({
        hash: txHash,
        hex: txHex,
      });
    });
  });

  describe('#listUnspent()', function () {
    it('should list the address\' unpent transactions', async function () {
      const address = '1BYsmmrrfTQ1qm7KcrSLxnX7SaKQREPYFP';
      const mock = sinon.stub(axios, 'get').withArgs(`https://blockchain.info/unspent?active=${address}&limit=1000`).returns(Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          unspent_outputs: [
            {
              tx_hash_big_endian: '748a8182cb29a60f1ef207024ecf4354ff4403a5e7d74bee24b92499fa1728ea',
              tx_hash: 'ea2817fa9924b924ee4bd7e7a50344ff5443cf4e0207f21e0fa629cb82818a74',
              tx_output_n: 29,
              script: '76a91473b888f254656b78dc6ededf2cb58e26249129f188ac',
              value: 2100300,
              value_hex: '200c4c',
              confirmations: 454626,
              tx_index: 8238653500499095,
            },
            {
              tx_hash_big_endian: '53879d2ef6e0894a97b7cdb57c5e337eac9b18828018e6d4b480ebf7f3685c13',
              tx_hash: '135c68f3f7eb80b4d4e6188082189bac7e335e7cb5cdb7974a89e0f62e9d8753',
              tx_output_n: 28,
              script: '76a91473b888f254656b78dc6ededf2cb58e26249129f188ac',
              value: 2117300,
              value_hex: '204eb4',
              confirmations: 455221,
              tx_index: 681203799620976,
            },
          ],
        },
      }));

      const provider = await getProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET);

      const utxos = await provider.listUnspent('1BYsmmrrfTQ1qm7KcrSLxnX7SaKQREPYFP');
      sinon.assert.calledOnce(mock);
      expect(utxos).to.have.lengthOf(2);
      expect(utxos[0]).to.eql({
        hash: '748a8182cb29a60f1ef207024ecf4354ff4403a5e7d74bee24b92499fa1728ea',
        vout: 29,
        value: 2100300,
      });
      expect(utxos[1]).to.eql({
        hash: '53879d2ef6e0894a97b7cdb57c5e337eac9b18828018e6d4b480ebf7f3685c13',
        vout: 28,
        value: 2117300,
      });
    });
  });
});
