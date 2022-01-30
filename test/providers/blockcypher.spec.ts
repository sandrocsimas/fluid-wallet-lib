import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';

import Constants from '../constants';

import BlockCypherProvider from '../../src/providers/blockcypher';

import BaseProvider from '../../src/providers/base-provider';

const ADDRESS = '1BYsmmrrfTQ1qm7KcrSLxnX7SaKQREPYFP';

async function getProvider(symbol: string, network: string): Promise<BaseProvider> {
  const provider = new BlockCypherProvider(symbol, network);
  await provider.connect();
  return provider;
}

describe('BlockCypherProvider', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('#constructor()', function () {
    it('should support some blockchains', async function () {
      expect(() => new BlockCypherProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET)).to.not.throw();
      expect(() => new BlockCypherProvider(Constants.SYMBOL_BTC, Constants.NETWORK_TESTNET)).to.not.throw();

      expect(() => new BlockCypherProvider('dash', Constants.NETWORK_MAINNET)).to.not.throw();
      expect(() => new BlockCypherProvider('dash', Constants.NETWORK_TESTNET)).to.throw();

      expect(() => new BlockCypherProvider('doge', Constants.NETWORK_MAINNET)).to.not.throw();
      expect(() => new BlockCypherProvider('doge', Constants.NETWORK_TESTNET)).to.throw();

      expect(() => new BlockCypherProvider('ltc', Constants.NETWORK_MAINNET)).to.not.throw();
      expect(() => new BlockCypherProvider('ltc', Constants.NETWORK_TESTNET)).to.throw();
    });
  });

  describe('#getBalance()', function () {
    it('should get the address balance', async function () {
      const mock = sinon.stub(axios, 'get').withArgs(`https://api.blockcypher.com/v1/btc/main/addrs/${ADDRESS}/balance`).returns(Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          address: ADDRESS,
          total_received: 1334623579,
          total_sent: 0,
          balance: 1334623579,
          unconfirmed_balance: 0,
          final_balance: 1334623579,
          n_tx: 360,
          unconfirmed_n_tx: 0,
          final_n_tx: 360,
        },
      }));

      const provider = await getProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET);

      const balance = await provider.getBalance(ADDRESS);
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
      const mock = sinon.stub(axios, 'get').withArgs(`https://api.blockcypher.com/v1/btc/main/txs/${txHash}?includeHex=true`).returns(Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          block_hash: '000000000000000000198734479ddae1e9261c4703aad5fab4eadc1cf2a2c3e4',
          block_height: 391864,
          block_index: 573,
          hash: txHash,
          hex: txHex,
          addresses: [
            '12WQ7t1kcd6vHfgNy8RfL4Hn22Rpz1PjQi',
            ADDRESS,
            '1D7Pgy5Yg8uUb8y4AePwqXSpeACR4cSZuG',
          ],
          total: 980000,
          fees: 10000,
          size: 257,
          vsize: 257,
          preference: 'low',
          relayed_by: '74.84.128.158:8333',
          confirmed: '2016-01-05T12:51:10Z',
          received: '2016-01-05T12:47:11.309Z',
          ver: 1,
          double_spend: false,
          vin_sz: 1,
          vout_sz: 2,
          confirmations: 329141,
          confidence: 1,
          inputs: [
            {
              prev_hash: '79f9ef5a6d7d0484bc98ab509a82bf48196a3db3ee81d211e273d2ef679ac753',
              output_index: 0,
              script: '4730440220485f6389729dbe827c222b48c9ce27deee1d99cce005a37742df1678374383e60220196b06f5c0f356af4b4e3cf6d0a6e145161b3534b0b2e8175f11a5e231fca3c9014104a5fb9ade88da74fc9e0b68185633f25e0fd928888c022271c1bea53e0cfe529eec278ad8b5318446659f19bbc84ce2cb3d8c9c837312b4d1c9e18873ce6bca8c',
              output_value: 990000,
              sequence: 4294967295,
              addresses: ['12WQ7t1kcd6vHfgNy8RfL4Hn22Rpz1PjQi'],
              script_type: 'pay-to-pubkey-hash',
              age: 391863,
            },
          ],
          outputs: [
            {
              value: 100000,
              script: '76a91473b888f254656b78dc6ededf2cb58e26249129f188ac',
              addresses: [ADDRESS],
              script_type: 'pay-to-pubkey-hash',
            },
            {
              value: 880000,
              script: '76a91484d6f1f013bbcc3106e31609a6ea04b9a005c69688ac',
              spent_by: '0a85a2fe7635fde5708efb7c02ed7f4540043fb39aea5527632d17359020384b',
              addresses: ['1D7Pgy5Yg8uUb8y4AePwqXSpeACR4cSZuG'],
              script_type: 'pay-to-pubkey-hash',
            },
          ],
        },
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
      const mock = sinon.stub(axios, 'get').withArgs(`https://api.blockcypher.com/v1/btc/main/addrs/${ADDRESS}?unspentOnly=true&limit=2000`).returns(Promise.resolve({
        status: 200,
        statusText: 'OK',
        data: {
          address: ADDRESS,
          total_received: 1334623579,
          total_sent: 0,
          balance: 1334623579,
          unconfirmed_balance: 0,
          final_balance: 1334623579,
          n_tx: 360,
          unconfirmed_n_tx: 0,
          final_n_tx: 360,
          txrefs: [
            {
              tx_hash: '748a8182cb29a60f1ef207024ecf4354ff4403a5e7d74bee24b92499fa1728ea',
              block_height: 266374,
              tx_input_n: -1,
              tx_output_n: 29,
              value: 2100300,
              ref_balance: 1309700002,
              spent: false,
              confirmations: 454632,
              confirmed: '2013-10-27T14:00:16Z',
              double_spend: false,
            },
            {
              tx_hash: '53879d2ef6e0894a97b7cdb57c5e337eac9b18828018e6d4b480ebf7f3685c13',
              block_height: 265779,
              tx_input_n: -1,
              tx_output_n: 28,
              value: 2117300,
              ref_balance: 1307599702,
              spent: false,
              confirmations: 455227,
              confirmed: '2013-10-24T17:46:15Z',
              double_spend: false,
            },
          ],
          tx_url: 'https://api.blockcypher.com/v1/btc/main/txs/',
        },
      }));

      const provider = await getProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET);

      const utxos = await provider.listUnspent(ADDRESS);
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

  describe('#broadcastTransaction()', function () {
    it('should broadcast the transaction through the network', async function () {
      const txHash = 'aaec2d6567bcabf1c0a827177b92bf40ed00e5bde0b11dd75d1b9b6ba0048d12';
      const txHex = '010000000153c79a67efd273e211d281eeb33d6a1948bf829a50ab98bc84047d6d5aeff979000000008a4730440220485f6389729dbe827c222b48c9ce27deee1d99cce005a37742df1678374383e60220196b06f5c0f356af4b4e3cf6d0a6e145161b3534b0b2e8175f11a5e231fca3c9014104a5fb9ade88da74fc9e0b68185633f25e0fd928888c022271c1bea53e0cfe529eec278ad8b5318446659f19bbc84ce2cb3d8c9c837312b4d1c9e18873ce6bca8cffffffff02a0860100000000001976a91473b888f254656b78dc6ededf2cb58e26249129f188ac806d0d00000000001976a91484d6f1f013bbcc3106e31609a6ea04b9a005c69688ac00000000';
      const mock = sinon.stub(axios, 'post').withArgs('https://api.blockcypher.com/v1/btc/main/txs/push', { tx: txHex }).returns(Promise.resolve({
        status: 200,
        statusText: 'OK',
      }));

      const provider = await getProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET);

      const transaction = await provider.broadcastTransaction({ hash: txHash, hex: txHex });
      sinon.assert.calledOnce(mock);
      expect(transaction).to.eql({
        hash: txHash,
        hex: txHex,
      });
    });
  });
});
