import { ASTNode } from './src/node';
import { InterpreterToFormula, InterpreterToHtml } from './src/interpreter';
import { Lexer } from './src/lexer';
import { Parser } from './src/parser';

export class Excel {
  lexer: Lexer;
  parser: Parser;
  interpreterToFormula: InterpreterToFormula;
  interpreterToHtml: InterpreterToHtml;

  constructor() {
    this.lexer = new Lexer();
    this.parser = new Parser();
    this.interpreterToFormula = new InterpreterToFormula();
    this.interpreterToHtml = new InterpreterToHtml();
  }

  parse(string: string): ASTNode {
    const tokenized = this.lexer.tokenize(string);
    return this.parser.parse(tokenized);
  }

  stringify(tree: ASTNode): string {
    return this.interpreterToFormula.interpret(tree);
  }

  toHtml(string: string): string {
    const tokenized = this.lexer.tokenize(string);
    const ASTNode = this.parser.parse(tokenized);
    return this.interpreterToHtml.interpret(ASTNode)
  }
}
