import {
  ASTArrayNode,
  ASTFunctionNode,
  ASTOperatorChainNode,
  ASTNode,
  ASTObjectNode,
  ASTInvertNode,
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
    return `!${this.visitNode(node.item)}`;
  }

  protected visitOperatorNode(node: ASTOperatorChainNode): string {
    let operator: string = ''
    if (node.type === 'plus') {
      operator = ' + ';
    } else if (node.type === 'minus') {
      operator = ' - ';
    } else if (node.type === 'multiply') {
      operator = ' * ';
    } else if (node.type === 'divide') {
      operator = ' / ';
    } else {
      throw new Error(`Unrecognised operator type ${node.type}`);
    }

    let result: string = '';
    result += node.items.map(node => this.visitNode(node)).join(operator);
    result += (node.closed) ? operator : '';

    return result;
  }
}
