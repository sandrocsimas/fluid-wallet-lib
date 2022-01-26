export interface Transaction {
  hash: string;
  hex: string;
}

export interface Input {
  hash: string;
  vout: number;
  value: number;
}

export interface Output {
  address: string;
  value: number;
}
