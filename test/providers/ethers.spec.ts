import { expect } from 'chai';
import { ethers } from 'ethers';

import Constants from '../constants';

import EthersProvider from '../../src/providers/ethers';

import BaseProvider from '../../src/providers/base-provider';

const ADDRESS = '0x866c32f1e3543F715c34DE389C17E434a3D773F7';

async function getProvider(network: string): Promise<BaseProvider> {
  const provider = new EthersProvider(new ethers.providers.EtherscanProvider(network));
  await provider.connect();
  return provider;
}

describe('EthersProvider', function () {
  this.timeout(5000);

  describe('#constructor()', function () {
    it('should support only Bitcoin\'s mainnet blockchain', async function () {
      // expect(() => new EthersProvider(Constants.NETWORK_MAINNET)).to.not.throw();
      // expect(() => new EthersProvider(Constants.NETWORK_TESTNET)).to.throw();
    });
  });

  // describe('#getBalance()', function () {
  //   it('should get the address balance', async function () {
  //     const provider = await getProvider(Constants.NETWORK_MAINNET);

  //     const balance = await provider.getBalance(ADDRESS);
  //     expect(balance.value).to.equal(1334623579);
  //   });
  // });

  describe('#getTransaction()', function () {
    it('should get the transaction information', async function () {
      const provider = await getProvider(Constants.NETWORK_MAINNET);

      const transaction = await provider.getTransaction('0xf826ae2fdf19f3dd17eb59b430c671af4eaeab0c2633d4f147c2788a30b6109c');
      expect(transaction.hash).to.equal('aaec2d6567bcabf1c0a827177b92bf40ed00e5bde0b11dd75d1b9b6ba0048d12');
      expect(transaction.hex).to.equal('010000000153c79a67efd273e211d281eeb33d6a1948bf829a50ab98bc84047d6d5aeff979000000008a4730440220485f6389729dbe827c222b48c9ce27deee1d99cce005a37742df1678374383e60220196b06f5c0f356af4b4e3cf6d0a6e145161b3534b0b2e8175f11a5e231fca3c9014104a5fb9ade88da74fc9e0b68185633f25e0fd928888c022271c1bea53e0cfe529eec278ad8b5318446659f19bbc84ce2cb3d8c9c837312b4d1c9e18873ce6bca8cffffffff02a0860100000000001976a91473b888f254656b78dc6ededf2cb58e26249129f188ac806d0d00000000001976a91484d6f1f013bbcc3106e31609a6ea04b9a005c69688ac00000000');
    });
  });

  // describe('#listUnspent()', function () {
  //   it('should list the address\' unpent transactions', async function () {
  //     const provider = await getProvider(Constants.NETWORK_MAINNET);

  //     const utxos = await provider.listUnspent(ADDRESS);
  //     expect(utxos).to.have.lengthOf(360);

  //     const firstUtxo = utxos[0];
  //     expect(firstUtxo.hash).to.equal('aaec2d6567bcabf1c0a827177b92bf40ed00e5bde0b11dd75d1b9b6ba0048d12');
  //     expect(firstUtxo.vout).to.equal(0);
  //     expect(firstUtxo.value).to.equal(100000);
  //   });
  // });
});
