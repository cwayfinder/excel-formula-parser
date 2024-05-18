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

export interface ASTOperatorNode extends ASTNodeBase {
  type: 'plus' | 'minus' | 'multiply' | 'divide';
  left: ASTNode;
  right: ASTNode | null;
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

export interface ASTGroupNode extends ASTNodeBase {
  type: 'group';
  item: ASTNode;
  closed: boolean;
}

export type ASTNode =
  ASTFunctionNode | ASTVariableNode | ASTValueNode |
  ASTArrayNode | ASTObjectNode | ASTInvertNode |
  ASTOperatorNode | ASTGroupNode;
