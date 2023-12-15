import {
  ASTArrayNode,
  ASTFunctionNode,
  ASTNode,
  ASTObjectNode,
  ASTVariableNode
} from './node';
import { Stringifier } from './stringifier';

export class DefaultStringifier extends Stringifier {
  stringify(tree: ASTNode): string {
    return this.visitNode(tree);
  }

  protected visitFunctionNode(node: ASTFunctionNode): string {
    return `${node.name}(${node.args.map(node => this.visitNode(node)).join(', ')})`;
  }

  protected visitVariableNode(node: ASTVariableNode): string {
    return node.name;
  }

  protected visitArrayNode(node: ASTArrayNode): string {
    return "[" + node.items.map(node => this.visitNode(node)).join(', ') + "]";
  }

  protected visitObjectNode(node: ASTObjectNode): string {
    return ""
  }

}
