interface ASTNodeBase {
  type: string;
}

export interface ASTFunctionNode extends ASTNodeBase {
  type: 'function';
  name: string;
  args: ASTNode[];
  closed: boolean;
}

export interface ASTArrayNode extends ASTNodeBase {
  type: 'array';
  items: ASTNode[];
  closed: boolean;
}

export interface ASTOperatorChainNode extends ASTNodeBase {
  type: 'plus' | 'minus' | 'multiply' | 'divide';
  items: ASTNode[];
  closed: boolean;
}

export interface ASTObjectNode extends ASTNodeBase {
  type: 'object';
  properties: { key: ASTNode; value: ASTNode }[];
  closed: boolean;
}

export interface ASTVariableNode extends ASTNodeBase {
  type: 'variable';
  name: string;
}

export interface ASTValueNode extends ASTNodeBase {
  type: 'value';
  value: unknown;
}

export interface ASTInvertNode extends ASTNodeBase {
  type: 'invert';
  item: ASTNode;
}

export type ASTNode = ASTFunctionNode | ASTVariableNode | ASTValueNode | ASTArrayNode | ASTObjectNode | ASTInvertNode | ASTOperatorChainNode;
