import { ASTFunctionNode, ASTNode, ASTPathNode, ASTValueNode, ASTVariableNode } from './node';

/* Base class Interpreter, this contains common methods for interpreters */
abstract class InterpreterBase {

  protected visitNode(node: ASTNode): string {
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

  protected visitValueNode(node: ASTValueNode): string {
    if (Array.isArray(node.value)) {
      return `[${node.value.map(item => this.visitValue(item)).join(', ')}]`;
    }

    return this.visitValue(node.value);
  }

  protected visitValue(item: string): string {

    if (typeof item === 'string') {
      return `'${String(item)}'`;
    }

    return item;
  }

  protected visitArrayNodes(array: ASTNode[]): string {
    return array.map(arg => this.visitNode(arg)).join(', ');
  }

  protected abstract visitFunctionNode(node: ASTFunctionNode): string;
  protected abstract visitVariableNode(node: ASTVariableNode): string;
  protected abstract visitPathNode(node: ASTPathNode): string;
}

/*
 * InterpreterToFormula is responsible for build an Excel-like formula from AST
 */
export class InterpreterToFormula extends InterpreterBase {

  protected visitFunctionNode(node: ASTFunctionNode): string {
    return `${node.name}(${this.visitArrayNodes(node.args)})`;
  }

  protected visitVariableNode(node: ASTVariableNode): string {
    return node.name;
  }

  protected visitPathNode(node: ASTPathNode): string {
    return node.path;
  }

  interpret(tree: ASTNode): string {
    return this.visitNode(tree);
  }
}

/*
 * InterpreterToHtml is responsible for build an HTML Excel-like formula from AST
 */
export class InterpreterToHtml extends InterpreterBase {

  maxParenDeep: number;
  currentDeep: number;

  constructor(maxParenDeep:number=3) {
    super();
    this.maxParenDeep = maxParenDeep;
    this.currentDeep = 1;
  }

  protected visitFunctionNode(node: ASTFunctionNode): string {
    var result: string = '';

    const paren: string = `paren-deep-${this.currentDeep}`;
    this.incrementParenDeep();

    result += this.createHtmlSpan('function', node.name);
    result += this.createHtmlSpan(paren, '(');
    result += this.visitArrayNodes(node.args);
    result += (node.closed) ? this.createHtmlSpan(paren, ')') : ``;

    return result;
  }

  protected incrementParenDeep() : void {
    if (this.currentDeep < this.maxParenDeep) {
      this.currentDeep += 1;
    } else {
      this.currentDeep = 1;
    }
  }

  protected visitVariableNode(node: ASTVariableNode): string {
    return this.createHtmlSpan('variable', node.name);
  }

  protected visitPathNode(node: ASTPathNode): string {
    return this.createHtmlSpan('path', node.path);
  }

  protected visitValue(string: string): string {
    return this.createHtmlSpan('value', super.visitValue(string));
  }

  private createHtmlSpan(class_attr: string, value: string): string {
    return `<span class="${class_attr}">${value}</span>`;
  }

  setMaxParenDeep(newMaxParenDeep: number) : void {
    this.maxParenDeep = newMaxParenDeep;
  }

  interpret(tree: ASTNode): string {
    this.currentDeep = 1;
    return `<div>${this.visitNode(tree)}</div>`;
  }
}
