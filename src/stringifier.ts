import {
  ASTArrayNode,
  ASTFunctionNode,
  ASTOperatorNode,
  ASTNode,
  ASTObjectNode,
  ASTValueNode,
  ASTInvertNode,
  ASTVariableNode
} from './node';
import * as he from 'he';

export abstract class Stringifier {

  protected visitNode(node: ASTNode): string {
    switch (node.type) {
      case 'function':
        return this.visitFunctionNode(node);
      case 'variable':
        return this.visitVariableNode(node);
      case 'value':
        return this.visitValueNode(node);
      case 'array':
        return this.visitArrayNode(node);
      case 'object':
        return this.visitObjectNode(node);
      case 'invert':
        return this.visitInvertNode(node);
      case 'plus':
        return this.visitOperatorNode(node);
      case 'minus':
        return this.visitOperatorNode(node);
      case 'multiply':
        return this.visitOperatorNode(node);
      case 'divide':
        return this.visitOperatorNode(node);
      default:
        throw new Error(`Unrecognised AST node`);
    }
  }

  protected visitValueNode(node: ASTValueNode): string {
    if (node.value && typeof node.value === 'object') {
      return this.processObjectValue(node.value);
    }

    return this.processStringValue(node.value);
  }

  protected processObjectValue(item: object) {
    const object = Object.entries(item);
    const key_values = object.map(([key, value]) => {
      // Check for nested object values
      let result_value = '';
      if (typeof value === 'object') {
        result_value = this.processObjectValue(value);
      } else {
        result_value = this.processStringValue(value);
      }
      return `${key}: ${result_value}`;
    });
    return `{ ${key_values.join(', ')} }`;
  }

  protected processStringValue(item: any): string {
    if (typeof item === 'string') {
      const escaped: string = he.escape(item.toString());
      return `'${String(escaped)}'`;
    }

    return String(item);
  }

  protected visitOperatorNode(node: ASTOperatorNode): string {
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
    result += this.visitNode(node.left);
    result += operator;
    result += (node.closed && node.right) ? this.visitNode(node.right) : '';

    return result;
  }

  protected abstract visitFunctionNode(node: ASTFunctionNode): string;

  protected abstract visitVariableNode(node: ASTVariableNode): string;

  protected abstract visitArrayNode(node: ASTArrayNode): string;

  protected abstract visitObjectNode(node: ASTObjectNode): string;

  protected abstract visitInvertNode(node: ASTInvertNode): string;

}
