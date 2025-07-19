import { pinyinSyllables } from "../dictionaries.ts";
import { pinyinToneMap } from "../tones.ts";
import type { SyllableAST, Tones } from "../types.ts";
import { Parser } from "./parser.ts";

const TONE_MATCH_REGEX = new RegExp(`${[
  String.fromCodePoint(772),
  String.fromCodePoint(769),
  String.fromCodePoint(780),
  String.fromCodePoint(768),
].join("|")
  }`, "g")

export class PinyinToneMarkParser extends Parser {
  public parse(text: string): SyllableAST[] {
    const normalized = text.normalize("NFD")
    const matchedTones = this.extractToneMarks(normalized)
    const textWithoutTones = this.removeToneMarks(normalized, matchedTones)
    const syllables = this.splitIntoSyllables(textWithoutTones)
    const syllableASTs = this.associateTonesWithSyllables(syllables, matchedTones)
    return syllableASTs
  }

  private extractToneMarks(normalized: string): { tone: string, index: number }[] {
    const parsedTones = normalized.matchAll(TONE_MATCH_REGEX)
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

    // TODO: Fix
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

export const pinyinToneMarkParser = new PinyinToneMarkParser()