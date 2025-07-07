import { pinyinToBopomofo } from "./dictionaries.ts";
import { pinyinTones, zhuyinTones } from "./tones.ts";
import type { SyllableAST } from "./types.ts";

// TODO: Should we just call this class Syllable? Let syllable itself take care of converting itself
export class SyllableConverter {
  constructor(private readonly syllable: SyllableAST) { }

  public toBopomofo(): string {
    const bopomofo = pinyinToBopomofo.get(this.syllable.syllable);

    if (!bopomofo) {
      throw new Error(
        `Couldn't find bopomofo for syllable '${this.syllable.syllable}'`,
      );
    }

    const tone = zhuyinTones[this.syllable.tone];

    if (this.syllable.tone === 5) {
      return `${tone}${bopomofo}`;
    }

    return `${bopomofo}${tone}`;
  }

  public toPinyinNumber(): string {
    // TODO: Should we validate that this syllable exists in the dictionary?
    return `${this.syllable.syllable}${this.syllable.tone}`;
  }

  private findVowelPosition(syllable: string): number | undefined {
    const mainVowels = ["a", "e", "o", "ü"];

    const mainVowelPositions = mainVowels
      .map((vowel) => syllable.indexOf(vowel))
      .find((pos) => pos > -1);

    if (mainVowelPositions !== undefined) {
      return mainVowelPositions;
    }

    const iPosition = syllable.indexOf("i");
    const uPosition = syllable.indexOf("u");

    if (iPosition > -1 && uPosition > -1) {
      return Math.max(iPosition, uPosition);
    }

    if (uPosition > -1) {
      return uPosition;
    }

    if (iPosition > -1) {
      return iPosition;
    }

    return undefined;
  }

  public toPinyinToneMark(): string {
    // TODO: Should we validate that this syllable exists in the dictionary?
    const pinyinToneMark = pinyinTones[this.syllable.tone];
    const pos = this.findVowelPosition(this.syllable.syllable);

    if (pos === undefined) {
      throw new Error(`Couldn't find vowel for '${this.syllable.syllable}'`);
    }

    const syllableHead = this.syllable.syllable.slice(0, pos + 1);
    const syllableTail = this.syllable.syllable.slice(pos + 1);

    return `${syllableHead}${pinyinToneMark}${syllableTail}`.normalize("NFC");
  }
}
