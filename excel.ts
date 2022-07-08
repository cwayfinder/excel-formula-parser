import { ASTNode } from './src/node';
import { Interpreter } from './src/interpreter';
import { Lexer } from './src/lexer';
import { Parser } from './src/parser';

export class Excel {
  lexer: Lexer;
  parser: Parser;
  interpreter: Interpreter;

  constructor() {
    this.lexer = new Lexer();
    this.parser = new Parser();
    this.interpreter = new Interpreter();
  }

  parse(string: string): ASTNode {
    const tokenized = this.lexer.tokenize(string);
    return this.parser.parse(tokenized);
  }

  stringify(tree: ASTNode): string {
    return this.interpreter.interpret(tree);
  }
}
