"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseWallet {
    constructor(network) {
        this.network = network;
    }
    getName() {
        return this.getWalletConfig().name;
    }
    getSymbol() {
        return this.getWalletConfig().symbol;
    }
    async connect(provider) {
        if (provider.symbol !== this.getSymbol()) {
            throw new Error('Provider was created for another crypto');
        }
        if (provider.network !== this.network) {
            throw new Error('Provider was created for another network');
        }
        if (!provider.isConnected()) {
            await provider.connect();
        }
        this.provider = provider;
    }
    isConnected() {
        return this.provider && this.provider.isConnected();
    }
    getProvider() {
        if (!this.provider) {
            throw new Error('Provider is not connected');
        }
        return this.provider;
    }
}
exports.default = BaseWallet;
