// There are 4 types of entities:
// - function - IF, NOT, EQ, etc.
// - variable
// - value - true, false, 5, 'John Brown', [1,2,3] - basically anything that is not function or variable

import { ASTNode } from '../src/node';

export const ruleExtraString = 'investorType';
export const ruleExtraTree: ASTNode = { type: 'variable', name: 'investorType' };

export const rule0String = `IF(true, 'Hello!', 'Goodbye!')`;
export const rule0Tree: ASTNode = {
  type: 'function',
  name: 'IF',
  args: [
    { type: 'value', value: true },
    { type: 'value', value: "Hello!" },
    { type: 'value', value: "Goodbye!" },
  ],
  closed: true,
};


export const rule1String = `NOT(EQ(investorType, 'individual'))`;
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
      closed: true,
    },
  ],
  closed: true,
};


export const rule2String = 'EQ(firstName, true)';
export const rule2Tree: ASTNode = {
  type: 'function',
  name: 'EQ',
  args: [
    { type: 'variable', name: 'firstName' },
    { type: 'value', value: true },
  ],
  closed: true,
};


export const rule2aString = 'EQ($person.firstName, true)';
export const rule2aTree: ASTNode = {
  type: 'function',
  name: 'EQ',
  args: [
    { type: 'variable', name: '$person.firstName' },
    { type: 'value', value: true },
  ],
  closed: true,
};


export const rule3String = `OR(EQ(firstName, true), NOT(EQ(companyType, 'nffe')))`;
export const rule3Tree: ASTNode = {
  type: 'function',
  name: 'OR',
  args: [
    {
      type: 'function',
      name: 'EQ',
      args: [
        { type: 'variable', name: 'firstName' },
        { type: 'value', value: true },
      ],
      closed: true,
    },
    {
      type: 'function',
      name: 'NOT',
      args: [
        {
          type: 'function',
          name: 'EQ',
          args: [
            { type: 'variable', name: 'companyType' },
            { type: 'value', value: "nffe" },
          ],
          closed: true,
        },
      ],
      closed: true,
    },
  ],
  closed: true,
};


export const rule4String = `OR(EQ(usPerson, true), NOT(EQ(companyType, 'nffe')), NOT(EQ(nffeType, 'active')))`;
export const rule4Tree: ASTNode = {
  type: 'function',
  name: 'OR',
  args: [
    {
      type: 'function',
      name: 'EQ',
      args: [
        { type: 'variable', name: 'usPerson' },
        { type: 'value', value: true },
      ],
      closed: true,
    },
    {
      type: 'function',
      name: 'NOT',
      args: [
        {
          type: 'function',
          name: 'EQ',
          args: [
            { type: 'variable', name: 'companyType' },
            { type: 'value', value: "nffe" },
          ],
          closed: true,
        },
      ],
      closed: true,
    },
    {
      type: 'function',
      name: 'NOT',
      args: [
        {
          type: 'function',
          name: 'EQ',
          args: [
            { type: 'variable', name: 'nffeType' },
            { type: 'value', value: "active" },
          ],
          closed: true,
        },
      ],
      closed: true,
    },
  ],
  closed: true,
};


export const rule5String = `OR(EQ(usPerson, true), NOT(IN(['investment_company', 'custodial_institution', 'depositary_institution', 'specified_insurance_company'], companyType)))`;
export const rule5Tree: ASTNode = {
  type: 'function',
  name: 'OR',
  args: [
    {
      type: 'function',
      name: 'EQ',
      args: [
        { type: 'variable', name: 'usPerson' },
        { type: 'value', value: true },
      ],
      closed: true,
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
              type: 'array',
              items: [
                {
                  type: 'value',
                  value: 'investment_company',
                },
                {
                  type: 'value',
                  value: 'custodial_institution',
                },
                {
                  type: 'value',
                  value: 'depositary_institution',
                },
                {
                  type: 'value',
                  value: 'specified_insurance_company',
                },
              ],
              closed: true,
            },
            {
              type: 'variable',
              name: 'companyType'
            },
          ],
          closed: true,
        },
      ],
      closed: true,
    },
  ],
  closed: true,
};


