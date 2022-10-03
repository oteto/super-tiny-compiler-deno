import { assertEquals } from "~/deps.ts";
import { TOKEN, tokenize } from "~/modules/tokenizer.ts";

Deno.test("tokenize", (_) => {
  assertEquals(
    tokenize("(add 2 (subtract 4 2))"),
    [
      { type: TOKEN.PAREN, value: "(" },
      { type: TOKEN.IDENT, value: "add" },
      { type: TOKEN.NUMBER, value: "2" },
      { type: TOKEN.PAREN, value: "(" },
      { type: TOKEN.IDENT, value: "subtract" },
      { type: TOKEN.NUMBER, value: "4" },
      { type: TOKEN.NUMBER, value: "2" },
      { type: TOKEN.PAREN, value: ")" },
      { type: TOKEN.PAREN, value: ")" },
    ],
  );

  assertEquals(
    tokenize('(concat "foo" (concat "bar" "hoge"))'),
    [
      { type: TOKEN.PAREN, value: "(" },
      { type: TOKEN.IDENT, value: "concat" },
      { type: TOKEN.STRING, value: "foo" },
      { type: TOKEN.PAREN, value: "(" },
      { type: TOKEN.IDENT, value: "concat" },
      { type: TOKEN.STRING, value: "bar" },
      { type: TOKEN.STRING, value: "hoge" },
      { type: TOKEN.PAREN, value: ")" },
      { type: TOKEN.PAREN, value: ")" },
    ],
  );
});
