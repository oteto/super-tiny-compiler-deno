import { NODE_TYPE } from "~/modules/node.ts";
import { type TransformedASTNode } from "~/modules/transformer.ts";

export function codeGenerate(node: TransformedASTNode): string {
  switch (node.type) {
    case NODE_TYPE.PROGRAM: {
      return node.body.map(codeGenerate).join("\n");
    }
    case NODE_TYPE.NUMBER_LITERAL: {
      return node.value;
    }
    case NODE_TYPE.STRING_LITERAL: {
      return `"${node.value}"`;
    }
    case NODE_TYPE.CALL_EXPRESSION: {
      return `${codeGenerate(node.callee)}(${
        node.arguments.map(codeGenerate).join(", ")
      })`;
    }
    case NODE_TYPE.IDENTIFIER: {
      return node.name;
    }
    case NODE_TYPE.EXPRESSION_STATEMENT: {
      return `${codeGenerate(node.expression)};`;
    }
  }
}
