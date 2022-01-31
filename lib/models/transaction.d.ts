export interface Transaction {
    hash: string;
    raw: string;
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
