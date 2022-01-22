export default interface WalletConfig {
  address_types: { [key: string]: { [key: string]: AddressType } };
}

export interface AddressType {
  prefixes: string[];
  derivationPath: string;
  witness: boolean;
}
