import { syllableParser } from "./converter.ts";
import { assertEquals } from "jsr:@std/assert";

const testData = [{
  pinyinNumber: "yao1",
  pinyinToneMark: "yāo",
  zhuyin: "ㄧㄠ",
}, {
  pinyinNumber: "yao2",
  pinyinToneMark: "yáo",
  zhuyin: "ㄧㄠˊ",
}, {
  pinyinNumber: "yao3",
  pinyinToneMark: "yǎo",
  zhuyin: "ㄧㄠˇ",
}, {
  pinyinNumber: "yao4",
  pinyinToneMark: "yào",
  zhuyin: "ㄧㄠˋ",
}, {
  pinyinNumber: "yao5",
  pinyinToneMark: "yao",
  zhuyin: "˙ㄧㄠ",
}];

testData.forEach(({ pinyinNumber, zhuyin }) =>
  Deno.test(`converts '${pinyinNumber}' to '${zhuyin}'`, () => {
    const result = syllableParser.fromPinyinNumber(pinyinNumber).toBopomofo();
    assertEquals(result, zhuyin);
  })
);

testData.forEach(({ pinyinToneMark, zhuyin }) =>
  Deno.test(`converts '${pinyinToneMark}' to '${zhuyin}'`, () => {
    const result = syllableParser.fromPinyinToneMark(pinyinToneMark)
      .toBopomofo();
    assertEquals(result, zhuyin);
  })
);

testData.forEach(({ pinyinToneMark, pinyinNumber }) =>
  Deno.test(`converts '${pinyinToneMark}' to '${pinyinNumber}'`, () => {
    const result = syllableParser.fromPinyinToneMark(pinyinToneMark)
      .toPinyinNumber();
    assertEquals(result, pinyinNumber);
  })
);

testData.forEach(({ zhuyin, pinyinNumber }) =>
  Deno.test(`converts '${zhuyin}' to '${pinyinNumber}'`, () => {
    const result = syllableParser.fromBopomofo(zhuyin).toPinyinNumber();
    assertEquals(result, pinyinNumber);
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
