/*
 * Parser is responsible for building an abstract syntax tree (AST)
 */
import { Token, TokenType } from './token';
import { ASTFunctionNode, ASTNode, ASTPathNode, ASTValueNode, ASTVariableNode } from './node';

export class Parser {
  tokens: Token[];
  index: number;

  constructor() {
    this.tokens = [];
    this.index = 0;
  }

  getCurrentToken(): Token {
    return this.tokens[this.index];
  }

  unexpected_token_message(): string {
    return (`Unexpected token ${this.getCurrentToken().type}\n` +
      `line: ${this.getCurrentToken().line}\n` +
      `      ${' '.repeat(this.getCurrentToken().column)}^`);
  }

  // Compare current token type with a TYPE, if matchs, advance to next token, otherwise raise exception
  eat(type: TokenType): void {
    if (this.getCurrentToken().type === type) {
      this.index += 1;
    } else {
      throw new SyntaxError(this.unexpected_token_message());
    }
  }

  // Build Formula AST node formula : EQUAL entity EOF
  buildFormula(): ASTNode {
    this.eat('EQUAL');
    const entity = this.buildEntity();
    this.eat('EOF');
    return entity;
  }

  // Build ASTFunctionNode AST node function : FUNCTION LPAREN (entity COMMA?)+ RPAREN
  buildFunction(): ASTFunctionNode {
    const functionName: string = this.getCurrentToken().value;

    this.eat('FUNCTION');
    this.eat('LPAREN');

    const args: Array<ASTNode> = [];
    do {
      if (this.getCurrentToken().type === 'COMMA') {
        this.eat('COMMA');
      }
      args.push(this.buildEntity());
    } while (this.getCurrentToken().type === 'COMMA');

    this.eat('RPAREN');

    return { type: 'function', name: functionName, args };
  }

  // Build ASTFunctionNode AST node entity : (function|variable|path|value)
  buildEntity(): ASTNode {
    switch (this.getCurrentToken().type) {
      case 'FUNCTION':
        return this.buildFunction();
      case 'VARIABLE':
        return this.buildVariable();
      case 'PATH':
        return this.buildPath();
      case 'VALUE':
        return this.buildValue();
      default:
        throw new SyntaxError(this.unexpected_token_message());
    }
  }

  buildVariable(): ASTVariableNode {
    const variable = this.getCurrentToken().value;
    this.eat('VARIABLE');
    return { type: 'variable', name: variable };
  }

  buildPath(): ASTPathNode {
    const path = this.getCurrentToken().value;
    this.eat('PATH');
    return { type: 'path', path };
  }

  // Build Value AST node value : value
  buildValue(): ASTValueNode {
    const value = this.getCurrentToken().value;
    this.eat('VALUE');
    return { type: 'value', value };
  }

  /*
   * Parse tokens into an AST
   *
   * formula : EQUAL entity EOF
   * function : FUNCTION LPAREN (entity COMMA?)+ RPAREN
   * entity : (function|variable|path|value)
   * variable : VARIABLE
   * path : PATH
   * value : VALUE
   */
  parse(tokens: Token[]): ASTNode {
    /* Set global class states */
    this.tokens = tokens;
    this.index = 0;

    return this.buildFormula();
  }
}
