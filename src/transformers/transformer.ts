import type { SyllableAST } from "../types.ts";

export abstract class Transformer {
  public abstract transform(syllables: SyllableAST[]): string
}