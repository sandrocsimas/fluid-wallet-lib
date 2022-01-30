import { expect } from 'chai';
import * as jayson from 'jayson/promise';
import sinon, { SinonStub } from 'sinon';

import Constants from '../constants';

import ElectrumProvider from '../../src/providers/electrum';

import BaseProvider from '../../src/providers/base-provider';

const ADDRESS = '1BYsmmrrfTQ1qm7KcrSLxnX7SaKQREPYFP';
const RPC_CONFIG = { host: 'localhost', port: 50002, rejectUnauthorized: false };

async function getProvider(symbol: string, network: string): Promise<BaseProvider> {
  const provider = new ElectrumProvider(symbol, network, RPC_CONFIG);
  await provider.connect();
  return provider;
}

function mockRpcRequest(method: string, args: any[], response: Object): SinonStub<[string, jayson.RequestParamsLike, jayson.JSONRPCIDLike?], Promise<jayson.JSONRPCResultLike>> {
  const rpcClient = jayson.client.tls();
  sinon.stub(jayson.Client, 'tls').withArgs(RPC_CONFIG).returns(rpcClient);
  const requestMock = (sinon.stub(rpcClient, 'request') as unknown as SinonStub<[string, jayson.RequestParamsLike, jayson.JSONRPCIDLike?], Promise<jayson.JSONRPCResultLike>>)
    .withArgs(method, args).returns(Promise.resolve(response));
  return requestMock;
}

describe('ElectrumProvider', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('#constructor()', function () {
    it('should support some blockchains', async function () {
      expect(() => new ElectrumProvider(Constants.SYMBOL_BTC, Constants.NETWORK_MAINNET, RPC_CONFIG)).to.not.throw();
      expect(() => new ElectrumProvider(Constants.SYMBOL_BTC, Constants.NETWORK_TESTNET, RPC_CONFIG)).to.not.throw();
      expect(() => new ElectrumProvider(Constants.SYMBOL_BTC, Constants.NETWORK_REGTEST, RPC_CONFIG)).to.not.throw();

      expect(() => new ElectrumProvider('ltc', Constants.NETWORK_MAINNET, RPC_CONFIG)).to.not.throw();
      expect(() => new ElectrumProvider('ltc', Constants.NETWORK_TESTNET, RPC_CONFIG)).to.not.throw();
      expect(() => new ElectrumProvider('ltc', Constants.NETWORK_REGTEST, RPC_CONFIG)).to.throw();
    });
  });

  describe('#getBalance()', function () {
    it('should get the address balance', async function () {
      const mock = mockRpcRequest('blockchain.scripthash.get_balance', ['5a259234859489dbc8ff3e85362c675c7d8a1592b99e4414460aec6f2f0f9796'], {
        result: {
          confirmed: 1334623579,
          unconfirmed: 0,
        },
      });

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
      const mock = mockRpcRequest('blockchain.transaction.get', [txHash], {
        result: txHex,
      });

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
      const mock = mockRpcRequest('blockchain.scripthash.listunspent', ['5a259234859489dbc8ff3e85362c675c7d8a1592b99e4414460aec6f2f0f9796'], {
        result: [
          {
            tx_pos: 29,
            value: 2100300,
            tx_hash: '748a8182cb29a60f1ef207024ecf4354ff4403a5e7d74bee24b92499fa1728ea',
            height: 266374,
          },
          {
            tx_pos: 28,
            value: 2117300,
            tx_hash: '53879d2ef6e0894a97b7cdb57c5e337eac9b18828018e6d4b480ebf7f3685c13',
            height: 441696,
          },
        ],
      });

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
      const mock = mockRpcRequest('blockchain.transaction.broadcast', [txHex], {
        result: txHash,
      });

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
