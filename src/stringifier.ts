import { ASTFunctionNode, ASTNode, ASTValueNode, ASTVariableNode } from './node';
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
      default:
        throw new Error(`Unrecognised AST node`);
    }
  }

  protected visitValueNode(node: ASTValueNode): string {
    if (Array.isArray(node.value)) {
      return `[${node.value.map(item => this.processStringValue(item)).join(', ')}]`;
    }

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

  protected visitArrayNodes(array: ASTNode[]): string {
    return array.map(arg => this.visitNode(arg)).join(', ');
  }

  protected abstract visitFunctionNode(node: ASTFunctionNode): string;

  protected abstract visitVariableNode(node: ASTVariableNode): string;
}
