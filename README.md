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

## Quickstart

```ts
import { syllableParser } from "@austinshelby/pinyin-to-bopomofo";

const bopomofo = syllableParser.fromPinyinToneMark("zhào").toBopomofo(); // ㄓㄠˋ

const bopomofo2 = syllableParser.fromPinyinNumber("zhao4").toBopomofo(); // ㄓㄠˋ

const pinyin = syllableParser.fromBopomofo("ㄓㄠˋ").toPinyinToneMark(); // zhào
```

## About

`pinyin-to-bopomofo` offers a lightweight way to translate between pinyin
(commonly used in mainland China) and bopomofo/zhuyin (commonly used in Taiwan).

## Used in

- [MandoFlow](https://www.mandoflow.com/). Turn your favorite YouTube videos
  into personalized Mandarin Chinese language lessons.
