import { NODE_TYPE } from "~/modules/node.ts";
import {
  type Expression,
  type TransformedAST,
  type TransformedASTNode,
} from "~/modules/transformer.ts";

type Node = TransformedAST | TransformedASTNode | Expression["callee"];

export function codeGenerate(node: Node): string {
  switch (node.type) {
    case "Program": {
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
