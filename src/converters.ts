import { Converter } from "./converter.ts";
import { PinyinToneMarkParser, PinyinNumberParser, BopomofoParser } from "./parsers/mod.ts";
import { BopomofoTransformer, PinyinToneMarkTransformer, PinyinNumberTransformer } from "./transformers/mod.ts";
import type { PinyinStyle } from "./types.ts";

export const pinyinToBopomofo = (pinyin: string, pinyinStyle: PinyinStyle = 'TONE_MARK'): string => {
  const parser = pinyinStyle === "TONE_MARK" ? new PinyinToneMarkParser() : new PinyinNumberParser()

  const transformer = new BopomofoTransformer()

  const converter = new Converter({
    parser,
    transformer
  })

  const bopomofo = converter.convert(pinyin)

  return bopomofo
}

export const bopomofoToPinyin = (bopomofo: string, pinyinStyle: PinyinStyle = 'TONE_MARK'): string => {
  const parser = new BopomofoParser()

  const transformer = pinyinStyle === "TONE_MARK" ? new PinyinToneMarkTransformer() : new PinyinNumberTransformer()

  const converter = new Converter({
    parser,
    transformer
  })

  const pinyin = converter.convert(bopomofo)

  return pinyin
}