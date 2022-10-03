import { NODE_TYPE } from "~/modules/node.ts";
import { type AST, ASTNode } from "~/modules/parser.ts";
import { traverse } from "~/modules/traversar.ts";

export type Expression = {
  type: typeof NODE_TYPE.CALL_EXPRESSION;
  callee: {
    type: typeof NODE_TYPE.IDENTIFIER;
    name: string;
  };
  arguments: TransformedASTNode[];
};

export type TransformedASTNode =
  | {
    type: typeof NODE_TYPE.NUMBER_LITERAL;
    value: string;
  }
  | {
    type: typeof NODE_TYPE.STRING_LITERAL;
    value: string;
  }
  | Expression
  | {
    type: typeof NODE_TYPE.EXPRESSION_STATEMENT;
    expression: Expression;
  };

export type TransformedAST = {
  type: "Program";
  body: TransformedASTNode[];
};

export function transform(
  ast: AST & { _context: TransformedAST["body"] },
): TransformedAST {
  const newAST: TransformedAST = {
    type: "Program",
    body: [],
  };

  ast._context = newAST.body;

  traverse(ast, {
    [NODE_TYPE.CALL_EXPRESSION]: {
      enter(node, parent: AST | ASTNode | null) {
        if (parent === null || node.type !== NODE_TYPE.CALL_EXPRESSION) {
          return;
        }
        const expression = {
          type: NODE_TYPE.CALL_EXPRESSION,
          callee: {
            type: NODE_TYPE.IDENTIFIER,
            name: node.value,
          },
          arguments: [],
        };
        (node as unknown as { _context: TransformedAST["body"] })._context =
          expression.arguments;
        if (parent.type !== NODE_TYPE.CALL_EXPRESSION) {
          (parent as unknown as { _context: TransformedAST["body"] })._context
            .push({
              type: NODE_TYPE.EXPRESSION_STATEMENT,
              expression: expression,
            });
          return;
        }
        if ("_context" in parent) {
          (parent as { _context: TransformedAST["body"] })._context.push(
            expression,
          );
        }
      },
    },
    [NODE_TYPE.NUMBER_LITERAL]: {
      enter(node, parent: AST | ASTNode | null) {
        if (parent === null || node.type !== NODE_TYPE.NUMBER_LITERAL) {
          return;
        }
        (parent as unknown as { _context: TransformedAST["body"] })._context
          .push({
            type: NODE_TYPE.NUMBER_LITERAL,
            value: node.value,
          });
      },
    },
    [NODE_TYPE.STRING_LITERAL]: {
      enter(node, parent: AST | ASTNode | null) {
        if (parent === null || node.type !== NODE_TYPE.STRING_LITERAL) {
          return;
        }
        (parent as unknown as { _context: TransformedAST["body"] })._context
          .push({
            type: NODE_TYPE.STRING_LITERAL,
            value: node.value,
          });
      },
    },
  });

  return newAST;
}
