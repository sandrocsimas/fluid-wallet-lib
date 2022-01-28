"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseProvider {
    constructor(symbol, network) {
        this.connected = false;
        this.symbol = symbol;
        this.network = network;
        if (!this.isSupportedBlockchain(symbol, network)) {
            throw new Error('Blockchain not supported');
        }
    }
    isConnected() {
        return this.connected;
    }
    async connect() {
        if (this.connected) {
            throw new Error('Provider already connected');
        }
        await this.doConnect();
        this.connected = true;
    }
    getBalance(address) {
        this.assertConnected();
        return this.doGetBalance(address);
    }
    getTransaction(hash) {
        this.assertConnected();
        return this.doGetTransaction(hash);
    }
    listUnspent(address) {
        this.assertConnected();
        return this.doListUnspent(address);
    }
    broadcastTransaction(transaction) {
        this.assertConnected();
        return this.doBroadcastTransaction(transaction);
    }
    assertConnected() {
        if (!this.connected) {
            throw new Error('Provider not connected');
        }
    }
}
exports.default = BaseProvider;
