import { pinyinSyllables } from "./dictionaries.ts";
import { SyllableConverter } from "./syllable_converter.ts";
import { pinyinToneMap } from "./tones.ts";
import type { SyllableAST } from "./types.ts";

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

export class Converter {
  public convert(text: string, options: ConvertOptions): string {
    const normalized = text.normalize("NFD")
    const parsedTones = normalized.matchAll(toneMatchingRegex)
    const matched = Array.from(parsedTones, (match) => ({ tone: match[0], index: match.index }))
    const matchedIndexes = new Set(matched.map(({ index }) => index))
    const textWithoutTones = normalized.split("").filter((_, index) => !matchedIndexes.has(index)).join("")
    const syllables = this.splitIntoSyllables(textWithoutTones)

    const og = syllables.reduce((acc, cur) => {
      const currentSyllableStartPosition = acc.reduce((acc, cur) => {
        const toneLength = cur.tone === 5 ? 0 : 1

        return acc + cur.syllable.length + toneLength
      }, 0)

      const currentSyllableEndPosition = currentSyllableStartPosition + cur.length

      const matchedTone = matched.find(({ index }) => index >= currentSyllableStartPosition && index <= currentSyllableEndPosition)

      const matchedToneNumber = matchedTone ? pinyinToneMap.get(matchedTone.tone) : 5

      return acc.concat({
        syllable: cur,
        tone: matchedToneNumber ?? 5
      })
    }, [] as SyllableAST[])

    const bopomofo = og.map((syllable) => new SyllableConverter(syllable).toBopomofo()).join("")

    return bopomofo
  }

  private splitIntoSyllables(text: string): string[] {
    const matched = pinyinSyllables.find((syllable) => text.startsWith(syllable))

    if (!matched) {
      return []
    }

    const restOfText = text.slice(matched.length)

    const rest = this.splitIntoSyllables(restOfText)

    return [matched].concat(rest)
  }
}

export const converter = new Converter()