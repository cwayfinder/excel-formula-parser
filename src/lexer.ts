import { Token } from './token';

/*
 * Lexer is responsible for breaking a sentence apart into tokens
 */
export class Lexer {
  text = '';
  index = 0;
  flexible = false;

  // Advance index n STEP
  advance(step: number = 1): void {
    this.index += step;
  }

  // Return current line from index
  getCurrentLine(): string {
    return (this.index < this.text.length) ? this.text.substring(this.index) : '';
  }

  getNextToken(): Token {
    // For single-character token types we avoid using regex to get a better perfomance

    // Tokenize EOF token type
    if (this.getCurrentLine() === '') {
      this.advance();
      return new Token('EOF', 'EOF', this.index, this.text);
    }

    // Skip whitespaces
    while (this.getCurrentLine().startsWith(' ')) {
      this.advance();
    }

    // Tokenize LPAREN token type
    if (this.getCurrentLine().startsWith('(')) {
      this.advance();
      return new Token('LPAREN', '(', this.index, this.text);
    }

    // Tokenize RPAREN token type
    if (this.getCurrentLine().startsWith(')')) {
      this.advance();
      return new Token('RPAREN', ')', this.index, this.text);
    }

    // Tokenize COMMA token type
    if (this.getCurrentLine().startsWith(',')) {
      this.advance();
      return new Token('COMMA', ',', this.index, this.text);
    }

    // Tokenize ARRAY_START token type
    if (this.getCurrentLine().startsWith("[")) {
      this.advance();
      return new Token('LBRACKET', '[', this.index, this.text);
    }

    // Tokenize ARRAY_END token type
    if (this.getCurrentLine().startsWith("]")) {
      this.advance();
      return new Token('RBRACKET', ']', this.index, this.text);
    }

    // Tokenize LBRACE token type
    if (this.getCurrentLine().startsWith("{")) {
      this.advance();
      return new Token('LBRACE', '{', this.index, this.text);
    }

    // Tokenize RBRACE token type
    if (this.getCurrentLine().startsWith("}")) {
      this.advance();
      return new Token('RBRACE', '}', this.index, this.text);
    }

    // Tokenize COLON token type
    if (this.getCurrentLine().startsWith(":")) {
      this.advance();
      return new Token('COLON', ':', this.index, this.text);
    }

    // Tokenize bool as VALUE token types
    const boolean = this.getCurrentLine().match(/^(true|TRUE|false|FALSE)(?=[^\w])/);
    if (boolean) {
      this.advance(boolean[0].length);
      return new Token('VALUE', boolean[0], this.index, this.text);
    }

    // Tokenize FUNCVAR token type
    const funcVar = this.getCurrentLine().match(/^[a-zA-Z$#%][\w\-\_.]+/);
    if (funcVar) {
      this.advance(funcVar[0].length);
      return new Token('FUNCVAR', funcVar[0], this.index, this.text);
    }

    // Tokenize VALUE token type
    let childValuePatterns: RegExp[] = [
     /^'[^']+'/, // quoted values
     /^"[^"]+"/, // double quoted values
    ]
    if (this.flexible) {
      childValuePatterns = childValuePatterns.map((pattern) => {
        return new RegExp(pattern.source + '?');
      });
    }
    childValuePatterns = [
      ...childValuePatterns,
      /^\d+\.?\d*/, // numbers
    ]
    // Finally test all possible patterns for VALUE token type
    for (const pattern of childValuePatterns) {
      const value = this.getCurrentLine().match(pattern);
      if (value) {
        this.advance(value[0].length);
        return new Token('VALUE', value[0], this.index, this.text);
      }
    }

    throw new SyntaxError(
      `invalid syntax\n` +
      `formula: ${this.text}\n` +
      `        ${' '.repeat(this.index)}^`
    );
  }

  tokenize(text: string, flexible: boolean = false): Array<Token> {
    this.text = text;
    this.index = 0;
    this.flexible = flexible;

    const result: Array<Token> = [];
    while (this.index < this.text.length + 1) {
      result.push(this.getNextToken());
    }

    return result;
  }
}
