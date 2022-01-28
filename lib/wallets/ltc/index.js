"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ltc_config_1 = __importDefault(require("./ltc-config"));
const btc_based_wallet_1 = __importDefault(require("../btc-based-wallet"));
class LTCWallet extends btc_based_wallet_1.default {
    getWalletConfig() {
        return ltc_config_1.default;
    }
}
exports.default = LTCWallet;
