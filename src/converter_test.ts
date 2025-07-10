import { assertEquals } from "jsr:@std/assert";
import { converter } from "./converter.ts";

Deno.test(`converts 'jièshào' to 'ㄐㄧㄝˋㄕㄠˋ'`, () => {
  const result = converter.convert("jièshào", { from: "pinyinToneMark", to: "bopomofo" })
  assertEquals(result, `ㄐㄧㄝˋㄕㄠˋ`);
})

Deno.test(`converts 'tāmen' to 'ㄊㄚ˙ㄇㄣ'`, () => {
  const result = converter.convert("tāmen", { from: "pinyinToneMark", to: "bopomofo" })
  assertEquals(result, `ㄊㄚ˙ㄇㄣ`);
})

Deno.test(`converts 'zěnmeyàng' to 'ㄗㄣˇ˙ㄇㄜㄧㄤˋ'`, () => {
  const result = converter.convert("zěnmeyàng", { from: "pinyinToneMark", to: "bopomofo" })
  assertEquals(result, `ㄗㄣˇ˙ㄇㄜㄧㄤˋ`);
})

Deno.test(`converts 'zen3me5yang4' to 'ㄗㄣˇ˙ㄇㄜㄧㄤˋ'`, () => {
  const result = converter.pinyinNumberToBopomofo("zen3me5yang4")
  assertEquals(result, `ㄗㄣˇ˙ㄇㄜㄧㄤˋ`);
})

Deno.test.only(`converts 'ㄗㄣˇ˙ㄇㄜㄧㄤˋ' to 'zěnmeyàng'`, () => {
  const result = converter.bopomofoToPinyin("ㄗㄣˇ˙ㄇㄜㄧㄤˋ")
  assertEquals(result, `zěnmeyàng`);
})
