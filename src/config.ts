export default class Config {
  network: string;

  constructor(data: any = {}) {
    this.network = data.network || 'bitcoin';
  }
}
