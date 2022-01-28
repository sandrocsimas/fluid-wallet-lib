import { Wordlist } from 'ethers';
export default class MnemonicWords extends Wordlist {
    constructor();
    getWord(index: number): string;
    getWordIndex(word: string): number;
}
