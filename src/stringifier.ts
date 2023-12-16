import {
  ASTArrayNode,
  ASTFunctionNode,
  ASTNode,
  ASTObjectNode,
  ASTValueNode,
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

  protected abstract visitFunctionNode(node: ASTFunctionNode): string;

  protected abstract visitVariableNode(node: ASTVariableNode): string;

  protected abstract visitArrayNode(node: ASTArrayNode): string;

  protected abstract visitObjectNode(node: ASTObjectNode): string;

}
