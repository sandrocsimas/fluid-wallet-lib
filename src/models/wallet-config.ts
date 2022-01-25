import { Network } from 'bitcoinjs-lib';

export default interface WalletConfig {
  name: string;
  symbol: string;
  networks: { [key: string]: Network };
  address_formats: { [key: string]: { [key: string]: AddressFormat } };
}

export interface AddressFormat {
  prefixes: string[];
  derivationPath: string;
  witness?: boolean;
}
