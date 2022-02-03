import chai, { expect } from 'chai';
import chaiString from 'chai-string';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import BlockchainInfoProvider from '../../src/providers/blockchain-info';

import BTCWallet from '../../src/wallets/btc';

import Constants from '../constants';

chai.use(chaiString);
chai.use(sinonChai);

describe('BTCWallet', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('#createWallet()', function () {
    it('should create a native segwit address by default', async function () {
      const wallet = await new BTCWallet(Constants.NETWORK_TESTNET).createWallet();

      expect(wallet.address).to.startWith('tb1q');
      expect(wallet.address_format).to.equal('p2wpkh');
      expect(wallet.derivation_path).to.equal("m/84'/0'/0'/0/0");
      expect(wallet.mnemonic.split(' ')).to.have.lengthOf(12);
      expect(wallet.seed).to.have.lengthOf(128);
      expect(wallet.public_key).to.have.lengthOf(66);
      expect(wallet.private_key).to.have.lengthOf(52);
    });

    it('should create a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new BTCWallet(Constants.NETWORK_TESTNET).createWallet('p2pkh');

      expect(wallet.address).to.satisfy((value: string) => value.startsWith('m') || value.startsWith('n'));
      expect(wallet.address_format).to.equal('p2pkh');
      expect(wallet.derivation_path).to.equal("m/44'/0'/0'/0/0");
      expect(wallet.mnemonic.split(' ')).to.have.lengthOf(12);
      expect(wallet.seed).to.have.lengthOf(128);
      expect(wallet.public_key).to.have.lengthOf(66);
      expect(wallet.private_key).to.have.lengthOf(52);
    });
  });

  describe('#importWallet()', function () {
    it('should import a native segwit address by default', async function () {
      const mnemonic = 'front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock';
      const wallet = await new BTCWallet(Constants.NETWORK_TESTNET).importWallet(mnemonic);

      expect(wallet.address).to.equal('tb1q6fx9npfm7p7zzlfsy5nkzydqzv3f656ruzs60k');
      expect(wallet.address_format).to.equal('p2wpkh');
      expect(wallet.derivation_path).to.equal("m/84'/0'/0'/0/0");
      expect(wallet.mnemonic).to.equal(mnemonic);
      expect(wallet.seed).to.equal('7bb10dad42fa92ee8fdc2969737a2c5fa4cefa1492cba9d3d4dae30fc317db3ca14b9d94d39b2bea9035b5d43951b5a0719893abed068a949911702cf3eaa751');
      expect(wallet.public_key).to.equal('037929850a09a28e71e54562256257d5063c7deca8ef017e52d50ad40f1aa595c0');
      expect(wallet.private_key).to.equal('cNiphFgHzAmW3Jn6ww8K5MGtXLYe13dciW55ekutd8FXDeDHJeev');
    });

    it('should import a legacy address when p2pkh is passed as parameter', async function () {
      const mnemonic = 'front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock';
      const wallet = await new BTCWallet(Constants.NETWORK_TESTNET).importWallet(mnemonic, 'p2pkh');

      expect(wallet.address).to.equal('mqHYQ49xxNkPsPsMUc8DECWnkLBwBPp3VG');
      expect(wallet.address_format).to.equal('p2pkh');
      expect(wallet.derivation_path).to.equal("m/44'/0'/0'/0/0");
      expect(wallet.mnemonic).to.equal(mnemonic);
      expect(wallet.seed).to.equal('7bb10dad42fa92ee8fdc2969737a2c5fa4cefa1492cba9d3d4dae30fc317db3ca14b9d94d39b2bea9035b5d43951b5a0719893abed068a949911702cf3eaa751');
      expect(wallet.public_key).to.equal('02346ac782b1abaa0847560cf47f8a597b255f00f738f8a1aec743f0cee02f6b14');
      expect(wallet.private_key).to.equal('cVbhyfuF3icwr8agcPB7H4WkyHoNPyKqZXoi3cFErbmRW6UrniHz');
    });
  });

  describe('#getWalletSummary()', function () {
    it('should get wallet summary with the address balance', async function () {
      const address = '1BYsmmrrfTQ1qm7KcrSLxnX7SaKQREPYFP';
      const provider = new BlockchainInfoProvider('btc', Constants.NETWORK_MAINNET);
      const mock = sinon.stub(provider, 'getBalance').withArgs(address).returns(Promise.resolve({ value: '1334623579' }));

      const btcWallet = new BTCWallet(Constants.NETWORK_MAINNET);
      await btcWallet.connect(provider);

      const walletSummary = await btcWallet.getWalletSummary(address);
      expect(mock).to.be.calledOnce;
      expect(walletSummary).to.eql({
        address,
        balance: '13.34623579',
      });
    });
  });
});
