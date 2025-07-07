export const pinyinToneMap = new Map<string, 1 | 2 | 3 | 4>([
  [String.fromCodePoint(772), 1],
  [String.fromCodePoint(769), 2],
  [String.fromCodePoint(780), 3],
  [String.fromCodePoint(768), 4],
]);

export const pinyinTones = {
  1: String.fromCodePoint(772),
  2: String.fromCodePoint(769),
  3: String.fromCodePoint(780),
  4: String.fromCodePoint(768),
  5: "",
};

export const zhuyinToneMap = new Map<string, 2 | 3 | 4 | 5>([
  [String.fromCodePoint(714), 2],
  [String.fromCodePoint(711), 3],
  [String.fromCodePoint(715), 4],
  [String.fromCodePoint(729), 5],
]);

export const zhuyinTones = {
  1: "",
  2: String.fromCodePoint(714),
  3: String.fromCodePoint(711),
  4: String.fromCodePoint(715),
  5: String.fromCodePoint(729),
};

export const pinyinToneRegex = new RegExp(
  `(${
    [
      String.fromCodePoint(772),
      String.fromCodePoint(769),
      String.fromCodePoint(780),
      String.fromCodePoint(768),
    ].join("|")
  })`,
  "i",
);
