import { NODE_TYPE } from "~/modules/node.ts";
import { TOKEN, type Token } from "~/modules/tokenizer.ts";

export type ASTNode = {
  type: typeof NODE_TYPE.NUMBER_LITERAL;
  value: string;
} | {
  type: typeof NODE_TYPE.STRING_LITERAL;
  value: string;
} | {
  type: typeof NODE_TYPE.CALL_EXPRESSION;
  value: string;
  params: ASTNode[];
};

export type AST = {
  type: "Program";
  body: ASTNode[];
};

export function parse(tokens: Token[]): AST {
  let currentIndex = 0;

  function walk(): ASTNode {
    let token = tokens[currentIndex];

    switch (token.type) {
      case TOKEN.PAREN: {
        if (token.value === "(") {
          currentIndex += 1;
          token = tokens[currentIndex];
          // '(' の次には関数名のトークン 'ident' が入っているはず
          if (token.type !== TOKEN.IDENT) {
            throw new TypeError(
              `we expect 'ident' token. got: ${token.type}`,
            );
          }
          const node: ASTNode = {
            type: NODE_TYPE.CALL_EXPRESSION,
            value: token.value,
            params: [],
          };

          // params をパースしていく
          currentIndex += 1;
          token = tokens[currentIndex];

          // ')' が出てくるまで走査
          while (
            token.type !== TOKEN.PAREN ||
            (token.type === TOKEN.PAREN && token.value === "(")
          ) {
            const paramNode = walk();
            node.params.push(paramNode);
            token = tokens[currentIndex];
          }
          // 現在のトークンの値は ')' のはずなので次のトークンに進める
          currentIndex += 1;
          return node;
        }
        throw new TypeError(
          `${token.type} '${token.value}' is not expected`,
        );
      }
      case TOKEN.NUMBER: {
        currentIndex += 1;
        return {
          type: NODE_TYPE.NUMBER_LITERAL,
          value: token.value,
        };
      }
      case TOKEN.STRING: {
        currentIndex += 1;
        return {
          type: NODE_TYPE.STRING_LITERAL,
          value: token.value,
        };
      }
      case TOKEN.IDENT: {
        throw new TypeError(
          `${token.type} should be processed together with the 'paren' token`,
        );
      }
    }
  }

  const ast: AST = {
    type: "Program",
    body: [],
  };

  while (currentIndex < tokens.length) {
    const node = walk();
    ast.body.push(node);
  }

  return ast;
}
