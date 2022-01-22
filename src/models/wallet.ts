export default interface Wallet {
  address: string;
  mnemonic: string;
  seed: string;
  public_key: string;
  private_key: string;
  address_type: string;
}
