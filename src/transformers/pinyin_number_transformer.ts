import type { SyllableAST } from "../types.ts";
import { Transformer } from "./transformer.ts";

export class PinyinNumberTransformer extends Transformer {
  public transform(syllables: SyllableAST[]): string {
    return syllables.map((syllable) => this.toPinyinNumber(syllable)).join("");
  }

  private toPinyinNumber(syllable: SyllableAST): string {
    return `${syllable.syllable}${syllable.tone}`;
  }
}

export const pinyinNumberTransformer = new PinyinNumberTransformer()