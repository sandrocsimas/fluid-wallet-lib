import Provider from '../providers/provider';

export default interface EnvConfig {
  network: string;
  wallets: { [key: string]: WalletEnvConfig },
}

export interface WalletEnvConfig {
  provider?: Provider;
}
