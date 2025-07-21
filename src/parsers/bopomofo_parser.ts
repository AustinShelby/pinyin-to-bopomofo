import { BOPOMOFO_SYLLABLES, BOPOMOFO_TO_PINYIN_DICTIONARY } from "../dictionaries.ts";
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
      const pinyinSyllable = BOPOMOFO_TO_PINYIN_DICTIONARY.get(syllable);

      if (!pinyinSyllable) {
        throw new Error(`Invalid syllable: ${syllable}`);
      }

      return {
        tone: pinyinTone,
        syllable: pinyinSyllable
      };
    });
  }

  private splitIntoZhuyinSyllablesAndTones(text: string): { syllable: string; tone: string }[] {
    if (text.length === 0) {
      return [];
    }

    if (this.isSpecialFirstTone(text)) {
      return this.handleSpecialFirstTone(text);
    }

    const matchingSyllable = this.findMatchingZhuyinSyllable(text);
    const { tone, restOfText } = this.extractToneAndRest(text, matchingSyllable);
    const otherSyllables = this.splitIntoZhuyinSyllablesAndTones(restOfText);

    return [
      { syllable: matchingSyllable, tone },
      ...otherSyllables
    ];
  }

  private isSpecialFirstTone(text: string): boolean {
    return text.slice(0, 1) === zhuyinTones[5];
  }

  private handleSpecialFirstTone(text: string): { syllable: string; tone: string }[] {
    const rest = text.slice(1);
    const matchingSyllable = this.findMatchingZhuyinSyllable(rest);
    const restOfText = rest.slice(matchingSyllable.length);
    const otherSyllables = this.splitIntoZhuyinSyllablesAndTones(restOfText);

    return [
      { syllable: matchingSyllable, tone: zhuyinTones[5] },
      ...otherSyllables
    ];
  }

  private findMatchingZhuyinSyllable(text: string): string {
    const match = BOPOMOFO_SYLLABLES.find((syllable) => text.startsWith(syllable));

    if (!match) {
      throw new Error(`Couldn't find zhuying syllable in: ${text}`);
    }

    return match;
  }

  private extractToneAndRest(text: string, syllable: string): { tone: string; restOfText: string } {
    const characterAfterSyllable = text.slice(syllable.length, syllable.length + 1);

    if (characterAfterSyllable === "") {
      return { tone: "", restOfText: text.slice(syllable.length) };
    }

    const isValidAfterSyllableTone = zhuyingAfterTones.includes(characterAfterSyllable);

    const tone = isValidAfterSyllableTone ? characterAfterSyllable : "1";

    const restOfText = text.slice(syllable.length + (isValidAfterSyllableTone ? 1 : 0));

    return { tone, restOfText };
  }

  private getZhuyinToneNumber(tone: string): Tones {
    if (tone === "") {
      return 1;
    }

    return zhuyinToneMap.get(tone) ?? 1;
  }
}

export const bopomofoParser = new BopomofoParser()