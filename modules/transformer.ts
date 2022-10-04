import { NODE_TYPE } from "~/modules/node.ts";
import { type ASTNode } from "~/modules/parser.ts";
import { traverse } from "~/modules/traversar.ts";

type CalleeNode = {
  type: typeof NODE_TYPE.IDENTIFIER;
  name: string;
};

type Expression = {
  type: typeof NODE_TYPE.CALL_EXPRESSION;
  callee: CalleeNode;
  arguments: TransformedASTNode[];
};

const CONTEXT = Symbol("__context");

type Context = {
  [CONTEXT]?: TransformedASTNode[];
};

export type TransformedASTNode =
  | CalleeNode
  | Expression
  | {
    type: typeof NODE_TYPE.NUMBER_LITERAL;
    value: string;
  }
  | {
    type: typeof NODE_TYPE.STRING_LITERAL;
    value: string;
  }
  | {
    type: typeof NODE_TYPE.EXPRESSION_STATEMENT;
    expression: Expression;
  }
  | {
    type: typeof NODE_TYPE.PROGRAM;
    body: TransformedASTNode[];
  };

export function transform(ast: ASTNode & Context): TransformedASTNode {
  if (ast.type !== NODE_TYPE.PROGRAM) {
    throw new TypeError(`not program node. got: ${ast.type}`);
  }
  const newAST: TransformedASTNode = {
    type: NODE_TYPE.PROGRAM,
    body: [],
  };

  ast[CONTEXT] = newAST.body;

  traverse(ast, {
    [NODE_TYPE.CALL_EXPRESSION]: {
      enter(node: ASTNode & Context, parent) {
        if (parent === null || node.type !== NODE_TYPE.CALL_EXPRESSION) {
          return;
        }
        const expression: Expression = {
          type: NODE_TYPE.CALL_EXPRESSION,
          callee: {
            type: NODE_TYPE.IDENTIFIER,
            name: node.value,
          },
          arguments: [],
        };
        node[CONTEXT] = expression.arguments;
        if (!hasContext(parent)) {
          return;
        }
        if (parent.type !== NODE_TYPE.CALL_EXPRESSION) {
          parent[CONTEXT]?.push({
            type: NODE_TYPE.EXPRESSION_STATEMENT,
            expression: expression,
          });
          return;
        }
        parent[CONTEXT]?.push(expression);
      },
    },
    [NODE_TYPE.NUMBER_LITERAL]: {
      enter(node, parent) {
        if (
          parent === null || node.type !== NODE_TYPE.NUMBER_LITERAL ||
          !hasContext(parent)
        ) {
          return;
        }
        parent[CONTEXT]?.push({
          type: NODE_TYPE.NUMBER_LITERAL,
          value: node.value,
        });
      },
    },
    [NODE_TYPE.STRING_LITERAL]: {
      enter(node, parent) {
        if (
          parent === null || node.type !== NODE_TYPE.STRING_LITERAL ||
          !hasContext(parent)
        ) {
          return;
        }
        parent[CONTEXT]?.push({
          type: NODE_TYPE.STRING_LITERAL,
          value: node.value,
        });
      },
    },
  });

  return newAST;
}

const hasContext = (node: ASTNode): node is ASTNode & Context => {
  return CONTEXT in node;
};
