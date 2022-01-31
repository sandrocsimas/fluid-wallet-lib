"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const base_provider_1 = __importDefault(require("./base-provider"));
class BlockCypherProvider extends base_provider_1.default {
    constructor(symbol, network) {
        super(symbol, network);
    }
    isSupportedBlockchain(symbol, network) {
        return !!BlockCypherProvider.BLOCKCHAIN_PATHS[symbol][network];
    }
    async doConnect() {
    }
    async doGetBalance(address) {
        const { data } = await axios_1.default.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath()}/addrs/${address}/balance`);
        return {
            value: String(data.balance),
        };
    }
    async doGetTransaction(hash) {
        const { data } = await axios_1.default.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath()}/txs/${hash}?includeHex=true`);
        return {
            hash,
            raw: data.hex,
        };
    }
    async doListUnspent(address) {
        const { data } = await axios_1.default.get(`https://api.blockcypher.com/v1/${this.getBlockchainPath()}/addrs/${address}?unspentOnly=true&limit=2000`);
        return data.txrefs.map((utxo) => ({
            hash: utxo.tx_hash,
            vout: utxo.tx_output_n,
            value: utxo.value,
        }));
    }
    async doBroadcastTransaction(transaction) {
        await axios_1.default.post(`https://api.blockcypher.com/v1/${this.getBlockchainPath()}/txs/push`, { tx: transaction.raw });
        return transaction;
    }
    getBlockchainPath() {
        return BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
    }
}
exports.default = BlockCypherProvider;
BlockCypherProvider.BLOCKCHAIN_PATHS = {
    btc: { mainnet: 'btc/main', testnet: 'btc/test3' },
    dash: { mainnet: 'dash/main' },
    doge: { mainnet: 'doge/main' },
    ltc: { mainnet: 'ltc/main' },
};
