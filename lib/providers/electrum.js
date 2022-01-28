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
const jayson = __importStar(require("jayson/promise"));
const base_provider_1 = __importDefault(require("./base-provider"));
const lib_error_1 = __importDefault(require("../models/lib-error"));
const btc_config_1 = __importDefault(require("../wallets/btc/btc-config"));
const ltc_config_1 = __importDefault(require("../wallets/ltc/ltc-config"));
class ElectrumProvider extends base_provider_1.default {
    constructor(symbol, network, rpcConfig) {
        super(symbol, network);
        this.rpcClient = jayson.client.tls(rpcConfig);
    }
    isSupportedBlockchain(symbol, network) {
        return !!ElectrumProvider.NETWORKS[symbol][network];
    }
    async doConnect() {
    }
    async doGetBalance(address) {
        const data = await this.rpcRequest('blockchain.scripthash.get_balance', [this.getScriptHash(address)]);
        return {
            value: data.confirmed,
        };
    }
    async doGetTransaction(hash) {
        const data = await this.rpcRequest('blockchain.transaction.get', [hash]);
        return {
            hash,
            hex: data,
        };
    }
    async doListUnspent(address) {
        const data = await this.rpcRequest('blockchain.scripthash.listunspent', [this.getScriptHash(address)]);
        return data.filter((utxo) => utxo.height > 0)
            .map((utxo) => ({
            hash: utxo.tx_hash,
            vout: utxo.tx_pos,
            value: utxo.value,
        }));
    }
    async doBroadcastTransaction(transaction) {
        await this.rpcRequest('blockchain.transaction.broadcast', [transaction.hex]);
    }
    getScriptHash(address) {
        const script = bitcoin.address.toOutputScript(address, ElectrumProvider.NETWORKS[this.symbol][this.network]);
        const hash = bitcoin.crypto.sha256(script);
        return Buffer.from(hash.reverse()).toString('hex');
    }
    async rpcRequest(method, params) {
        const response = await this.rpcClient.request(method, params);
        if (response.error) {
            throw new lib_error_1.default('RPC server returned error', response.error);
        }
        return response.result;
    }
}
exports.default = ElectrumProvider;
ElectrumProvider.NETWORKS = {
    btc: btc_config_1.default.networks,
    ltc: ltc_config_1.default.networks,
};
