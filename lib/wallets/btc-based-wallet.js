"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoin = __importStar(require("bitcoinjs-lib"));
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const ecpair_1 = __importDefault(require("ecpair"));
const bip32_1 = __importDefault(require("bip32"));
const bip39 = __importStar(require("bip39"));
const ecc = __importStar(require("tiny-secp256k1"));
const unit = __importStar(require("satoshi-bitcoin"));
const coinSelect = __importStar(require("coinselect"));
const mnemonic_words_json_1 = __importDefault(require("./mnemonic-words.json"));
const base_wallet_1 = __importDefault(require("./base-wallet"));
class BTCBasedWallet extends base_wallet_1.default {
    constructor() {
        super(...arguments);
        this.bip32Factory = (0, bip32_1.default)(ecc);
        this.ecPairFactory = (0, ecpair_1.default)(ecc);
    }
    async createWallet(addressFormat) {
        const mnemonic = bip39.generateMnemonic(undefined, undefined, mnemonic_words_json_1.default);
        return this.getWalletDetails(mnemonic, addressFormat);
    }
    async importWallet(mnemonic, addressFormat) {
        const valid = bip39.validateMnemonic(mnemonic);
        if (!valid) {
            throw new Error('Invalid recovery phrase');
        }
        return this.getWalletDetails(mnemonic, addressFormat);
    }
    async send(privateKey, fromAddress, toAddess, changeAddress, amount) {
        const network = this.getNetwork();
        const keyPair = this.ecPairFactory.fromWIF(privateKey, network);
        const psbt = new bitcoinjs_lib_1.Psbt({ network });
        const addressFormat = this.getAddressFormat(fromAddress);
        const { inputs, outputs } = await this.getTransactionParams(fromAddress, toAddess, changeAddress, amount);
        await Promise.all(inputs.map(async (input) => {
            const psbtInput = {
                hash: input.hash,
                index: input.vout,
            };
            if (this.isWitness(addressFormat)) {
                psbtInput.witnessUtxo = {
                    script: this.getScriptPubKey(keyPair.publicKey, addressFormat).output,
                    value: input.value,
                };
            }
            else {
                const tx = await this.getProvider().getTransaction(input.hash);
                psbtInput.nonWitnessUtxo = Buffer.from(tx.raw, 'hex');
            }
            psbt.addInput(psbtInput);
        }));
        outputs.forEach((output) => {
            psbt.addOutput(output);
        });
        psbt.signAllInputs(keyPair);
        if (!psbt.validateSignaturesOfAllInputs(this.validateInputSignature.bind(this))) {
            throw new Error('Invalid signature');
        }
        psbt.finalizeAllInputs();
        const tx = psbt.extractTransaction();
        return this.getProvider().broadcastTransaction({
            hash: tx.getId(),
            raw: tx.toHex(),
        });
    }
    getNetwork() {
        const network = this.getWalletConfig().networks[this.network];
        if (!network) {
            throw new Error(`Network ${this.network} is not supported`);
        }
        return network;
    }
    getDerivationPath(addressFormat) {
        const addressFormats = this.getWalletConfig().address_formats[this.network];
        const addressFormatConfig = addressFormats[addressFormat];
        if (!addressFormatConfig) {
            throw new Error(`Address format ${addressFormat} is not supported`);
        }
        return addressFormatConfig.derivationPath;
    }
    getAddressFormat(address) {
        const addressFormats = this.getWalletConfig().address_formats[this.network];
        const addressFormat = Object.keys(addressFormats).find((addressFormatKey) => addressFormats[addressFormatKey].prefixes.some((prefix) => address.startsWith(prefix)));
        if (!addressFormat) {
            throw new Error('Address format not supported');
        }
        return addressFormat;
    }
    getScriptPubKey(publicKey, addressFormat) {
        const payments = bitcoin.payments;
        const scriptPubKey = payments[addressFormat];
        if (!scriptPubKey) {
            throw new Error(`Script pub key ${addressFormat} is not supported`);
        }
        return scriptPubKey({
            network: this.getNetwork(),
            pubkey: publicKey,
        });
    }
    isWitness(addressFormat) {
        return addressFormat === 'p2wpkh';
    }
    validateInputSignature(publicKey, msgHash, signature) {
        return this.ecPairFactory.fromPublicKey(publicKey).verify(msgHash, signature);
    }
    async getWalletDetails(mnemonic, addressFormat = 'p2wpkh') {
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = this.bip32Factory.fromSeed(seed, this.getNetwork());
        const derivationPath = this.getDerivationPath(addressFormat);
        const node = root.derivePath(derivationPath);
        const address = this.getScriptPubKey(node.publicKey, addressFormat).address;
        return {
            address,
            address_format: addressFormat,
            derivation_path: derivationPath,
            mnemonic,
            seed: seed.toString('hex'),
            public_key: node.publicKey.toString('hex'),
            private_key: node.toWIF(),
        };
    }
    async getTransactionParams(fromAddress, toAddress, changeAddress, amount) {
        const feeRate = unit.toSatoshi(0.000001);
        const utxos = await this.getProvider().listUnspent(fromAddress);
        const target = {
            address: toAddress,
            value: unit.toSatoshi(amount),
        };
        const { inputs, outputs, fee } = coinSelect(utxos, [target], feeRate);
        if (!inputs || !outputs) {
            throw new Error('No inputs or outputs provided to create the transaction');
        }
        return {
            fee,
            inputs,
            outputs: outputs.map((output) => (output.address ? output : { address: changeAddress || fromAddress, value: output.value })),
        };
    }
}
exports.default = BTCBasedWallet;
