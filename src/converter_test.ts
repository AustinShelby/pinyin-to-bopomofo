import { assertEquals } from "jsr:@std/assert";
import { bopomofoToPinyin, pinyinToBopomofo } from "./converter.ts";

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
}, {
  pinyinNumber: "jie4shao4",
  pinyinToneMark: "jièshào",
  zhuyin: "ㄐㄧㄝˋㄕㄠˋ",
}, {
  pinyinNumber: "ta1men5",
  pinyinToneMark: "tāmen",
  zhuyin: "ㄊㄚ˙ㄇㄣ",
}, {
  pinyinNumber: "zen3me5yang4",
  pinyinToneMark: "zěnmeyàng",
  zhuyin: "ㄗㄣˇ˙ㄇㄜㄧㄤˋ",
}];

testData.forEach(({ pinyinNumber, zhuyin }) =>
  Deno.test(`converts '${pinyinNumber}' to '${zhuyin}'`, () => {
    const result = pinyinToBopomofo(pinyinNumber, "NUMBER");
    assertEquals(result, zhuyin);
  })
);

testData.forEach(({ pinyinToneMark, zhuyin }) =>
  Deno.test(`converts '${pinyinToneMark}' to '${zhuyin}'`, () => {
    const result = pinyinToBopomofo(pinyinToneMark, "TONE_MARK");
    assertEquals(result, zhuyin);
  })
);

testData.forEach(({ pinyinToneMark, zhuyin }) =>
  Deno.test(`converts '${zhuyin}' to '${pinyinToneMark}'`, () => {
    const result = bopomofoToPinyin(zhuyin, "TONE_MARK")
    assertEquals(result, pinyinToneMark);
  })
);

testData.forEach(({ pinyinNumber, zhuyin }) =>
  Deno.test(`converts '${zhuyin}' to '${pinyinNumber}'`, () => {
    const result = bopomofoToPinyin(zhuyin, "NUMBER")
    assertEquals(result, pinyinNumber);
  })
);