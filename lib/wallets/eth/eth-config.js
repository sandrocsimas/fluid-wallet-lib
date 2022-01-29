"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    name: 'Ethereum',
    symbol: 'eth',
    networks: {},
    address_formats: {
        all: {
            default: {
                prefixes: ['0x'],
                derivationPath: 'm/44\'/60\'/0\'/0/0',
            },
        },
    },
};
exports.default = config;
