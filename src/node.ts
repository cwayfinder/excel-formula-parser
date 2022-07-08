interface ASTNodeBase {
  type: string;
}

export interface ASTFunctionNode extends ASTNodeBase {
  type: 'function';
  name: string;
  args: ASTNode[];
}

export interface ASTVariableNode extends ASTNodeBase {
  type: 'variable';
  name: string;
}

export interface ASTPathNode extends ASTNodeBase {
  type: 'path';
  path: string;
}

export interface ASTValueNode extends ASTNodeBase {
  type: 'value';
  value: any;
}

export type ASTNode = ASTFunctionNode | ASTVariableNode | ASTPathNode | ASTValueNode;
