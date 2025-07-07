import { bopomofoToPinyin, pinyinToBopomofo } from "./dictionaries.ts";
import { SyllableConverter } from "./syllable_converter.ts";
import {
  pinyinToneMap,
  pinyinToneRegex,
  zhuyinToneMap,
  zhuyinTones,
} from "./tones.ts";
import type { Tones } from "./types.ts";

export class SyllableParser {
  public fromPinyinNumber(text: string): SyllableConverter {
    const syllable = text.slice(0, -1);
    const tone = text.slice(-1);

    if (!this.isValidSyllable(syllable)) {
      throw new Error(`Invalid syllable '${syllable}'`);
    }

    const parsedTone = this.parseTone(tone);

    if (!parsedTone.isValid) {
      throw new Error(`Invalid tone '${tone}'`);
    }

    return new SyllableConverter({
      syllable: syllable,
      tone: parsedTone.tone,
    });
  }

  public fromPinyinToneMark(text: string): SyllableConverter {
    const normalizedText = text.normalize("NFD");
    const matchIndex = normalizedText.search(pinyinToneRegex);

    if (matchIndex === -1) {
      if (!this.isValidSyllable(normalizedText)) {
        throw new Error(`Invalid syllable '${normalizedText}'`);
      }

      return new SyllableConverter({
        syllable: normalizedText,
        tone: 5,
      });
    }

    const toneMark = normalizedText.slice(matchIndex, matchIndex + 1);
    const syllableHead = normalizedText.slice(0, matchIndex);
    const syllableTail = normalizedText.slice(matchIndex + 1);

    const syllable = `${syllableHead}${syllableTail}`;

    if (!this.isValidSyllable(syllable)) {
      throw new Error(`Invalid syllable '${syllable}'`);
    }

    const parsedTone = this.parseToneMark(toneMark);

    if (!parsedTone.isValid) {
      throw new Error(`Invalid tone mark '${toneMark}'`);
    }

    return new SyllableConverter({
      syllable: syllable,
      tone: parsedTone.tone,
    });
  }

  public fromBopomofo(text: string): SyllableConverter {
    const firstCharacter = text.slice(0, 1);

    if (firstCharacter === zhuyinTones[5]) {
      const bopomofoWithoutTone = text.slice(1);
      const pinyin = bopomofoToPinyin.get(bopomofoWithoutTone);

      if (!pinyin) {
        throw new Error(`Invalid bopomofo syllable '${bopomofoWithoutTone}'`);
      }

      return new SyllableConverter({
        syllable: pinyin,
        tone: 5,
      });
    }

    const lastCharacter = text.slice(-1);

    const tone = zhuyinToneMap.get(lastCharacter);

    if (tone) {
      const zhuyinWithoutTone = text.slice(0, -1);
      const syllable = bopomofoToPinyin.get(zhuyinWithoutTone);

      if (!syllable) {
        throw new Error(`Invalid syllable '${zhuyinWithoutTone}'`);
      }

      return new SyllableConverter({
        syllable,
        tone,
      });
    }

    const syllable = bopomofoToPinyin.get(text);

    if (!syllable) {
      throw new Error(`Invalid syllable '${text}'`);
    }

    return new SyllableConverter({
      syllable,
      tone: 1,
    });
  }

  private parseToneMark(
    toneMark: string,
  ): { tone: Exclude<Tones, 5>; isValid: true } | {
    tone: undefined;
    isValid: false;
  } {
    const toneNumber = pinyinToneMap.get(toneMark);

    if (!toneNumber) {
      return { tone: undefined, isValid: false };
    }

    return { tone: toneNumber, isValid: true };
  }

  private isValidSyllable(syllable: string): boolean {
    return pinyinToBopomofo.has(syllable);
  }

  private parseTone(
    tone: string,
  ): { tone: Tones; isValid: true } | { tone: undefined; isValid: false } {
    const toneNumber = Number(tone);

    if (Number.isNaN(toneNumber)) {
      return { tone: undefined, isValid: false };
    }

    if (!this.isValidTone(toneNumber)) {
      return { tone: undefined, isValid: false };
    }

    return { tone: toneNumber, isValid: true };
  }

  private isValidTone(toneNumber: number): toneNumber is Tones {
    return [1, 2, 3, 4, 5].includes(toneNumber as Tones);
  }
}

export const syllableParser = new SyllableParser();