export const ruleObjectString = `HTTP({method: 'GET', url: 'https://api.github.com/users/defunkt'})`;
export const ruleObjectTree: ASTNode = {
  type: 'function',
  name: 'HTTP',
  args: [
    {
      type: 'object',
      properties: [
        {
          key: {
            type: 'variable',
            name: 'method',
          },
          value: {
            type: 'value',
            value: 'GET',
          }
        },
        {
          key: {
            type: 'variable',
            name: 'url',
          },
          value: {
            type: 'value',
            value: 'https://api.github.com/users/defunkt',
          }
        },
      ],
      closed: true,
    },
  ],
  closed: true,
};


export const ruleObject2String = `HTTP({method: 'GET', url: 'https://api.github.com/users/defunkt', headers: { 'User-Agent': 'request' }})`;
export const ruleObject2Tree: ASTNode = {
  type: 'function',
  name: 'HTTP',
  args: [
    {
      type: 'object',
      properties: [
        {
          key: {
            type: 'variable',
            name: 'method',
          },
          value: {
            type: 'value',
            value: 'GET',
          }
        },
        {
          key: {
            type: 'variable',
            name: 'url',
          },
          value: {
            type: 'value',
            value: 'https://api.github.com/users/defunkt',
          }
        },
        {
          key: {
            type: 'variable',
            name: 'headers',
          },
          value: {
            type: 'object',
            properties: [
              {
                key: {
                  type: 'value',
                  value: 'User-Agent',
                },
                value: {
                  type: 'value',
                  value: 'request',
                },
              },
            ],
            closed: true,
          },
        },
      ],
      closed: true,
    }
  ],
  closed: true,
};


export const ruleTmplString = `TMPL('<i class="{{:icon}}"></i>')`;
export const ruleTmplTree: ASTNode = {
  type: 'function',
  name: 'TMPL',
  args: [
    {
      type: 'value',
      value: '<i class="{{:icon}}"></i>',
    },
  ],
  closed: true,
};


export const rule6String = `NOT(EQ(legalForm, 'KG'))`;
export const rule6Html = (`
    <div>
      <span class="function">NOT</span>
      <span class="paren-deep-1">(</span>
      <span class="function">EQ</span>
      <span class="paren-deep-2">(</span>
      <span class="variable">legalForm</span>, 
      <span class="value">'KG'</span>
      <span class="paren-deep-2">)</span>
      <span class="paren-deep-1">)</span>
    </div>
`);

export const rule7String = `NOT(EQ(lega`;
export const rule7Html = (`
    <div>
        <span class="function">NOT</span>
        <span class="paren-deep-1">(</span>
        <span class="function">EQ</span>
        <span class="paren-deep-2">(</span>
        <span class="variable">lega</span>
    </div>
`);

export const rule8String = `NOT(NOT(NOT(NOT(NOT(NOT(true))))))`;

export const rule8Html = (`
    <div>
      <span class="function">NOT</span>
      <span class="paren-deep-1">(</span>
      <span class="function">NOT</span>
      <span class="paren-deep-2">(</span>
      <span class="function">NOT</span>
      <span class="paren-deep-3">(</span>
      <span class="function">NOT</span>
      <span class="paren-deep-1">(</span>
      <span class="function">NOT</span>
      <span class="paren-deep-2">(</span>
      <span class="function">NOT</span>
      <span class="paren-deep-3">(</span>
      <span class="value">true</span>
      <span class="paren-deep-3">)</span>
      <span class="paren-deep-2">)</span>
      <span class="paren-deep-1">)</span>
      <span class="paren-deep-3">)</span>
      <span class="paren-deep-2">)</span>
      <span class="paren-deep-1">)</span>
    </div>
`);

export const ruleEmptyFunctionString = `init()`;
export const ruleEmptyFunctionTree: ASTNode = {
  type: 'function',
  name: 'init',
  args: [],
  closed: true,
};

export const ruleNestedFunctionsString = `concat([prop('index'), '-', prop('value')])`;
export const ruleNestedFunctionsTree: ASTNode = {
  type: 'function',
  name: 'concat',
  args: [
    {
      type: 'array',
      items: [
        {
          type: 'function',
          name: 'prop',
          args: [
            {
              type: 'value',
              value: 'index'
            }
          ],
          closed: true,
        },
        {
          type: 'value',
          value: '-'
        },
        {
          type: 'function',
          name: 'prop',
          args: [
            {
              type: 'value',
              value: 'value'
            }
          ],
          closed: true,
        },
      ],
      closed: true,
    }
  ],
  closed: true,
};
