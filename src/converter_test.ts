import { syllableParser } from "./converter.ts";
import { assertEquals } from "jsr:@std/assert";

const pinyinNumberAndZhuyinPairs = [{
  pinyin: "yao1",
  zhuyin: "ㄧㄠ",
}, {
  pinyin: "yao2",
  zhuyin: "ㄧㄠˊ",
}, {
  pinyin: "yao3",
  zhuyin: "ㄧㄠˇ",
}, {
  pinyin: "yao4",
  zhuyin: "ㄧㄠˋ",
}, {
  pinyin: "yao5",
  zhuyin: "˙ㄧㄠ",
}];

pinyinNumberAndZhuyinPairs.forEach(({ pinyin, zhuyin }) =>
  Deno.test(`converts '${pinyin}' to '${zhuyin}'`, () => {
    const result = syllableParser.fromPinyinNumber(pinyin).toBopomofo();
    assertEquals(result, zhuyin);
  })
);

const pinyinToneMarkAndZhuyinPairs = [{
  pinyin: "yāo",
  zhuyin: "ㄧㄠ",
}, {
  pinyin: "yáo",
  zhuyin: "ㄧㄠˊ",
}, {
  pinyin: "yǎo",
  zhuyin: "ㄧㄠˇ",
}, {
  pinyin: "yào",
  zhuyin: "ㄧㄠˋ",
}, {
  pinyin: "yao",
  zhuyin: "˙ㄧㄠ",
}];

pinyinToneMarkAndZhuyinPairs.forEach(({ pinyin, zhuyin }) =>
  Deno.test(`converts '${pinyin}' to '${zhuyin}'`, () => {
    const result = syllableParser.fromPinyinToneMark(pinyin).toBopomofo();
    assertEquals(result, zhuyin);
  })
);

// Test bopomofo to pinyin conversion
const bopomofoAndPinyinPairs = [{
  bopomofo: "ㄧㄠ",
  pinyin: "yao",
}, {
  bopomofo: "ㄧㄠˊ",
  pinyin: "yáo",
}, {
  bopomofo: "ㄧㄠˇ",
  pinyin: "yǎo",
}, {
  bopomofo: "ㄧㄠˋ",
  pinyin: "yào",
}, {
  bopomofo: "˙ㄧㄠ",
  pinyin: "yao",
}];

bopomofoAndPinyinPairs.forEach(({ bopomofo, pinyin }) =>
  Deno.test(`converts '${bopomofo}' to '${pinyin}'`, () => {
    const result = syllableParser.fromBopomofo(bopomofo).toPinyin();
    assertEquals(result, pinyin);
  })
);

// Deno.test("converts 'yao1' to 'ㄧㄠ'", () => {
//   const result = SyllableConverter.fromPinyinNumber("ma1").toBopomofo()
//   assertEquals(result, "ㄧㄠ")
// })

// Deno.test("converts 'ma2' to 'ㄇㄚˊ'", () => {
//   const result = SyllableConverter.fromPinyinNumber("ma2").toBopomofo()
//   assertEquals(result, "ㄇㄚˊ")
// })

// Deno.test("converts 'ma3' to 'ㄇㄚˇ'", () => {
//   const result = SyllableConverter.fromPinyinNumber("ma3").toBopomofo()
//   assertEquals(result, "ㄇㄚˇ")
// })

// Deno.test("converts 'ma4' to 'ㄇㄚˋ'", () => {
//   const result = SyllableConverter.fromPinyinNumber("ma4").toBopomofo()
//   assertEquals(result, "ㄇㄚˋ")
// })

// Deno.test("converts 'ma5' to '˙ㄇㄚ'", () => {
//   const result = SyllableConverter.fromPinyinNumber("ma5").toBopomofo()
//   assertEquals(result, "˙ㄇㄚ")
// })

// Deno.test("converts 'má' to 'ㄇㄚˊ", () => {
//   const result = SyllableConverter.fromPinyinNumber("má").toBopomofo()
//   assertEquals(result, "ㄇㄚ")
// })

// Deno.test("converts 'ㄇㄚˊ' to 'má'", () => {
//   const result = SyllableConverter.fromPinyinNumber("ma2").toBopomofo()
//   assertEquals(result, "ㄇㄚ")
// })

// Deno.test("converts 'ㄇㄚˊ' to 'ma2'", () => {
//   const result = SyllableConverter.fromPinyinNumber("ma2").toBopomofo()
//   assertEquals(result, "ㄇㄚ")
// })
