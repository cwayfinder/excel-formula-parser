// There are 4 types of entities:
// - function - IF, NOT, EQ, etc.
// - variable
// - path - absolute (starts with '/') or relative (starts with './')
// - value - true, false, 5, 'John Brown', [1,2,3] - basically anything that is not formula, variable or path

import { ASTNode } from './src/node';

export const ruleExtraString = '=investorType';
export const ruleExtraTree: ASTNode = { type: 'variable', name: 'investorType' };

export const rule0String = `=IF(true, 'Hello!', 'Goodbye!')`;
export const rule0Tree: ASTNode = {
  type: 'function',
  name: 'IF',
  args: [
    { type: 'value', value: true },
    { type: 'value', value: "Hello!" },
    { type: 'value', value: "Goodbye!" },
  ],
};


export const rule1String = `=NOT(EQ(investorType, 'individual'))`;
export const rule1Tree: ASTNode = {
  type: 'function',
  name: 'NOT',
  args: [
    {
      type: 'function',
      name: 'EQ',
      args: [
        { type: 'variable', name: 'investorType' },
        { type: 'value', value: "individual" },
      ],
    },
  ],
};


export const rule2String = '=EQ(/person/firstName, true)';
export const rule2Tree: ASTNode = {
  type: 'function',
  name: 'EQ',
  args: [
    { type: 'path', path: '/person/firstName' },
    { type: 'value', value: true },
  ],
};


export const rule3String = '=OR(EQ(./firstName, true), NOT(EQ(./companyType, \'nffe\')))';
export const rule3Tree: ASTNode = {
  type: 'function',
  name: 'OR',
  args: [
    {
      type: 'function',
      name: 'EQ',
      args: [
        { type: 'path', path: './firstName' },
        { type: 'value', value: true },
      ],
    },
    {
      type: 'function',
      name: 'NOT',
      args: [
        {
          type: 'function',
          name: 'EQ',
          args: [
            { type: 'path', path: './companyType' },
            { type: 'value', value: "nffe" },
          ],
        },
      ],
    },
  ],
};


export const rule4String = '=OR(EQ(./usPerson, true), NOT(EQ(./companyType, \'nffe\')), NOT(EQ(./nffeType, \'active\')))';
export const rule4Tree: ASTNode = {
  type: 'function',
  name: 'OR',
  args: [
    {
      type: 'function',
      name: 'EQ',
      args: [
        { type: 'path', path: './usPerson' },
        { type: 'value', value: true },
      ],
    },
    {
      type: 'function',
      name: 'NOT',
      args: [
        {
          type: 'function',
          name: 'EQ',
          args: [
            { type: 'path', path: './companyType' },
            { type: 'value', value: "nffe" },
          ],
        },
      ],
    },
    {
      type: 'function',
      name: 'NOT',
      args: [
        {
          type: 'function',
          name: 'EQ',
          args: [
            { type: 'path', path: './nffeType' },
            { type: 'value', value: "active" },
          ],
        },
      ],
    },
  ],
};


export const rule5String = '=OR(EQ(./usPerson, true), NOT(IN([\'investment_company\', \'custodial_institution\', \'depositary_institution\', \'specified_insurance_company\'], ./companyType)))';
export const rule5Tree: ASTNode = {
  type: 'function',
  name: 'OR',
  args: [
    {
      type: 'function',
      name: 'EQ',
      args: [
        { type: 'path', path: './usPerson' },
        { type: 'value', value: true },
      ],
    },
    {
      type: 'function',
      name: 'NOT',
      args: [
        {
          type: 'function',
          name: 'IN',
          args: [
            {
              type: 'value',
              value: ['investment_company', 'custodial_institution', 'depositary_institution', 'specified_insurance_company'],
            },
            { type: 'path', path: './companyType' },
          ],
        },
      ],
    },
  ],
};

export const rule6String = `=NOT(EQ(legalForm, 'KG'))`;
export const rule6Html = (
  `<div>=` +
  `<span class=\"function\">NOT</span>` +
  `<span class=\"paren-deep-1\">(</span>` +
  `<span class=\"function\">EQ</span>` +
  `<span class=\"paren-deep-2\">(</span>` +
  `<span class=\"variable\">legalForm</span>, <span class=\"value\">'KG'</span>` +
  `<span class=\"paren-deep-2\">)</span>` +
  `<span class=\"paren-deep-1\">)</span>` +
  `</div>`
);

export const rule7String = `=NOT(EQ(lega`;
export const rule7Html = (
  `<div>=` +
  `<span class=\"function\">NOT</span>` +
  `<span class=\"paren-deep-1\">(</span>` +
  `<span class=\"function\">EQ</span>` +
  `<span class=\"paren-deep-2\">(</span>` +
  `<span class=\"variable\">lega</span>` +
  `<span class=\"paren-deep-2\">)</span>` +
  `<span class=\"paren-deep-1\">)</span>` +
  `</div>`
);

export const rule8String = `=NOT(NOT(NOT(NOT(NOT(NOT(true))))))`;
export const rule8Html = (
  `<div>=` +
  `<span class=\"function\">NOT</span>` +
  `<span class=\"paren-deep-1\">(</span>` +
  `<span class=\"function\">NOT</span>` +
  `<span class=\"paren-deep-2\">(</span>` +
  `<span class=\"function\">NOT</span>` +
  `<span class=\"paren-deep-3\">(</span>` +
  `<span class=\"function\">NOT</span>` +
  `<span class=\"paren-deep-1\">(</span>` +
  `<span class=\"function\">NOT</span>` +
  `<span class=\"paren-deep-2\">(</span>` +
  `<span class=\"function\">NOT</span>` +
  `<span class=\"paren-deep-3\">(</span>` +
  `<span class=\"value\">true</span>` +
  `<span class=\"paren-deep-3\">)</span>` +
  `<span class=\"paren-deep-2\">)</span>` +
  `<span class=\"paren-deep-1\">)</span>` +
  `<span class=\"paren-deep-3\">)</span>` +
  `<span class=\"paren-deep-2\">)</span>` +
  `<span class=\"paren-deep-1\">)</span>` +
  `</div>`
);
