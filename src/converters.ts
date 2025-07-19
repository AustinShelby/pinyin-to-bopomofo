import { Converter } from "./converter.ts";
import { bopomofoParser } from "./parsers/bopomofo_parser.ts";
import { pinyinNumberParser } from "./parsers/pinyin_number_parser.ts";
import { pinyinToneMarkParser } from "./parsers/pinyin_tone_mark_parser.ts";
import { bopomofoTransformer } from "./transformers/bopomofo_transformer.ts";
import { pinyinNumberTransformer } from "./transformers/pinyin_number_transformer.ts";
import { pinyinToneMarkTransformer } from "./transformers/pinyin_tone_mark_transformer.ts";
import type { PinyinStyle } from "./types.ts";

export const pinyinToBopomofo = (pinyin: string, pinyinStyle: PinyinStyle = 'TONE_MARK'): string => {
  const parser = pinyinStyle === "TONE_MARK" ? pinyinToneMarkParser : pinyinNumberParser

  const transformer = bopomofoTransformer

  const converter = new Converter({
    parser,
    transformer
  })

  const bopomofo = converter.convert(pinyin)

  return bopomofo
}

export const bopomofoToPinyin = (bopomofo: string, pinyinStyle: PinyinStyle = 'TONE_MARK'): string => {
  const parser = bopomofoParser

  const transformer = pinyinStyle === "TONE_MARK" ? pinyinToneMarkTransformer : pinyinNumberTransformer

  const converter = new Converter({
    parser,
    transformer
  })

  const pinyin = converter.convert(bopomofo)

  return pinyin
}