export interface Transaction {
    hash: string;
    hex: string;
}
export interface UnspentTransaction {
    hash: string;
    vout: number;
    value: number;
}
export interface Output {
    address: string;
    value: number;
}
