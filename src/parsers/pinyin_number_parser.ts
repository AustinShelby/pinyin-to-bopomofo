import type { SyllableAST, Tones } from "../types.ts";
import { Parser } from "./parser.ts";

const pinyinNumberSyllable = /(?<syllable>[a-z]+)(?<tone>\d)/g;

export class PinyinNumberParser extends Parser {
  public parse(text: string): SyllableAST[] {
    const syllables = text.matchAll(pinyinNumberSyllable)

    const syllableASTs = Array.from(syllables, (match) => {
      const syllable = match.groups?.["syllable"]
      const tone = match.groups?.["tone"]

      if (!syllable || !tone) {
        throw new Error(`Invalid syllable '${match[0]}'`)
      }

      const toneNumber = parseInt(tone)

      if (!this.isValidTone(toneNumber)) {
        throw new Error(`Invalid tone '${tone}'`)
      }

      return {
        syllable,
        tone: toneNumber
      }
    })

    return syllableASTs
  }

  private isValidTone(tone: number): tone is Tones {
    return [1, 2, 3, 4, 5].includes(tone)
  }
} 