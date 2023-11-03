import { ASTFunctionNode, ASTNode, ASTVariableNode } from './node';
import { Stringifier } from './stringifier';

export class DefaultStringifier extends Stringifier {
  stringify(tree: ASTNode): string {
    return this.visitNode(tree);
  }

  protected visitFunctionNode(node: ASTFunctionNode): string {
    return `${node.name}(${this.visitArrayNodes(node.args)})`;
  }

  protected visitVariableNode(node: ASTVariableNode): string {
    return node.name;
  }
}
