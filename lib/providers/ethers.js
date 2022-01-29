"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const base_provider_1 = __importDefault(require("./base-provider"));
const eth_config_1 = __importDefault(require("../wallets/eth/eth-config"));
class EthersProvider extends base_provider_1.default {
    constructor(ethersProvider) {
        super('eth', ethersProvider.network.name);
        this.ethersProvider = ethersProvider;
    }
    isSupportedBlockchain(symbol, network) {
        return symbol === this.symbol && !!eth_config_1.default.address_formats[network];
    }
    async doConnect() {
    }
    async doGetBalance(address) {
        const balance = await this.ethersProvider.getBalance(address);
        return {
            value: balance.toString(),
        };
    }
    async doGetTransaction(hash) {
        const transaction = await this.ethersProvider.getTransaction(hash);
        return {
            hash: transaction.hash,
            hex: transaction.raw,
        };
    }
    doListUnspent(address) {
        throw new Error('Method not implemented.');
    }
    async doBroadcastTransaction(transaction) {
        const response = await this.ethersProvider.sendTransaction(transaction.hex);
        return {
            hash: response.hash,
            hex: response.raw,
        };
    }
}
exports.default = EthersProvider;
