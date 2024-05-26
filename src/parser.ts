import { Token, TokenType } from './token';
import {
  ASTArrayNode,
  ASTFunctionNode,
  ASTOperatorNode,
  ASTNode,
  ASTObjectNode,
  ASTValueNode,
  ASTInvertNode,
  ASTVariableNode,
  ASTGroupNode,
  ASTTernaryNode,
} from './node';

export class Parser {
  tokens: Token[] = [];
  index = 0;
  flexible = false;

  parse(tokens: Token[], flexible = false): ASTNode {
    /* Set global class states */
    this.tokens = tokens;
    this.index = 0;
    this.flexible = flexible;

    return this.buildFormula();
  }

  private getCurrentToken(): Token {
    return this.tokens[this.index];
  }

  // Return next token
  private peekToken(offset: number = 1): Token | undefined {
    const advancedIndex: number = this.index + offset;
    return (advancedIndex < this.tokens.length) ? this.tokens[advancedIndex] : undefined;
  }

  private expectedButFoundMessage(expected: TokenType): string {
    throw new SyntaxError((
      `Expected a "${expected}" token but found: "${this.getCurrentToken().value}"\n` +
      `formula ${this.getCurrentToken().line}\n` +
      `       ${' '.repeat(this.getCurrentToken().column)}^`
    ));
  }

  private unexpectedTokenMessage(): string {
    throw new SyntaxError((
      `Unexpected "${this.getCurrentToken().value}"\n` +
      `formula ${this.getCurrentToken().line}\n` +
      `       ${' '.repeat(this.getCurrentToken().column)}^`
    ));
  }

  // Compare current token type with a TYPE, if matchs, advance to next token, otherwise raise exception
  private eat(type: TokenType): void {
    if (this.getCurrentToken().type === type) {
      this.index += 1;
    } else {
      throw new SyntaxError(this.expectedButFoundMessage(type));
    }
  }

  // Same as eat() but optionally flexible with token TYPE
  // also returns bool if current token was eaten or not
  private flexibleEat(type: TokenType): boolean {
    let wasEaten: boolean;

    if (this.flexible) {
      try {
        this.eat(type);
        wasEaten = true;
      } catch {
        wasEaten = false;
      }
    } else {
      this.eat(type);
      wasEaten = true;
    }

    return wasEaten;
  }

  // Build Formula AST node formula : EQUAL entity EOF
  private buildFormula(): ASTNode {
    const entity = this.buildExpressionIfNext();
    this.eat('EOF');
    return entity;
  }

  // Build ASTFunctionNode AST node function : FUNCTION LPAREN (entity COMMA?)+ RPAREN
  private buildFunction(): ASTFunctionNode {
    const functionName: string = this.getCurrentToken().value;

    this.eat('FUNCVAR');
    this.eat('LPAREN');

    const args: ASTNode[] = [];
    do {
      if (this.getCurrentToken().type === 'COMMA') {
        this.eat('COMMA');
      }
      if (this.flexible && this.getCurrentToken().type === 'EOF') {
        break;
      }
      if (this.getCurrentToken().type === 'RPAREN') {
        break;
      }
      args.push(this.buildExpressionIfNext());
    } while (this.getCurrentToken().type === 'COMMA');

    const closed: boolean = this.flexibleEat('RPAREN');

    return { type: 'function', name: functionName, args, closed };
  }

  private buildExpressionIfNext(): ASTNode {
    let result: ASTNode = this.buildTermIfNext();
    while (['PLUS', 'MINUS'].includes(this.getCurrentToken().type)) {
      switch (this.getCurrentToken().type) {
        case 'PLUS':
          result = this.buildPlusOperator(result);
          break;
        case 'MINUS':
          result = this.buildMinusOperator(result);
          break;
        default:
          break;
      }
    }
    if (result == null) {
      throw new SyntaxError(this.unexpectedTokenMessage());
    }
    return result;
  }

  private buildTermIfNext(): ASTNode {
    let result: ASTNode = this.buildTernaryOperatorIfNext();
    while (['MULTIPLY', 'DIVIDE'].includes(this.getCurrentToken().type)) {
      switch (this.getCurrentToken().type) {
        case 'MULTIPLY':
          result = this.buildMultiplyOperator(result);
          break;
        case 'DIVIDE':
          result = this.buildDivideOperator(result);
          break;
        default:
          break;
      }
    }
    if (result == null) {
      throw new SyntaxError(this.unexpectedTokenMessage());
    }
    return result;
  }

  private buildEntity(): ASTNode {
    switch (this.getCurrentToken().type) {
      case 'FUNCVAR':
        return (this.peekToken()?.type == 'LPAREN') ? this.buildFunction() : this.buildVariable();
      case 'LPAREN':
        return this.buildGroup();
      case 'VALUE':
        return this.buildValue();
      case 'LBRACKET':
        return this.buildArray();
      case 'LBRACE':
        return this.buildObject();
      case 'INVERT':
        return this.buildInvertOperator();
      default:
        throw new SyntaxError(this.unexpectedTokenMessage());
    }
  }

