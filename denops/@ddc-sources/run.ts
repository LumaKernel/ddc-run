import type { Candidate } from "https://deno.land/x/ddc_vim@v0.13.0/types.ts";
import { BaseSource } from "https://deno.land/x/ddc_vim@v0.13.0/types.ts";
import type {
  GatherCandidatesArguments,
} from "https://deno.land/x/ddc_vim@v0.13.0/base/source.ts";

type Params = {
  cmd: string[];
  env: Record<string, string>;
  regex: string;
  regexMode: string;
  stdout: boolean;
  stderr: boolean;
  ignoreFail: boolean;
  kind?: string;
  menu?: string;
};

export class Source extends BaseSource<Params> {
  async gatherCandidates(
    args: GatherCandidatesArguments<Params>,
  ): Promise<Candidate[]> {
    const p = args.sourceParams as Params;
    const pattern = new RegExp(p.regex, p.regexMode);
    const getWords = (s: string) =>
      Array
        .from(s.matchAll(pattern))
        .flatMap((
          m,
        ) => (m.length === 1 ? m[0] : m.slice(1)));
    try {
      const proc = Deno.run({
        cmd: p.cmd,
        stdin: "null",
        env: p.env,
        stdout: p.stdout ? "piped" : "null",
        stderr: p.stderr ? "piped" : "null",
      });
      const status = await proc.status();
      if (!p.ignoreFail && !status.success) return [];
      const words: string[] = [
        ...p.stdout
          ? getWords(new TextDecoder().decode(await proc.output()))
          : [],
        ...p.stderr
          ? getWords(new TextDecoder().decode(await proc.stderrOutput()))
          : [],
      ];
      const cs: Candidate[] = Array.from(new Set(words)).map((word) => ({
        word,
        kind: p.kind,
        menu: p.menu,
      }));
      return cs;
    } catch (_e: unknown) {
      return [];
    }
  }

  params(): Params {
    return {
      cmd: [],
      env: {},
      regex: "[-_\\p{L}\\d]+",
      regexMode: "gu",
      stdout: true,
      stderr: false,
      ignoreFail: false,
    };
  }
}
