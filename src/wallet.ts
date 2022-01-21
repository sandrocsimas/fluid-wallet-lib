export class Wallet {

  address: string;
  mnemonic: string;
  seed: string;
  public_key: string;
  private_key: string;
  address_type: string;

  constructor(data: any) {
    this.address = data.address;
    this.mnemonic = data.mnemonic;
    this.seed = data.seed;
    this.public_key = data.public_key;
    this.private_key = data.private_key;
    this.address_type = data.address_type;
  }
}
