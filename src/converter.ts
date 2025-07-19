import type { Parser } from "./parsers/parser.ts";
import type { Transformer } from "./transformers/transformer.ts";

export class Converter {
  private readonly parser: Parser;
  private readonly transformer: Transformer;

  constructor({ parser, transformer }: { parser: Parser, transformer: Transformer }) {
    this.parser = parser;
    this.transformer = transformer;
  }

  public convert(text: string): string {
    const syllableASTs = this.parser.parse(text)
    const result = this.transformer.transform(syllableASTs)
    return result
  }
}