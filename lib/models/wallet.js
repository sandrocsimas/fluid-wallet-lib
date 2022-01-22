"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Wallet {
    constructor(data) {
        this.address = data.address;
        this.mnemonic = data.mnemonic;
        this.seed = data.seed;
        this.public_key = data.public_key;
        this.private_key = data.private_key;
        this.address_type = data.address_type;
    }
}
exports.default = Wallet;
