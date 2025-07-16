export type Tones = 1 | 2 | 3 | 4 | 5;

export type SyllableAST = {
  syllable: string;
  tone: Tones;
};

export type PinyinStyle = 'TONE_MARK' | 'NUMBER'