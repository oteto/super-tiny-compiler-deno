import { NODE_TYPE } from "~/modules/node.ts";
import { type ASTNode } from "~/modules/parser.ts";

type VisitorMethods = {
  enter?: (node: ASTNode, parent: ASTNode | null) => void;
  exit?: (node: ASTNode, parent: ASTNode | null) => void;
};

type Visitor = {
  [P in typeof NODE_TYPE[keyof typeof NODE_TYPE]]?: VisitorMethods;
};

export function traverse(ast: ASTNode, visitor: Visitor): void {
  function traverseArray(array: ASTNode[], parent: ASTNode): void {
    for (const child of array) {
      traverseNode(child, parent);
    }
  }

  function traverseNode(node: ASTNode, parent: ASTNode | null): void {
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
