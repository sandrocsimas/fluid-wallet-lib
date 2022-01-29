import { Network } from 'bitcoinjs-lib';

export default interface WalletConfig {
  name: string;
  symbol: string;
  networks: { [network: string]: Network };
  address_formats: { [network: string]: { [format: string]: AddressFormat } };
}

export interface AddressFormat {
  prefixes: string[];
  derivationPath: string;
}
