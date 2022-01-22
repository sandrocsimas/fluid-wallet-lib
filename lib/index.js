"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const btc_1 = __importDefault(require("./wallets/btc"));
class Wallets {
    constructor() {
    }
}
exports.default = Wallets;
Wallets.config = config_1.default;
Wallets.btc = new btc_1.default();
