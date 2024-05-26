import {
  ASTArrayNode,
  ASTFunctionNode,
  ASTOperatorNode,
  ASTNode,
  ASTObjectNode,
  ASTInvertNode,
  ASTVariableNode,
  ASTGroupNode,
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
    let result: string = '';

    result += '{';
    result += node.properties.map(prop =>{
      const key = this.visitNode(prop.key)
      const value = this.visitNode(prop.value)
      return `${key}: ${value}`
    }).join(', ');
    result += '}';

    return result;
  }

  protected visitInvertNode(node: ASTInvertNode): string {
    let result: string = '!';

    if (node.item == null) {
      return result;
    }
    result += this.visitNode(node.item);

    return result;
  }

  protected visitGroup(node: ASTGroupNode): string {
    let result: string = '';
    result += `(`;
    result += this.visitNode(node.item);
    result += (node.closed) ? ')' : '';
    return result;
  }
}
