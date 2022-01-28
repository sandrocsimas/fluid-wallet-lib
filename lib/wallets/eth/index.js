"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const eth_config_1 = __importDefault(require("./eth-config"));
const mnemonic_words_1 = __importDefault(require("./mnemonic-words"));
const base_wallet_1 = __importDefault(require("../base-wallet"));
class ETHWallet extends base_wallet_1.default {
    constructor() {
        super(...arguments);
        this.mnemonicWords = new mnemonic_words_1.default();
    }
    async createWallet(addressFormat = 'eth') {
        const derivationPath = this.getDerivationPath(addressFormat);
        const wallet = ethers_1.ethers.Wallet.createRandom({ path: derivationPath });
        return this.getWalletDetails(wallet, addressFormat);
    }
    async importWallet(mnemonic, addressFormat = 'eth') {
        const derivationPath = this.getDerivationPath(addressFormat);
        const wallet = ethers_1.ethers.Wallet.fromMnemonic(mnemonic, derivationPath, this.mnemonicWords);
        return this.getWalletDetails(wallet, addressFormat);
    }
    send(fromAddress, toAddess, changeAddress, privateKey, amount) {
        throw new Error('Method not implemented.');
    }
    getWalletConfig() {
        return eth_config_1.default;
    }
    getWalletDetails(wallet, addressFormat) {
        return {
            address: wallet.address,
            address_format: addressFormat,
            mnemonic: wallet.mnemonic.phrase,
            public_key: wallet.publicKey,
            private_key: wallet.privateKey,
        };
    }
}
exports.default = ETHWallet;
