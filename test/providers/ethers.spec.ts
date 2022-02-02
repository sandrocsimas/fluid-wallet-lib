import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { ethers } from 'ethers';

import Constants from '../constants';

import BaseProvider from '../../src/providers/base-provider';
import EthersProvider from '../../src/providers/ethers';

chai.use(chaiAsPromised);
chai.use(sinonChai);

const ADDRESS = '0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8';

async function getProviders(network: string): Promise<{ provider: BaseProvider, etherscanProvider: ethers.providers.EtherscanProvider }> {
  const etherscanProvider = new ethers.providers.EtherscanProvider(network);
  const provider = new EthersProvider(etherscanProvider);
  await provider.connect();
  return {
    provider,
    etherscanProvider,
  };
}

describe('EthersProvider', function () {
  this.timeout(5000);

  describe('#constructor()', function () {
    it('should support only Bitcoin\'s mainnet blockchain', async function () {
      await expect(getProviders('mainnet')).to.eventually.be.fulfilled;
      await expect(getProviders('testnet')).to.eventually.be.fulfilled;
      await expect(getProviders('homestead')).to.eventually.be.fulfilled;
      await expect(getProviders('ropsten')).to.eventually.be.fulfilled;
      await expect(getProviders('rinkeby')).to.eventually.be.fulfilled;
      await expect(getProviders('kovan')).to.eventually.be.fulfilled;
      await expect(getProviders('goerli')).to.eventually.be.fulfilled;

      await expect(getProviders('othernet')).to.eventually.be.rejectedWith('invalid network');
    });
  });

  describe('#getBalance()', function () {
    it('should get the address balance', async function () {
      const { provider, etherscanProvider } = await getProviders(Constants.NETWORK_MAINNET);

      const mock = sinon.stub(etherscanProvider, 'getBalance').withArgs(ADDRESS).returns(Promise.resolve(ethers.BigNumber.from('749043623802978142818')));

      const balance = await provider.getBalance(ADDRESS);
      expect(mock).to.be.calledOnce;
      expect(balance).to.eql({
        value: '749043623802978142818',
      });
    });
  });

  describe('#getTransaction()', function () {
    it('should get the transaction information', async function () {
      const txHash = '0x65d61b2359c91988a9002aa0cc317b999044b0d3b6c97b375888c69dc6bd26c1';
      const { provider, etherscanProvider } = await getProviders(Constants.NETWORK_MAINNET);

      const mock = sinon.stub(etherscanProvider, 'getTransaction').withArgs(txHash).returns(Promise.resolve({
        hash: txHash,
        type: 0,
        blockHash: '0xcce8b7e77feb3f64d64771febdb7b6e07c9a82d9c82d00a946a0158c5675934d',
        blockNumber: 2107971,
        transactionIndex: 0,
        confirmations: 12008100,
        from: '0x1151314c646Ce4E0eFD76d1aF4760aE66a9Fe30F',
        gasPrice: ethers.BigNumber.from('20000000000'),
        gasLimit: ethers.BigNumber.from('90000'),
        to: '0xc9b83ab54C84AAC4445B56a63033dB3D5B017764',
        value: ethers.BigNumber.from('2400000000000000000000'),
        nonce: 1559,
        data: '0x',
        r: '0x766d7410ba73887d0f09d1dd9944473a1b7b8b11c15eeea37a480dc81a49e71d',
        s: '0x5ec2827ebe8907bd77f2269474d25b607f4ded70a0b83c56e058632493af8187',
        v: 27,
        chainId: 0,
        wait: () => Promise.resolve({
          to: '0xc9b83ab54C84AAC4445B56a63033dB3D5B017764',
          from: '0x1151314c646Ce4E0eFD76d1aF4760aE66a9Fe30F',
          contractAddress: 'null',
          transactionIndex: 0,
          root: '0x33588618493a22408942baa982c1681f2421cf78f3dd10cc93f0059ef5fdc402',
          gasUsed: ethers.BigNumber.from('21000'),
          logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
          blockHash: '0xcce8b7e77feb3f64d64771febdb7b6e07c9a82d9c82d00a946a0158c5675934d',
          transactionHash: txHash,
          logs: [],
          blockNumber: 2107971,
          confirmations: 12008100,
          cumulativeGasUsed: ethers.BigNumber.from('21000'),
          effectiveGasPrice: ethers.BigNumber.from('20000000000'),
          type: 0,
          byzantium: true,
        }),
      }));

      const transaction = await provider.getTransaction(txHash);
      expect(mock).to.be.calledOnce;
      expect(transaction).to.eql({
        hash: txHash,
        raw: '0xf8708206178504a817c80083015f9094c9b83ab54c84aac4445b56a63033db3d5b01776489821ab0d44149800000801ba0766d7410ba73887d0f09d1dd9944473a1b7b8b11c15eeea37a480dc81a49e71da05ec2827ebe8907bd77f2269474d25b607f4ded70a0b83c56e058632493af8187',
      });
    });
  });
});
