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

export class HtmlStringifier extends Stringifier {
  maxParenDeep: number;
  currentDeep = 1;

  constructor(maxParenDeep: number = 3) {
    super();
    this.maxParenDeep = maxParenDeep;
  }

  stringify(tree: ASTNode): string {
    this.currentDeep = 1;
    return `<div>${this.visitNode(tree)}</div>`;
  }

  setMaxParenDeep(newMaxParenDeep: number): void {
    this.maxParenDeep = newMaxParenDeep;
  }

  protected visitFunctionNode(node: ASTFunctionNode): string {
    let result: string = '';

    const paren: string = `paren-deep-${this.currentDeep}`;
    this.incrementParenDeep();

    result += this.createHtmlSpan('function', node.name);
    result += this.createHtmlSpan(paren, '(');
    result += node.args.map(arg => this.visitNode(arg)).join(', ')
    result += (node.closed) ? this.createHtmlSpan(paren, ')') : ``;

    return result;
  }

  protected incrementParenDeep(): void {
    if (this.currentDeep < this.maxParenDeep) {
      this.currentDeep += 1;
    } else {
      this.currentDeep = 1;
    }
  }

  protected visitVariableNode(node: ASTVariableNode): string {
    return this.createHtmlSpan('variable', node.name);
  }

  protected override processStringValue(value: any): string {
    return this.createHtmlSpan('value', super.processStringValue(value));
  }

  private createHtmlSpan(class_attr: string, value: string): string {
    return `<span class="${class_attr}">${value}</span>`;
  }

  protected visitArrayNode(node: ASTArrayNode): string {
    let result: string = '';
  
    const paren: string = `paren-deep-${this.currentDeep}`;
    this.incrementParenDeep();

    result += this.createHtmlSpan(paren, '[');
    result += node.items.map(node => {
      const deepStored = this.currentDeep;
      const result = this.visitNode(node)
      this.currentDeep = deepStored;
      return result
    }).join(', ');
    result += (node.closed) ? this.createHtmlSpan(paren, ']') : ``;

    return result;
  }

  protected visitObjectNode(node: ASTObjectNode): string {
    let result: string = '';

    const paren: string = `paren-deep-${this.currentDeep}`;
    this.incrementParenDeep();

    result += this.createHtmlSpan(paren, '{');
    result += node.properties.map(prop => {
      const deepStored = this.currentDeep;
      const key = this.visitNode(prop.key)
      const value = this.visitNode(prop.value)
      this.currentDeep = deepStored;
      return `${key}: ${value}`;
    }).join(', ');
    result += (node.closed) ? this.createHtmlSpan(paren, '}') : ``;

    return result
  }

  protected visitInvertNode(node: ASTInvertNode): string {
    const paren: string = `paren-deep-${this.currentDeep}`;

    let result: string = '';
    result += this.createHtmlSpan(paren, '!');
    result += this.visitNode(node.item);

    return result;
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

    const paren: string = `paren-deep-${this.currentDeep}`;
    this.incrementParenDeep();
    const operatorSpan: string = this.createHtmlSpan(paren, operator);
  
    let result: string = '';
    result += node.items.map(node => this.visitNode(node)).join(operatorSpan);
    result += (node.closed) ? '' : operatorSpan;

    return result;
  }
}
