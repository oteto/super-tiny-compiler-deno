import { assertEquals } from "~/deps.ts";
import { parse } from "~/modules/parser.ts";
import { TOKEN } from "~/modules/tokenizer.ts";

Deno.test("parser", (_) => {
  assertEquals(
    parse([
      { type: TOKEN.PAREN, value: "(" },
      { type: TOKEN.IDENT, value: "add" },
      { type: TOKEN.NUMBER, value: "2" },
      { type: TOKEN.PAREN, value: "(" },
      { type: TOKEN.IDENT, value: "subtract" },
      { type: TOKEN.NUMBER, value: "4" },
      { type: TOKEN.NUMBER, value: "2" },
      { type: TOKEN.PAREN, value: ")" },
      { type: TOKEN.PAREN, value: ")" },
      { type: TOKEN.PAREN, value: "(" },
      { type: TOKEN.IDENT, value: "concat" },
      { type: TOKEN.STRING, value: "foo" },
      { type: TOKEN.PAREN, value: "(" },
      { type: TOKEN.IDENT, value: "concat" },
      { type: TOKEN.STRING, value: "bar" },
      { type: TOKEN.STRING, value: "hoge" },
      { type: TOKEN.PAREN, value: ")" },
      { type: TOKEN.PAREN, value: ")" },
    ]),
    {
      type: "Program",
      body: [
        {
          type: "CallExpression",
          value: "add",
          params: [
            {
              type: "NumberLiteral",
              value: "2",
            },
            {
              type: "CallExpression",
              value: "subtract",
              params: [
                { type: "NumberLiteral", value: "4" },
                { type: "NumberLiteral", value: "2" },
              ],
            },
          ],
        },
        {
          type: "CallExpression",
          value: "concat",
          params: [
            {
              type: "StringLiteral",
              value: "foo",
            },
            {
              type: "CallExpression",
              value: "concat",
              params: [
                { type: "StringLiteral", value: "bar" },
                { type: "StringLiteral", value: "hoge" },
              ],
            },
          ],
        },
      ],
    },
  );
});
