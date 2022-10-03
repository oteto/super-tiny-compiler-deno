import { NODE_TYPE } from "~/modules/node.ts";
import { type AST, type ASTNode } from "~/modules/parser.ts";

type Node = AST | ASTNode;

type VisitorMethods = {
  enter?: (node: Node, parent: Node | null) => void;
  exit?: (node: Node, parent: Node | null) => void;
};

type Visitor =
  & {
    [
      P in typeof NODE_TYPE[
        keyof Pick<
          typeof NODE_TYPE,
          "NUMBER_LITERAL" | "STRING_LITERAL" | "CALL_EXPRESSION"
        >
      ]
    ]: VisitorMethods;
  }
  & {
    [
      P in typeof NODE_TYPE[keyof Pick<typeof NODE_TYPE, "PROGRAM">]
    ]?: undefined;
  };

export function traverse(ast: AST, visitor: Visitor): void {
  function traverseArray(array: Node[], parent: Node): void {
    for (const child of array) {
      traverseNode(child, parent);
    }
  }

  function traverseNode(node: Node, parent: Node | null): void {
    const methods = visitor[node.type];
    methods?.enter?.(node, parent);

    switch (node.type) {
      case "Program": {
        traverseArray(node.body, node);
        break;
      }
      case NODE_TYPE.CALL_EXPRESSION: {
        traverseArray(node.params, node);
        break;
      }
      case NODE_TYPE.NUMBER_LITERAL:
      case NODE_TYPE.STRING_LITERAL: {
        break;
      }
    }

    methods?.exit?.(node, parent);
  }

  traverseNode(ast, null);
}
