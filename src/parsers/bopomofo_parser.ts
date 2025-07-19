import { bopomofoSyllables, bopomofoToPinyinDictionary } from "../dictionaries.ts";
import { zhuyinToneMap, zhuyinTones } from "../tones.ts";
import type { SyllableAST, Tones } from "../types.ts";
import { Parser } from "./parser.ts";

const zhuyingAfterTones = [
  String.fromCodePoint(714),
  String.fromCodePoint(711),
  String.fromCodePoint(715)
];

export class BopomofoParser extends Parser {
  public parse(text: string): SyllableAST[] {
    const zhuyinSyllables = this.splitIntoZhuyinSyllablesAndTones(text);
    const syllableASTs = this.toSyllableASTs(zhuyinSyllables);
    return syllableASTs;
  }

  private toSyllableASTs(syllables: {
    syllable: string;
    tone: string;
  }[]): SyllableAST[] {
    return syllables.map(({ syllable, tone }) => {
      const pinyinTone = this.getZhuyinToneNumber(tone);
      const pinyinSyllable = bopomofoToPinyinDictionary.get(syllable);

      if (!pinyinSyllable) {
        throw new Error(`Invalid syllable: ${syllable}`);
      }

      return {
        tone: pinyinTone,
        syllable: pinyinSyllable
      };
    });
  }

  private splitIntoZhuyinSyllablesAndTones(text: string): { syllable: string, tone: string }[] {
    if (text.length === 0) {
      return [];
    }

    const firstCharacter = text.slice(0, 1);

    if (firstCharacter === zhuyinTones[5]) {
      const rest = text.slice(1);
      const matchingZhuyingSyllable = bopomofoSyllables.find((syllable) => rest.startsWith(syllable));

      if (!matchingZhuyingSyllable) {
        throw new Error(`Couldn't find zhuying syllable in: ${rest}`);
      }

      const restOfText = rest.slice(matchingZhuyingSyllable.length);
      const otherSyllables = this.splitIntoZhuyinSyllablesAndTones(restOfText);

      return [{
        syllable: matchingZhuyingSyllable,
        tone: firstCharacter
      }].concat(otherSyllables);
    }

    const matchingZhuyingSyllable = bopomofoSyllables.find((syllable) => text.startsWith(syllable));

    if (!matchingZhuyingSyllable) {
      throw new Error(`Couldn't find zhuying syllable in: ${text}`);
    }

    const characterAfterSyllable = text.slice(matchingZhuyingSyllable.length, matchingZhuyingSyllable.length + 1);

    if (characterAfterSyllable === "") {
      const restOfText = text.slice(matchingZhuyingSyllable.length);
      const otherSyllables = this.splitIntoZhuyinSyllablesAndTones(restOfText);

      return [{
        syllable: matchingZhuyingSyllable,
        tone: ""
      }].concat(otherSyllables);
    } else {
      const isValidAfterSyllableTone = zhuyingAfterTones.includes(characterAfterSyllable);

      const restOfText = text.slice(matchingZhuyingSyllable.length + (isValidAfterSyllableTone ? 1 : 0));
      const otherSyllables = this.splitIntoZhuyinSyllablesAndTones(restOfText);

      return [{
        syllable: matchingZhuyingSyllable,
        tone: isValidAfterSyllableTone ? characterAfterSyllable : "1"
      }].concat(otherSyllables);
    }
  }

  private getZhuyinToneNumber(tone: string): Tones {
    if (tone === "") {
      return 1;
    }

    return zhuyinToneMap.get(tone) ?? 1;
  }
} 