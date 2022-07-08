import { ASTFunctionNode, ASTNode, ASTPathNode, ASTValueNode, ASTVariableNode } from './node';

/*
 * Interpreter is responsible for interpret and build an Excel-like formula from AST
 */
export class Interpreter {
  private visitNode(node: ASTNode): string {
    switch (node.type) {
      case 'function':
        return this.visitFunctionNode(node);
      case 'variable':
        return this.visitVariableNode(node);
      case 'path':
        return this.visitPathNode(node);
      case 'value':
        return this.visitValueNode(node);
      default:
        throw new Error(`Unrecognised AST node`);
    }
  }

  private visitFunctionNode(node: ASTFunctionNode): string {
    const args = node.args.map(arg => this.visitNode(arg)).join(', ');
    return `${node.name}(${args})`;
  }

  private visitVariableNode(node: ASTVariableNode): string {
    return node.name;
  }

  private visitPathNode(node: ASTPathNode): string {
    return node.path;
  }

  private visitValueNode(node: ASTValueNode): string {
    if (Array.isArray(node.value)) {
      return `[${node.value.map(item => this.visitValue(item)).join(', ')}]`;
    }

    return this.visitValue(node.value);
  }

  private visitValue(item: string): string {
    if (typeof item === 'string') {
      return `'${String(item)}'`;
    }

    return item;
  }

  interpret(tree: ASTNode): string {
    return '=' + this.visitNode(tree);
  }
}
