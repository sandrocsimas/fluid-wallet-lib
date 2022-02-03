import chai, { expect } from 'chai';
import chaiString from 'chai-string';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import BlockCypherProvider from '../../src/providers/blockcypher';

import LTCWallet from '../../src/wallets/ltc';

import Constants from '../constants';

chai.use(chaiString);
chai.use(sinonChai);

describe('LTCWallet', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('#createWallet()', function () {
    it('should create a native segwit address by default', async function () {
      const wallet = await new LTCWallet(Constants.NETWORK_TESTNET).createWallet();

      expect(wallet.address).to.startWith('tltc1q');
      expect(wallet.address_format).to.equal('p2wpkh');
      expect(wallet.derivation_path).to.equal("m/84'/2'/0'/0/0");
      expect(wallet.mnemonic.split(' ')).to.have.lengthOf(12);
      expect(wallet.seed).to.have.lengthOf(128);
      expect(wallet.public_key).to.have.lengthOf(66);
      expect(wallet.private_key).to.have.lengthOf(52);
    });

    it('should create a legacy address when p2pkh is passed as parameter', async function () {
      const wallet = await new LTCWallet(Constants.NETWORK_TESTNET).createWallet('p2pkh');

      expect(wallet.address).to.satisfy((value: string) => value.startsWith('m') || value.startsWith('n'));
      expect(wallet.address_format).to.equal('p2pkh');
      expect(wallet.derivation_path).to.equal("m/44'/2'/0'/0/0");
      expect(wallet.mnemonic.split(' ')).to.have.lengthOf(12);
      expect(wallet.seed).to.have.lengthOf(128);
      expect(wallet.public_key).to.have.lengthOf(66);
      expect(wallet.private_key).to.have.lengthOf(52);
    });
  });

  describe('#importWallet()', function () {
    it('should import a native segwit address by default', async function () {
      const mnemonic = 'front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock';
      const wallet = await new LTCWallet(Constants.NETWORK_TESTNET).importWallet(mnemonic);

      expect(wallet.address).to.equal('tltc1qxjdut7j5jvufwfgdfepsegadgdduem7prz6pyd');
      expect(wallet.address_format).to.equal('p2wpkh');
      expect(wallet.derivation_path).to.equal("m/84'/2'/0'/0/0");
      expect(wallet.mnemonic).to.equal(mnemonic);
      expect(wallet.seed).to.equal('7bb10dad42fa92ee8fdc2969737a2c5fa4cefa1492cba9d3d4dae30fc317db3ca14b9d94d39b2bea9035b5d43951b5a0719893abed068a949911702cf3eaa751');
      expect(wallet.public_key).to.equal('03ecf403aeb736e6e830f0df847f819e91cc9be2365567d76ed1564883fa015528');
      expect(wallet.private_key).to.equal('cPaHEMKCZE7KDNjseEjPBbmEexViAgixFQLaqZMvk8o7TVautGy7');
    });

    it('should import a legacy address when p2pkh is passed as parameter', async function () {
      const mnemonic = 'front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock';
      const wallet = await new LTCWallet(Constants.NETWORK_TESTNET).importWallet(mnemonic, 'p2pkh');

      expect(wallet.address).to.equal('mgXAwAskvDCGHcJy7hu9TRFYGYnNnWwwm5');
      expect(wallet.address_format).to.equal('p2pkh');
      expect(wallet.derivation_path).to.equal("m/44'/2'/0'/0/0");
      expect(wallet.mnemonic).to.equal(mnemonic);
      expect(wallet.seed).to.equal('7bb10dad42fa92ee8fdc2969737a2c5fa4cefa1492cba9d3d4dae30fc317db3ca14b9d94d39b2bea9035b5d43951b5a0719893abed068a949911702cf3eaa751');
      expect(wallet.public_key).to.equal('032ff14f3a1f8040bd5e2bce4681452d43e8d60310ce1de06ae8441006f17eff9e');
      expect(wallet.private_key).to.equal('cUmFRUe6RY4m8djjxpJYd9KoD7jVHtdLd6uLdzSmZ9FjygRu4Riv');
    });
  });

  describe('#getWalletSummary()', function () {
    it('should get wallet summary with the address balance', async function () {
      const address = 'LLVXU5zFgDmV1rXbHLS5kED7HpFjJd78go';
      const provider = new BlockCypherProvider('ltc', Constants.NETWORK_MAINNET);
      const mock = sinon.stub(provider, 'getBalance').withArgs(address).returns(Promise.resolve({ value: '78519260592' }));

      const ltcWallet = new LTCWallet(Constants.NETWORK_MAINNET);
      await ltcWallet.connect(provider);

      const walletSummary = await ltcWallet.getWalletSummary(address);
      expect(mock).to.be.calledOnce;
      expect(walletSummary).to.eql({
        address,
        balance: '785.19260592',
      });
    });
  });
});
