export default interface Wallet {
    address: string;
    address_format: string;
    derivation_path: string;
    mnemonic: string;
    seed?: string;
    public_key: string;
    private_key: string;
}
