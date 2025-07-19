import { pinyinSyllables, bopomofoSyllables, bopomofoToPinyinDictionary } from "./dictionaries.ts";
import { Parser } from "./parsers/parser.ts";
import { syllableConverter } from "./syllable_converter.ts";
import { pinyinToneMap, zhuyinToneMap, zhuyinTones } from "./tones.ts";
import { Transformer } from "./transformers/transformer.ts";
import type { SyllableAST, Tones, PinyinStyle } from "./types.ts";

export type ConvertOptions = {
  from: "pinyinToneMark", to: "bopomofo"
}

const toneMatchingRegex = new RegExp(`${[
  String.fromCodePoint(772),
  String.fromCodePoint(769),
  String.fromCodePoint(780),
  String.fromCodePoint(768),
].join("|")
  }`, "g")

const zhuyingAfterTones = [
  String.fromCodePoint(714),
  String.fromCodePoint(711),
  String.fromCodePoint(715)
]

// TODO: For some reason this doesn't work as a RegExp. No idea why. Maybe because it's very static
const pinyinNumberSyllable = /(?<syllable>[a-z]+)(?<tone>\d)/g;

// TODO: This class doesn't make any sense. There's no overlap between the different parsers. I feel like we should have a very light parser that takes a "strategy" for parsing and conversion. This way we can extend it to IPA easily in the future.
export class Converter2 {

  public parseBopomofo(text: string): SyllableAST[] {
    const zhuyinSyllables = this.splitIntoZhuyinSyllablesAndTones(text)
    const syllableASTs = this.toSyllableASTs(zhuyinSyllables)
    return syllableASTs
  }

  private toSyllableASTs(syllables: {
    syllable: string;
    tone: string;
  }[]): SyllableAST[] {
    return syllables.map(({ syllable, tone }) => {
      const pinyinTone = this.getZhuyinToneNumber(tone)
      const pinyinSyllable = bopomofoToPinyinDictionary.get(syllable)

      if (!pinyinSyllable) {
        throw new Error(`Invalid syllable: ${pinyinSyllable}`)
      }

      return {
        tone: pinyinTone,
        syllable: pinyinSyllable
      }
    })
  }

  // TODO: Refactor this absolute monstrosity
  // TODO: I feel like we could do the transformation to SyllableAST here too
  private splitIntoZhuyinSyllablesAndTones(text: string): { syllable: string, tone: string }[] {
    if (text.length === 0) {
      return []
    }

    const firstCharacter = text.slice(0, 1)

    if (firstCharacter === zhuyinTones[5]) {
      const rest = text.slice(1)
      const matchingZhuyingSyllable = bopomofoSyllables.find((syllable) => rest.startsWith(syllable))

      if (!matchingZhuyingSyllable) {
        throw new Error(`Couldn't find zhuying syllable in: ${rest}`)
      }

      const restOfText = rest.slice(matchingZhuyingSyllable.length)

      const otherSyllables = this.splitIntoZhuyinSyllablesAndTones(restOfText)

      return [{
        syllable: matchingZhuyingSyllable,
        tone: firstCharacter
      }].concat(otherSyllables)
    }

    const matchingZhuyingSyllable = bopomofoSyllables.find((syllable) => text.startsWith(syllable))

    if (!matchingZhuyingSyllable) {
      throw new Error(`Couldn't find zhuying syllable in: ${text}`)
    }

    const characterAfterSyllable = text.slice(matchingZhuyingSyllable.length, matchingZhuyingSyllable.length + 1)

    if (characterAfterSyllable === "") {
      const restOfText = text.slice(matchingZhuyingSyllable.length)
      const otherSyllables = this.splitIntoZhuyinSyllablesAndTones(restOfText)

      return [{
        syllable: matchingZhuyingSyllable,
        tone: ""
      }].concat(otherSyllables)
    } else {
      const isValidAfterSyllableTone = zhuyingAfterTones.includes(characterAfterSyllable)

      // TODO: Code smell
      const restOfText = text.slice(matchingZhuyingSyllable.length + (isValidAfterSyllableTone ? 1 : 0))
      const otherSyllables = this.splitIntoZhuyinSyllablesAndTones(restOfText)

      return [{
        syllable: matchingZhuyingSyllable,
        // TODO: Code smell
        tone: isValidAfterSyllableTone ? characterAfterSyllable : "1"
      }].concat(otherSyllables)
    }
  }

  private getZhuyinToneNumber(tone: string): Tones {
    if (tone === "") {
      return 1
    }

    return zhuyinToneMap.get(tone) ?? 1
  }

