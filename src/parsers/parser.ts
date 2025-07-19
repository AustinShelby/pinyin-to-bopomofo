import type { SyllableAST } from "../types.ts";

export abstract class Parser {
  public abstract parse(text: string): SyllableAST[]
}