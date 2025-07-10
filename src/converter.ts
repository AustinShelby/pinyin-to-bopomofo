import { pinyinSyllables, bopomofoSyllables, bopomofoToPinyin } from "./dictionaries.ts";
import { SyllableConverter } from "./syllable_converter.ts";
import { pinyinToneMap, zhuyinToneMap } from "./tones.ts";
import type { SyllableAST, Tones } from "./types.ts";

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

const zhuyinToneMatchingRegex = new RegExp(`${[
  String.fromCodePoint(714),
  String.fromCodePoint(711),
  String.fromCodePoint(715),
  String.fromCodePoint(729),
].join("|")
  }`, "g")

const pinyinNumberSyllable = /(?<syllable>[a-z]+)(?<tone>\d)/g;

export class Converter {

  public bopomofoToPinyin(text: string): string {
    const matchedTones = this.extractZhuyinToneMarks(text)
    const textWithoutTones = this.removeToneMarks(text, matchedTones)
    const syllables = this.splitIntoZhuyinSyllables(textWithoutTones)
    const syllableASTs = this.associateZhuyinTonesWithSyllables(syllables, matchedTones)
    return this.convertSyllablesToPinyin(syllableASTs)
  }

  private convertSyllablesToPinyin(syllableASTs: SyllableAST[]): string {
    return syllableASTs
      .map((syllable) => new SyllableConverter(syllable).toPinyinToneMark())
      .join("")
  }

  private splitIntoZhuyinSyllables(text: string): string[] {
    if (text.length === 0) {
      return []
    }

    const matched = bopomofoSyllables.find((syllable) => text.startsWith(syllable))

    if (!matched) {
      throw new Error(`Can't find zhuyin syllable in text '${text}'`)
    }

    const restOfText = text.slice(matched.length)
    const rest = this.splitIntoZhuyinSyllables(restOfText)
    return [matched].concat(rest)
  }

  private extractZhuyinToneMarks(normalized: string): { tone: string, index: number }[] {
    const parsedTones = normalized.matchAll(zhuyinToneMatchingRegex)
    return Array.from(parsedTones, (match) => ({ tone: match[0], index: match.index }))
  }

  // TODO: This doesn't work as zhuyin tones can either come before or after the syllable. Should be an easy fix as we don't have to worry about normalization for example.
  private associateZhuyinTonesWithSyllables(
    syllables: string[],
    matchedTones: { tone: string, index: number }[]
  ): SyllableAST[] {
    return syllables.reduce((acc, cur) => {
      // TODO: We can store this in 'acc' so we don't have to calculate it every time
      const currentSyllableStartPosition = this.calculateSyllablesLength(acc)
      const currentSyllableEndPosition = currentSyllableStartPosition + cur.length
      const matchedTone = this.findMatchedTone(matchedTones, currentSyllableStartPosition, currentSyllableEndPosition)
      const matchedToneNumber = this.getZhuyinToneNumber(matchedTone)

      const pinyinSyllable = bopomofoToPinyin.get(cur)

      if (!pinyinSyllable) {
        throw new Error(`Invalid syllable '${cur}'`)
      }

      return acc.concat({
        syllable: pinyinSyllable,
        tone: matchedToneNumber
      })

    }, [] as SyllableAST[])
  }

  private getZhuyinToneNumber(matchedTone: { tone: string, index: number } | undefined): Tones {
    if (!matchedTone) {
      return 1
    }

    return zhuyinToneMap.get(matchedTone.tone) ?? 1
  }

  public pinyinNumberToBopomofo(text: string): string {
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

    return this.convertSyllablesToBopomofo(syllableASTs)
  }

  private isValidTone(tone: number): tone is Tones {
    return [1, 2, 3, 4, 5].includes(tone)
  }

  public convert(text: string, options: ConvertOptions): string {
    const normalized = text.normalize("NFD")
    const matchedTones = this.extractToneMarks(normalized)
    const textWithoutTones = this.removeToneMarks(normalized, matchedTones)
    const syllables = this.splitIntoSyllables(textWithoutTones)
    const syllableASTs = this.associateTonesWithSyllables(syllables, matchedTones)
    return this.convertSyllablesToBopomofo(syllableASTs)
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

  private convertSyllablesToBopomofo(syllableASTs: SyllableAST[]): string {
    return syllableASTs
      .map((syllable) => new SyllableConverter(syllable).toBopomofo())
      .join("")
  }
}

export const converter = new Converter()

// TODO: Maybe it's just easier to have two functions pinyinToBopomofo and bopomofoToPinyin that take the text and option style: 'NUMBER' | 'TONE_MARK'