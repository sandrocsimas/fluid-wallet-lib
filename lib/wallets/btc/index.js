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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoinjs_lib_1 = __importDefault(require("bitcoinjs-lib"));
const bip39_1 = __importDefault(require("bip39"));
const bip32_1 = __importDefault(require("bip32"));
const ecc = __importStar(require("tiny-secp256k1"));
const config_1 = __importDefault(require("../../config"));
const wallet_1 = __importDefault(require("../../models/wallet"));
const btc_json_1 = __importDefault(require("./btc.json"));
class BTCWallets {
    constructor() {
        this.bip32Factory = (0, bip32_1.default)(ecc);
    }
    createWallet(scriptPubKeyType) {
        return __awaiter(this, void 0, void 0, function* () {
            const mnemonic = bip39_1.default.generateMnemonic();
            return this.getWalletDetails(mnemonic, scriptPubKeyType);
        });
    }
    importWallet(mnemonic, scriptPubKeyType) {
        return __awaiter(this, void 0, void 0, function* () {
            const valid = bip39_1.default.validateMnemonic(mnemonic);
            if (!valid) {
                throw new Error('Invalid recovery phrase');
            }
            return this.getWalletDetails(mnemonic, scriptPubKeyType);
        });
    }
    getNetwork() {
        const networks = bitcoinjs_lib_1.default.networks;
        const network = networks[config_1.default.network];
        if (!network) {
            throw new Error(`Network ${config_1.default.network} is not supported`);
        }
        return network;
    }
    getAddressType(address) {
        const addressTypes = btc_json_1.default.address_types[config_1.default.network];
        const addressType = Object.keys(addressTypes).find((addressTypeKey) => addressTypes[addressTypeKey].prefixes.some((prefix) => address.startsWith(prefix)));
        if (!addressType) {
            throw new Error('Address type not supported');
        }
        return addressType;
    }
    getDerivationPath(scriptPubKeyType = 'p2wpkh') {
        const addressTypes = btc_json_1.default.address_types[config_1.default.network];
        return addressTypes[scriptPubKeyType].derivationPath;
    }
    getScriptPubKey(network, publicKey, scriptPubKeyType = 'p2wpkh') {
        const payments = bitcoinjs_lib_1.default.payments;
        const scriptPubKey = payments[scriptPubKeyType];
        if (!scriptPubKey) {
            throw new Error(`Script pub key ${scriptPubKeyType} is not supported`);
        }
        return scriptPubKey({
            network,
            pubkey: publicKey,
        });
    }
    getWalletDetails(mnemonic, scriptPubKeyType) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = this.getNetwork();
            const seed = yield bip39_1.default.mnemonicToSeed(mnemonic);
            const root = this.bip32Factory.fromSeed(seed, network);
            const node = root.derivePath(this.getDerivationPath(scriptPubKeyType));
            const address = this.getScriptPubKey(network, node.publicKey, scriptPubKeyType).address;
            const addressType = this.getAddressType(address);
            return new wallet_1.default({
                address,
                mnemonic,
                seed: seed.toString('hex'),
                public_key: node.publicKey.toString('hex'),
                private_key: node.toWIF(),
                address_type: addressType,
            });
        });
    }
}
exports.default = BTCWallets;
