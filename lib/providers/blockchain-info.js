"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const base_provider_1 = __importDefault(require("./base-provider"));
class BlockchainInfoProvider extends base_provider_1.default {
    isSupportedBlockchain(symbol, network) {
        return symbol === 'btc' && network === 'mainnet';
    }
    async doConnect() {
    }
    async doGetBalance(address) {
        const { data } = await axios_1.default.get(`https://blockchain.info/balance?active=${address}`);
        return {
            value: data[address].final_balance,
        };
    }
    async doGetTransaction(hash) {
        const { data } = await axios_1.default.get(`https://blockchain.info/rawtx/${hash}?format=hex`);
        return {
            hash,
            hex: data,
        };
    }
    async doListUnspent(address) {
        const { data } = await axios_1.default.get(`https://blockchain.info/unspent?active=${address}&limit=1000`);
        return data.unspent_outputs.map((utxo) => ({
            hash: utxo.tx_hash_big_endian,
            vout: utxo.tx_output_n,
            value: utxo.value,
        }));
    }
    async doBroadcastTransaction(transaction) {
        await axios_1.default.post(`https://blockchain.info/pushtx?tx=${transaction.hex}`);
    }
}
exports.default = BlockchainInfoProvider;
