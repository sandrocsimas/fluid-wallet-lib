"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const mnemonic_words_json_1 = __importDefault(require("../mnemonic-words.json"));
class MnemonicWords extends ethers_1.Wordlist {
    constructor() {
        super('en');
    }
    getWord(index) {
        return mnemonic_words_json_1.default[index];
    }
    getWordIndex(word) {
        return mnemonic_words_json_1.default.indexOf(word);
    }
}
exports.default = MnemonicWords;
