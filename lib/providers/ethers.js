"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const base_provider_1 = __importDefault(require("./base-provider"));
class EthersProvider extends base_provider_1.default {
    constructor(ethersProvider) {
        super('eth', ethersProvider.network.name);
        this.ethersProvider = ethersProvider;
    }
    isSupportedBlockchain(symbol, network) {
        return symbol === this.symbol && network === this.network;
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
            raw: transaction.raw || this.getRawTransaction(transaction),
        };
    }
    doListUnspent(address) {
        throw new Error('Method not implemented.');
    }
    async doBroadcastTransaction(transaction) {
        const response = await this.ethersProvider.sendTransaction(transaction.raw);
        return {
            hash: response.hash,
            raw: response.raw,
        };
    }
    getRawTransaction(transaction) {
        const unsignedTransaction = this.getNonEmptyValues({
            accessList: transaction.accessList,
            chainId: transaction.chainId,
            data: transaction.data,
            gasLimit: transaction.gasLimit,
            gasPrice: transaction.gasPrice,
            maxFeePerGas: transaction.maxFeePerGas,
            maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
            nonce: transaction.nonce,
            to: transaction.to,
            type: transaction.type,
            value: transaction.value,
        });
        const signature = this.getNonEmptyValues({
            r: transaction.r,
            s: transaction.s,
            v: transaction.v,
        });
        const raw = ethers_1.ethers.utils.serializeTransaction(unsignedTransaction, signature);
        if (ethers_1.ethers.utils.keccak256(raw) !== transaction.hash) {
            throw new Error('Serializing failed');
        }
        return raw;
    }
    getNonEmptyValues(obj) {
        const result = {};
        Object.keys(obj).forEach((key) => {
            if (obj[key]) {
                result[key] = obj[key];
            }
        });
        return result;
    }
}
exports.default = EthersProvider;