  public parsePinyin(text: string, style: PinyinStyle): SyllableAST[] {
    if (style === "TONE_MARK") {
      return this.parsePinyinToneMarks(text)
    }

    return this.parsePinyinNumber(text)
  }

  private parsePinyinNumber(text: string): SyllableAST[] {
    const syllables = text.matchAll(pinyinNumberSyllable)

    const syllableASTs = Array.from(syllables, (match) => {
      // TODO: Should we validate that it's a valid syllable? Otherwise the error message is going to be strange.
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

  private parsePinyinToneMarks(text: string): SyllableAST[] {
    const normalized = text.normalize("NFD")
    const matchedTones = this.extractToneMarks(normalized)
    const textWithoutTones = this.removeToneMarks(normalized, matchedTones)
    const syllables = this.splitIntoSyllables(textWithoutTones)
    const syllableASTs = this.associateTonesWithSyllables(syllables, matchedTones)
    return syllableASTs
  }

  private extractToneMarks(normalized: string): { tone: string, index: number }[] {
    const parsedTones = normalized.matchAll(toneMatchingRegex)
    return Array.from(parsedTones, (match) => ({ tone: match[0], index: match.index }))
  }

  private removeToneMarks(normalized: string, matchedTones: { tone: string, index: number }[]): string {
    const matchedIndexes = new Set(matchedTones.map(({ index }) => index))
    return normalized.split("").filter((_, index) => !matchedIndexes.has(index)).join("")
  }

  private splitIntoSyllables(text: string): string[] {
    if (text.length === 0) {
      return []
    }

    const matched = pinyinSyllables.find((syllable) => text.startsWith(syllable))

    if (!matched) {
      throw new Error(`Can't find pinyin syllable in text '${text}'`)
    }

    const restOfText = text.slice(matched.length)
    const rest = this.splitIntoSyllables(restOfText)
    return [matched].concat(rest)
  }

  private getToneNumber(matchedTone: { tone: string, index: number } | undefined): Tones {
    if (!matchedTone) {
      return 5
    }

    return pinyinToneMap.get(matchedTone.tone) ?? 5
  }

  private associateTonesWithSyllables(
    syllables: string[],
    matchedTones: { tone: string, index: number }[]
  ): SyllableAST[] {
    return syllables.reduce((acc, cur) => {
      // TODO: We can store this in 'acc' so we don't have to calculate it every time
      const currentSyllableStartPosition = this.calculateSyllablesLength(acc)
      const currentSyllableEndPosition = currentSyllableStartPosition + cur.length
      const matchedTone = this.findMatchedTone(matchedTones, currentSyllableStartPosition, currentSyllableEndPosition)
      const matchedToneNumber = this.getToneNumber(matchedTone)

      return acc.concat({
        syllable: cur,
        tone: matchedToneNumber
      })

    }, [] as SyllableAST[])
  }

  private calculateSyllablesLength(syllables: SyllableAST[]): number {
    return syllables.reduce((sum, cur) => {
      const toneLength = cur.tone === 5 ? 0 : 1
      return sum + cur.syllable.length + toneLength
    }, 0)
  }

  private findMatchedTone(
    matchedTones: { tone: string, index: number }[],
    start: number,
    end: number
  ): { tone: string, index: number } | undefined {
    return matchedTones.find(({ index }) => index >= start && index <= end)
  }
}

export const converter = new Converter2()

export const bopomofoToPinyin = (text: string, pinyinStyle: PinyinStyle = 'TONE_MARK'): string => {
  const syllables = converter.parseBopomofo(text)
  const pinyin = syllables.map((syllable) => syllableConverter.toPinyin(syllable, pinyinStyle)).join("")
  return pinyin
}

export const pinyinToBopomofo = (text: string, pinyinStyle: PinyinStyle = 'TONE_MARK'): string => {
  const syllables = converter.parsePinyin(text, pinyinStyle)
  const bopomofo = syllables.map((syllable) => syllableConverter.toBopomofo(syllable)).join("")
  return bopomofo
}

export class Converter {
  private readonly parser: Parser;
  private readonly transformer: Transformer;

  constructor({ parser, transformer }: { parser: Parser, transformer: Transformer }) {
    this.parser = parser;
    this.transformer = transformer;
  }

  public convert(text: string): string {
    const syllableAsts = this.parser.parse(text)
    const result = this.transformer.transform(syllableAsts)
    return result
  }
}