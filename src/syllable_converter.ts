import { pinyinToBopomofoDictionary } from "./dictionaries.ts";
import { pinyinTones, zhuyinTones } from "./tones.ts";
import type { PinyinStyle, SyllableAST } from "./types.ts";

// TODO: Should we just call this class Syllable? Let syllable itself take care of converting itself
export class SyllableConverter {

  public toBopomofo(syllable: SyllableAST): string {
    const bopomofo = pinyinToBopomofoDictionary.get(syllable.syllable);

    if (!bopomofo) {
      throw new Error(
        `Couldn't find bopomofo for syllable '${syllable.syllable}'`,
      );
    }

    const tone = zhuyinTones[syllable.tone];

    if (syllable.tone === 5) {
      return `${tone}${bopomofo}`;
    }

    return `${bopomofo}${tone}`;
  }

  private toPinyinNumber(syllable: SyllableAST): string {
    // TODO: Should we validate that this syllable exists in the dictionary?
    return `${syllable.syllable}${syllable.tone}`;
  }

  public toPinyin(syllable: SyllableAST, style: PinyinStyle): string {
    if (style === 'TONE_MARK') {
      return this.toPinyinToneMark(syllable)
    }

    return this.toPinyinNumber(syllable)
  }

  private toPinyinToneMark(syllable: SyllableAST): string {
    // TODO: Should we validate that this syllable exists in the dictionary?
    const pinyinToneMark = pinyinTones[syllable.tone];
    const pos = this.findVowelPosition(syllable.syllable);


    // TODO: This throws for ㄗㄣ
    if (pos === undefined) {
      throw new Error(`Couldn't find vowel for '${syllable.syllable}'`);
    }

    const syllableHead = syllable.syllable.slice(0, pos + 1);
    const syllableTail = syllable.syllable.slice(pos + 1);

    return `${syllableHead}${pinyinToneMark}${syllableTail}`.normalize("NFC");
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
}

export const syllableConverter = new SyllableConverter();