import WalletConfig from '../../models/wallet-config';

const config: WalletConfig = {
  name: 'Litecoin',
  symbol: 'ltc',
  networks: {
    mainnet: {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bech32: 'ltc',
      bip32: {
        public: 0x019da462,
        private: 0x019d9cfe,
      },
      pubKeyHash: 0x30,
      scriptHash: 0x32,
      wif: 0xb0,
    },
    testnet: {
      messagePrefix: '\x19Litecoin Signed Message:\n',
      bech32: 'tltc',
      bip32: {
        public: 0x0436f6e1,
        private: 0x0436ef7d,
      },
      pubKeyHash: 0x6f,
      scriptHash: 0x3a,
      wif: 0xef,
    },
  },
  address_formats: {
    mainnet: {
      p2pkh: {
        prefixes: ['L'],
        derivationPath: 'm/44\'/2\'/0\'/0/0',
      },
      p2wpkh: {
        prefixes: ['ltc1q'],
        derivationPath: 'm/84\'/2\'/0\'/0/0',
      },
    },
    testnet: {
      p2pkh: {
        prefixes: ['m', 'n'],
        derivationPath: 'm/44\'/2\'/0\'/0/0',
      },
      p2wpkh: {
        prefixes: ['tltc1q'],
        derivationPath: 'm/84\'/2\'/0\'/0/0',
      },
    },
  },
};

export default config;