  private buildTernaryOperatorIfNext(): ASTTernaryNode | ASTNode {
    // Build next entity, if ternary true present, take it as condition
    // otherwise return entity as is
    const condition: ASTNode = this.buildEntity();
    if (this.getCurrentToken().type !== 'QMARK') {
      return condition;
    }
    // Build ternary operator
    let result: ASTTernaryNode = { type: 'ternary', condition: condition, ifTrue: null, ifFalse: null, closed: false };
    // Build true child
    this.eat('QMARK');
    if (this.getCurrentToken().type === 'EOF') {
      return result;
    }
    result.ifTrue = this.buildExpressionIfNext();
    // Build false child
    if (this.getCurrentToken().type === 'EOF') {
      return result;
    }
    this.eat('COLON');
    if (this.getCurrentToken().type === 'EOF') {
      return result;
    }
    result.ifFalse = this.buildExpressionIfNext();
    result.closed = true;
    return result;
  }

  private buildGroup(): ASTGroupNode {
    this.eat('LPAREN');
    const entity: ASTNode = this.buildExpressionIfNext();
    const closed: boolean = this.flexibleEat('RPAREN');
    return { type: 'group', item: entity, closed: closed };
  }

  private buildInvertOperator(): ASTInvertNode {
    this.eat('INVERT');
    const item: ASTNode = this.buildEntity();
    return { type: 'invert', item };
  }

  private buildPlusOperator(left: ASTNode): ASTOperatorNode {
    return this.buildExprOperator(left, 'PLUS');
  }

  private buildMinusOperator(left: ASTNode): ASTOperatorNode {
    return this.buildExprOperator(left, 'MINUS');
  }

  private buildExprOperator(
    left: ASTNode,
    operator: 'PLUS' | 'MINUS'
  ): ASTOperatorNode {
    this.eat(operator);

    const closed: boolean = this.getCurrentToken().type !== 'EOF';
    const right: ASTNode | null = (closed) ? this.buildTermIfNext() : null;

    const ast_type = operator.toLowerCase() as 'plus' | 'minus';

    return { type: ast_type, left: left, right: right, closed: closed };
  }

  private buildMultiplyOperator(left: ASTNode): ASTOperatorNode {
    return this.buildTermOperator(left, 'MULTIPLY');
  }

  private buildDivideOperator(left: ASTNode): ASTOperatorNode {
    return this.buildTermOperator(left, 'DIVIDE');
  }

  private buildTermOperator(
    left: ASTNode,
    operator: 'DIVIDE' | 'MULTIPLY'
  ): ASTOperatorNode {
    this.eat(operator);

    const closed: boolean = this.getCurrentToken().type !== 'EOF';
    const right: ASTNode | null = (closed) ? this.buildTernaryOperatorIfNext() : null;

    const ast_type = operator.toLowerCase() as 'divide' | 'multiply';

    return { type: ast_type, left: left, right: right, closed: closed };
  }

  private buildVariable(): ASTVariableNode {
    const variable = this.getCurrentToken().value;
    this.eat('FUNCVAR');
    return { type: 'variable', name: variable };
  }

  private buildValue(): ASTValueNode {
    const value = this.getCurrentToken().value;
    this.eat('VALUE');
    return { type: 'value', value };
  }

  private buildArray(): ASTArrayNode {
    this.eat('LBRACKET');

    const items: ASTNode[] = [];
    do {
      if (this.getCurrentToken().type === 'COMMA') {
        this.eat('COMMA');
      }
      if (this.flexible && this.getCurrentToken().type === 'EOF') {
        break;
      }
      if (this.getCurrentToken().type === 'RBRACKET') {
        break;
      }
      items.push(this.buildTernaryOperatorIfNext());
    } while (this.getCurrentToken().type === 'COMMA');

    const closed: boolean = this.flexibleEat('RBRACKET');

    return { type: 'array', items: items, closed: closed };
  }

  protected buildObject(): ASTObjectNode {
    this.eat('LBRACE');

    const properties: { key: ASTNode; value: ASTNode }[] = [];
    do {
      if (this.getCurrentToken().type === 'COMMA') {
        this.eat('COMMA');
      }
      if (this.flexible && this.getCurrentToken().type === 'EOF') {
        break;
      }
      if (this.getCurrentToken().type === 'RBRACKET') {
        break;
      }
      const key: ASTNode = this.buildEntity();
      this.eat('COLON');
      const value: ASTNode = this.buildTernaryOperatorIfNext();
      properties.push({ key: key, value: value});
    } while (this.getCurrentToken().type === 'COMMA');

    const closed: boolean = this.flexibleEat('RBRACE');

    return { type: 'object', properties: properties, closed: closed }
  }
}
