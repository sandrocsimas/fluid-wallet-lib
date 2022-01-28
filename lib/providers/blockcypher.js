"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const base_provider_1 = __importDefault(require("./base-provider"));
class BlockCypherProvider extends base_provider_1.default {
    isSupportedBlockchain(symbol, network) {
        return !!BlockCypherProvider.BLOCKCHAIN_PATHS[symbol][network];
    }
    async doConnect() {
    }
    async doGetBalance(address) {
        const networkPath = BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
        const { data } = await axios_1.default.get(`https://api.blockcypher.com/v1/${networkPath}/addrs/${address}/balance`);
        return {
            value: data.final_balance,
        };
    }
    async doGetTransaction(hash) {
        const networkPath = BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
        const { data } = await axios_1.default.get(`https://api.blockcypher.com/v1/${networkPath}/txs/${hash}?includeHex=true`);
        return {
            hash,
            hex: data.hex,
        };
    }
    async doListUnspent(address) {
        const networkPath = BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
        const { data } = await axios_1.default.get(`https://api.blockcypher.com/v1/${networkPath}/addrs/${address}?unspentOnly=true&limit=2000`);
        return data.txrefs.map((utxo) => ({
            hash: utxo.tx_hash,
            vout: utxo.tx_output_n,
            value: utxo.value,
        }));
    }
    async doBroadcastTransaction(transaction) {
        const networkPath = BlockCypherProvider.BLOCKCHAIN_PATHS[this.symbol][this.network];
        await axios_1.default.post(`https://api.blockcypher.com/v1/${networkPath}/txs/push`, { tx: transaction.hex });
    }
}
exports.default = BlockCypherProvider;
BlockCypherProvider.BLOCKCHAIN_PATHS = {
    btc: { mainnet: 'btc/main', testnet: 'btc/test3' },
    dash: { mainnet: 'dash/main' },
    doge: { mainnet: 'doge/main' },
    ltc: { mainnet: 'ltc/main' },
};
