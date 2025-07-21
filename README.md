# pinyin-to-bopomofo

Translate between pinyin with tone marks (i.e. zhào), pinyin with numbers (i.e.
zhao4), and bopomofo/zhuyin (i.e. ㄓㄠˋ).

## Installation

Node.js

```
npx jsr add @austinshelby/pinyin-to-bopomofo
```

Deno

```
deno add jsr:@austinshelby/pinyin-to-bopomofo
```

## Guide

Translate between pinyin and bopomofo.

```ts
import {
  bopomofoToPinyin,
  pinyinToBopomofo,
} from "@austinshelby/pinyin-to-bopomofo";

const bopomofo = pinyinToBopomofo("zhào"); // ㄓㄠˋ

const pinyin = bopomofoToPinyin("ㄓㄠˋ"); // zhào
```

Translate between pinyin (tone numbers) and bopomofo.

```ts
import {
  bopomofoToPinyin,
  pinyinToBopomofo,
} from "@austinshelby/pinyin-to-bopomofo";

const bopomofo = pinyinToBopomofo("zhao4", "NUMBER"); // ㄓㄠˋ

const pinyin = bopomofoToPinyin("ㄓㄠˋ", "NUMBER"); // zhao4
```

## About

`pinyin-to-bopomofo` offers a lightweight way to translate between pinyin
(commonly used in mainland China) and bopomofo/zhuyin (commonly used in Taiwan).

## Used in

- [MandoFlow](https://www.mandoflow.com/). Turn your favorite YouTube videos
  into personalized Mandarin Chinese language lessons.
