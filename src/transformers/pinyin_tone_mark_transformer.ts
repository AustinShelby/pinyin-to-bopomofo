import { pinyinTones } from "../tones.ts";
import type { SyllableAST } from "../types.ts";
import { Transformer } from "./transformer.ts";

export class PinyinToneMarkTransformer extends Transformer {
  public transform(syllables: SyllableAST[]): string {
    return syllables.map((syllable) => this.toPinyinToneMark(syllable)).join("");
  }

  private toPinyinToneMark(syllable: SyllableAST): string {
    const pinyinToneMark = pinyinTones[syllable.tone];
    const pos = this.findVowelPosition(syllable.syllable);

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