import { syllableParser } from "./syllable_parser.ts";
import { assertEquals, assertThrows } from "jsr:@std/assert";

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
}, {
  pinyinNumber: "zhao4",
  pinyinToneMark: "zhào",
  zhuyin: "ㄓㄠˋ",
}, {
  pinyinNumber: "mei3",
  pinyinToneMark: "měi",
  zhuyin: "ㄇㄟˇ",
}, {
  pinyinNumber: "jue2",
  pinyinToneMark: "jué",
  zhuyin: "ㄐㄩㄝˊ",
}, {
  pinyinNumber: "dou1",
  pinyinToneMark: "dōu",
  zhuyin: "ㄉㄡ",
}, {
  pinyinNumber: "xiao3",
  pinyinToneMark: "xiǎo",
  zhuyin: "ㄒㄧㄠˇ",
}, {
  pinyinNumber: "dui4",
  pinyinToneMark: "duì",
  zhuyin: "ㄉㄨㄟˋ",
}, {
  pinyinNumber: "niu2",
  pinyinToneMark: "niú",
  zhuyin: "ㄋㄧㄡˊ",
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

testData.forEach(({ zhuyin, pinyinToneMark }) =>
  Deno.test(`converts '${zhuyin}' to '${pinyinToneMark}'`, () => {
    const result = syllableParser.fromBopomofo(zhuyin).toPinyinToneMark();
    assertEquals(result, pinyinToneMark);
  })
);

Deno.test(`invalid pinyin number 'xxx' throws`, () => {
  assertThrows(() => syllableParser.fromPinyinNumber("xxx"), Error);
});

Deno.test(`invalid pinyin tone mark 'xxx' throws`, () => {
  assertThrows(() => syllableParser.fromPinyinToneMark("xxx"), Error);
});

Deno.test(`invalid zhuyin 'xxx' throws`, () => {
  assertThrows(() => syllableParser.fromBopomofo("xxx"), Error);
});

// TODO: Add some code coverage metrics