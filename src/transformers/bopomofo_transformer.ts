import { pinyinToBopomofoDictionary } from "../dictionaries.ts";
import { zhuyinTones } from "../tones.ts";
import type { SyllableAST } from "../types.ts";
import { Transformer } from "./transformer.ts";

export class BopomofoTransformer extends Transformer {
  public transform(syllables: SyllableAST[]): string {
    const text = syllables.map((syllable) => {

      const bopomofo = pinyinToBopomofoDictionary.get(syllable.syllable);

      if (!bopomofo) {
        throw new Error(
          `Couldn't find bopomofo for syllable '${syllable.syllable}'`,
        );
      }

      const tone = zhuyinTones[syllable.tone];

      if (syllable.tone === 5) {
        return `${tone}${bopomofo}`;
      }

      return `${bopomofo}${tone}`;
    }
    ).join("")

    return text
  }
}