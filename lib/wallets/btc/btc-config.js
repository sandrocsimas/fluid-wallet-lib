"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    name: 'Bitcoin',
    symbol: 'btc',
    networks: {
        mainnet: {
            messagePrefix: '\x18Bitcoin Signed Message:\n',
            bech32: 'bc',
            bip32: {
                public: 0x0488b21e,
                private: 0x0488ade4,
            },
            pubKeyHash: 0x00,
            scriptHash: 0x05,
            wif: 0x80,
        },
        testnet: {
            messagePrefix: '\x18Bitcoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef,
        },
        regtest: {
            messagePrefix: '\x18Bitcoin Signed Message:\n',
            bech32: 'bcrt',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef,
        },
    },
    address_formats: {
        mainnet: {
            p2pkh: {
                prefixes: ['1'],
                derivationPath: 'm/44\'/0\'/0\'/0/0',
                witness: false,
            },
            p2wpkh: {
                prefixes: ['bc1q'],
                derivationPath: 'm/84\'/0\'/0\'/0/0',
                witness: true,
            },
        },
        testnet: {
            p2pkh: {
                prefixes: ['m', 'n'],
                derivationPath: 'm/44\'/0\'/0\'/0/0',
                witness: false,
            },
            p2wpkh: {
                prefixes: ['tb1q'],
                derivationPath: 'm/84\'/0\'/0\'/0/0',
                witness: true,
            },
        },
        regtest: {
            p2pkh: {
                prefixes: ['m', 'n'],
                derivationPath: 'm/44\'/0\'/0\'/0/0',
                witness: false,
            },
            p2wpkh: {
                prefixes: ['bcrt1q'],
                derivationPath: 'm/84\'/0\'/0\'/0/0',
                witness: true,
            },
        },
    },
};
exports.default = config;
