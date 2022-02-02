import chai, { expect } from 'chai';
import chaiString from 'chai-string';

import ETHWallet from '../../src/wallets/eth';

import Constants from '../constants';

chai.use(chaiString);

describe('ETHWallet', function () {
  describe('#createWallet()', function () {
    it('should create an address', async function () {
      const wallet = await new ETHWallet(Constants.NETWORK_TESTNET).createWallet();

      expect(wallet.address).to.startWith('0x');
      expect(wallet.address_format).to.equal('default');
      expect(wallet.derivation_path).to.equal("m/44'/60'/0'/0/0");
      expect(wallet.mnemonic.split(' ')).to.have.lengthOf(12);
      expect(wallet.seed).to.not.exist;
      expect(wallet.public_key).to.have.lengthOf(132);
      expect(wallet.private_key).to.have.lengthOf(66);
    });
  });

  describe('#importWallet()', function () {
    it('should import an address', async function () {
      const mnemonic = 'front curious kingdom replace picnic silver agent sound cinnamon scheme assault clock';
      const wallet = await new ETHWallet(Constants.NETWORK_TESTNET).importWallet(mnemonic);

      expect(wallet.address).to.equal('0xE79c54acb27c891e691B8aC7Af736A4aE8370B39');
      expect(wallet.address_format).to.equal('default');
      expect(wallet.derivation_path).to.equal("m/44'/60'/0'/0/0");
      expect(wallet.mnemonic).to.equal(mnemonic);
      expect(wallet.seed).to.not.exist;
      expect(wallet.public_key).to.equal('0x04efc902f350c13a4cbe2f60c9e55cf72fb4291bdaf042b3230802a784e7f620694ef01138a74f870c8543513af8b2062d5124f1267f193e1566684986d42711fe');
      expect(wallet.private_key).to.equal('0x8da8664a0739e7409a9d23b8dffd822b4b8a955fe57c30c4e5c946ef7204ba5c');
    });
  });
});
