import { Wordlist } from 'ethers';

import mnemonicWords from '../mnemonic-words.json';

export default class MnemonicWords extends Wordlist {
  public constructor() {
    super('en');
  }

  public getWord(index: number): string {
    return mnemonicWords[index];
  }

  public getWordIndex(word: string): number {
    return mnemonicWords.indexOf(word);
  }
}
