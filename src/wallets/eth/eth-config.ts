import WalletConfig from '../../models/wallet-config';

const config: WalletConfig = {
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

export default config;
