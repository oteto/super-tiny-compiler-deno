import { parse } from "~/modules/parser.ts";
import { tokenize } from "~/modules/tokenizer.ts";
import { codeGenerate } from "~/modules/code_generator.ts";
import { transform } from "~/modules/transformer.ts";

function main() {
  const input = `
(add 2 (subtract 4 2))
(concat "foo" (concat "bar" "hoge"))
`;
  const tokens = tokenize(input);
  const ast = parse(tokens);
  const newAst = transform(ast as any);
  const output = codeGenerate(newAst);
  console.log(output);
}

if (import.meta.main) {
  main();
}
