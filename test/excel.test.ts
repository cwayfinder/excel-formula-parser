/*
 * Tests for excel.ts
 */

import { Excel } from '../src/excel';
import { removeExtraSpaces } from './test-utils';
import {
    ruleExtraTree, ruleExtraString,
    rule0Tree, rule0String,
    rule1Tree, rule1String,
    rule2Tree, rule2String,
    rule2aTree, rule2aString,
    rule3Tree, rule3String,
    rule4Tree, rule4String,
    rule5Tree, rule5String,
    ruleObjectTree, ruleObjectString,
    ruleObject2Tree, ruleObject2String,
    ruleTmplTree, ruleTmplString, escapedRuleTmplString,
    rule6String, rule6Html,
    rule7String, rule7Html,
    rule8String, rule8Html,
    ruleEmptyFunctionTree, ruleEmptyFunctionString,
    ruleNestedFunctionsTree, ruleNestedFunctionsString,
    ruleInvertString, ruleInvertTree,
    ruleOperatorString, ruleOperatorTree,
    ruleInvertWithPlus, ruleInvertWithPlusTree,
} from './cases';

const excel : Excel = new Excel()

describe('Excel.parse() end usage tests', () => {

    test('Parse(string) should build a AST', () => {
        expect(excel.parse(ruleExtraString)).toEqual(ruleExtraTree);
        expect(excel.parse(rule0String)).toEqual(rule0Tree);
        expect(excel.parse(rule1String)).toEqual(rule1Tree);
        expect(excel.parse(rule2String)).toEqual(rule2Tree);
        expect(excel.parse(rule2aString)).toEqual(rule2aTree);
        expect(excel.parse(rule3String)).toEqual(rule3Tree);
        expect(excel.parse(rule4String)).toEqual(rule4Tree);
        expect(excel.parse(rule5String)).toEqual(rule5Tree);
        expect(excel.parse(ruleObjectString)).toEqual(ruleObjectTree);
        expect(excel.parse(ruleObject2String)).toEqual(ruleObject2Tree);
        expect(excel.parse(ruleTmplString)).toEqual(ruleTmplTree);
        expect(excel.parse(ruleInvertString)).toEqual(ruleInvertTree);
        expect(excel.parse(ruleOperatorString)).toEqual(ruleOperatorTree);
        expect(excel.parse(ruleInvertWithPlus)).toEqual(ruleInvertWithPlusTree);
    });
});

describe('Excel.stringify() end usage tests', () => {

    test('stringify(tree) should return the interpreted string', () => {
        expect(excel.stringify(ruleExtraTree)).toEqual(ruleExtraString);
        expect(excel.stringify(rule0Tree)).toEqual(rule0String);
        expect(excel.stringify(rule1Tree)).toEqual(rule1String);
        expect(excel.stringify(rule2Tree)).toEqual(rule2String);
        expect(excel.stringify(rule3Tree)).toEqual(rule3String);
        expect(excel.stringify(rule4Tree)).toEqual(rule4String);
        expect(excel.stringify(rule5Tree)).toEqual(rule5String);
        expect(excel.stringify(ruleEmptyFunctionTree)).toEqual(ruleEmptyFunctionString);
        expect(excel.stringify(ruleNestedFunctionsTree)).toEqual(ruleNestedFunctionsString);
        expect(excel.stringify(ruleObjectTree)).toEqual(ruleObjectString);
        expect(excel.stringify(ruleObject2Tree)).toEqual(ruleObject2String);
        expect(excel.stringify(ruleTmplTree)).toEqual(escapedRuleTmplString);
        expect(excel.stringify(ruleInvertTree)).toEqual(ruleInvertString);
        expect(excel.stringify(ruleOperatorTree)).toEqual(ruleOperatorString);
        expect(excel.stringify(ruleInvertWithPlusTree)).toEqual(ruleInvertWithPlus);
    });

});

describe('Excel.toHtml() end usage tests', () => {
    test('toHtml(tree) should return a builded html from Excel-like formula', () => {
        expect(excel.toHtml(rule6String)).toEqual(removeExtraSpaces(rule6Html));
    });

    test('Testing parsing variables', () => {
        expect(excel.toHtml('EQ(firstName, true)')).toContain(`<span class="variable">firstName</span>`);
    });

    test('Testing parsing booleans', () => {
        expect(excel.toHtml('EQ(firstName, true)')).toContain(`<span class="value">true</span>`);
        expect(excel.toHtml('EQ(firstName, false)')).toContain(`<span class="value">false</span>`);
        expect(excel.toHtml('EQ(firstName, falsee)')).toContain(`<span class="variable">falsee</span>`);
    });

    test('Testing parsing numbers', () => {
        expect(excel.toHtml('EQ(firstName, 1000)')).toContain(`<span class="value">1000</span>`);
        expect(excel.toHtml('EQ(firstName, 100.25)')).toContain(`<span class="value">100.25</span>`);
        expect(excel.toHtml('EQ(firstName , 2)')).toContain(`<span class="value">2</span>`);
        expect(excel.toHtml('EQ(firstName, 2)')).toEqual(removeExtraSpaces(`
            <div>
                <span class="function">EQ</span>
                <span class="paren-deep-1">(</span>
                <span class="variable">firstName</span>, 
                <span class="value">2</span>
                <span class="paren-deep-1">)</span>
            </div>
        `));
    });

    test('Testing parsing arrays', () => {
        const expectedNumberArray = removeExtraSpaces(`
            <span class="paren-deep-2">[</span>
                <span class="value">100.23</span>,
                <span class="value">232.46</span>,
                <span class="value">567.98</span>
            <span class="paren-deep-2">]</span>
        `);
        expect(excel.toHtml('EQ(person, [100.23, 232.46, 567.98])')).toContain(expectedNumberArray);

        const expectedStringArray = removeExtraSpaces(`
            <span class="paren-deep-2">[</span>
                <span class="value">'name'</span>,
                <span class="value">'lastname'</span>,
                <span class="value">'age'</span>
            <span class="paren-deep-2">]</span>
        `)
        expect(excel.toHtml(`EQ(person, ['name', 'lastname', 'age'])`)).toContain(expectedStringArray);

        const arrayWithNestedArrays = removeExtraSpaces(`
            <div>
                <span class="function">concat</span>
                <span class="paren-deep-1">(</span>
                    <span class="paren-deep-2">[</span>
                        <span class="function">prop</span>
                        <span class="paren-deep-3">(</span>
                        <span class="value">'index'</span>
                        <span class="paren-deep-3">)</span>,
                        <span class="value">'-'</span>,
                        <span class="function">prop</span>
                        <span class="paren-deep-3">(</span>
                        <span class="value">'value'</span>
                        <span class="paren-deep-3">)</span>
                    <span class="paren-deep-2">]</span>
                <span class="paren-deep-1">)</span>
            </div>
        `);
        expect(excel.toHtml(`concat([prop('index'), '-', prop('value')])`)).toEqual(arrayWithNestedArrays);

        const expectedArrayWithNestedFunctions = removeExtraSpaces(`
            <div>
                <span class="function">concat</span>
                <span class="paren-deep-1">(</span>
                    <span class="paren-deep-2">[</span>
                        <span class="function">prop</span>
                        <span class="paren-deep-3">(</span>
                        <span class="value">'index'</span>
                        <span class="paren-deep-3">)</span>,
                        <span class="value">'-'</span>,
                        <span class="function">prop</span>
                        <span class="paren-deep-3">(</span>
                        <span class="value">'value'</span>
                        <span class="paren-deep-3">)</span>
                    <span class="paren-deep-2">]</span>
                <span class="paren-deep-1">)</span>
            </div>
        `);
        expect(excel.toHtml(`concat([prop('index'), '-', prop('value')])`)).toEqual(expectedArrayWithNestedFunctions);
    });

    test('Testing invert operator', () => {
        expect(excel.toHtml(`!equal(value('#actorType'), 'PERSON')`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="paren-deep-1">!</span>
                    <span class="function">equal</span>
                    <span class="paren-deep-1">(</span>
                        <span class="function">value</span>
                        <span class="paren-deep-2">(</span>
                            <span class="value">'#actorType'</span>
                        <span class="paren-deep-2">)</span>,
                        <span class="value">'PERSON'</span>
                    <span class="paren-deep-1">)</span>
                </div>
            `));
        expect(excel.toHtml(`some([false, false, !value('#name')])`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="function">some</span>
                    <span class="paren-deep-1">(</span>
                        <span class="paren-deep-2">[</span>
                            <span class="value">false</span>,
                            <span class="value">false</span>,
                            <span class="paren-deep-3">!</span>
                            <span class="function">value</span>
                            <span class="paren-deep-3">(</span>
                                <span class="value">'#name'</span>
                            <span class="paren-deep-3">)</span>
                        <span class="paren-deep-2">]</span>
                    <span class="paren-deep-1">)</span>
                </div>
            `));
    });

    test('Testing Plus operator', () => {
        expect(excel.toHtml(`2 + 2`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">2</span>
                    <span class="paren-deep-1"> + </span>
                    <span class="value">2</span>
                </div>
            `));
        expect(excel.toHtml(`1 + 2 + 3 + 4 + 5`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">1</span>
                    <span class="paren-deep-1"> + </span>
                    <span class="value">2</span>
                    <span class="paren-deep-1"> + </span>
                    <span class="value">3</span>
                    <span class="paren-deep-1"> + </span>
                    <span class="value">4</span>
                    <span class="paren-deep-1"> + </span>
                    <span class="value">5</span>
                </div>
            `));
        expect(excel.toHtml(`'prefix' + value('#name')`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">'prefix'</span>
                    <span class="paren-deep-1"> + </span>
                    <span class="function">value</span>
                    <span class="paren-deep-2">(</span>
                        <span class="value">'#name'</span>
                    <span class="paren-deep-2">)</span>
                </div>
            `));
    });

    test('Testing Minus operator', () => {
        expect(excel.toHtml(`2 - 2`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">2</span>
                    <span class="paren-deep-1"> - </span>
                    <span class="value">2</span>
                </div>
            `));
        expect(excel.toHtml(`'prefix' - value('#name')`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">'prefix'</span>
                    <span class="paren-deep-1"> - </span>
                    <span class="function">value</span>
                    <span class="paren-deep-2">(</span>
                        <span class="value">'#name'</span>
                    <span class="paren-deep-2">)</span>
                </div>
            `));
    });

    test('Testing Multiply operator', () => {
        expect(excel.toHtml(`2 * 2`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">2</span>
                    <span class="paren-deep-1"> * </span>
                    <span class="value">2</span>
                </div>
            `));
        expect(excel.toHtml(`'prefix' * value('#name')`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">'prefix'</span>
                    <span class="paren-deep-1"> * </span>
                    <span class="function">value</span>
                    <span class="paren-deep-2">(</span>
                        <span class="value">'#name'</span>
                    <span class="paren-deep-2">)</span>
                </div>
            `));
    });

    test('Testing Divide operator', () => {
        expect(excel.toHtml(`2 / 2`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">2</span>
                    <span class="paren-deep-1"> / </span>
                    <span class="value">2</span>
                </div>
            `));
        expect(excel.toHtml(`'prefix' / value('#name')`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="value">'prefix'</span>
                    <span class="paren-deep-1"> / </span>
                    <span class="function">value</span>
                    <span class="paren-deep-2">(</span>
                        <span class="value">'#name'</span>
                    <span class="paren-deep-2">)</span>
                </div>
            `));
    });

    test('Testing combination of invert with operator', () => {
        expect(excel.toHtml(`!!!2 + 2`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="paren-deep-2">!</span>
                    <span class="paren-deep-2">!</span>
                    <span class="paren-deep-2">!</span>
                    <span class="value">2</span>
                    <span class="paren-deep-1"> + </span>
                    <span class="value">2</span>
                </div>
            `));
    })

    test('Testing parsing objects', () => {
        expect(excel.toHtml(`HTTP({method: 'GET', url: 'https://api.github.com/users/defunkt'})`))
            .toEqual(removeExtraSpaces(`
                <div>
                    <span class="function">HTTP</span>
                    <span class="paren-deep-1">(</span>
                        <span class="paren-deep-2">{</span>
                            <span class="variable">method</span>:
                            <span class="value">'GET'</span>,
                            <span class="variable">url</span>:
                            <span class="value">'https://api.github.com/users/defunkt'</span>
                        <span class="paren-deep-2">}</span>
                    <span class="paren-deep-1">)</span>
                </div>
            `));
    });

    test('Testing parsing functions without arguments', () => {
        const expectedStringArray = removeExtraSpaces(
            `<div>
                <span class="function">init</span>
                <span class="paren-deep-1">(</span>
                <span class="paren-deep-1">)</span>
            </div>`
        )
        expect(excel.toHtml(`init()`)).toEqual(expectedStringArray);
    });

    test('Testing parsing nested objects', () => {

        const htmlObject = removeExtraSpaces(`
            <div>
                <span class="function">HTTP</span>
                <span class="paren-deep-1">(</span>
                    <span class="paren-deep-2">{</span>
                        <span class="variable">method</span>:
                        <span class="value">'GET'</span>,
                        <span class="variable">url</span>:
                        <span class="value">'https://api.github.com/users/defunkt'</span>,
                        <span class="variable">headers</span>:
                        <span class="paren-deep-3">{</span>
                            <span class="variable">User-Agent</span>:
                            <span class="value">'request'</span>
                        <span class="paren-deep-3">}</span>
                    <span class="paren-deep-2">}</span>
                <span class="paren-deep-1">)</span>
            </div>
        `)

        expect(excel.toHtml(`HTTP({method: 'GET', url: 'https://api.github.com/users/defunkt', headers: { User-Agent: 'request' }})`)).toEqual(htmlObject);

        // expect(excel.toHtml(`HTTP({method: 'GET', url: 'https://api.github.com/users/defunkt', headers: { 'User-Agent': 'request' }})`))
        //   .toEqual(removeExtraSpaces(`
        //         <div>
        //             <span class="function">HTTP</span>
        //             <span class="paren-deep-1">(</span>
        //             {
        //                 method: <span class="value">'GET'</span>,
        //                 url: <span class="value">'https://api.github.com/users/defunkt'</span>,
        //                 headers: {
        //                     'User-Agent': <span class="value">'request'</span>
        //                 }
        //             }
        //             <span class="paren-deep-1">)</span>
        //         </div>
        //     `));
        //
        // expect(excel.toHtml(`HTTP({method: 'GET', url: 'https://api.github.com/users/defunkt', headers: { "User-Agent": 'request' }})`))
        //   .toEqual(removeExtraSpaces(`
        //         <div>
        //             <span class="function">HTTP</span>
        //             <span class="paren-deep-1">(</span>
        //             {
        //                 method: <span class="value">'GET'</span>,
        //                 url: <span class="value">'https://api.github.com/users/defunkt'</span>,
        //                 headers: {
        //                     "User-Agent": <span class="value">'request'</span>
        //                 }
        //             }
        //             <span class="paren-deep-1">)</span>
        //         </div>
        //     `));
    });

    test('Testing parsing objects with function as key property', () => {
        const htmlObject = removeExtraSpaces(`
            <div>
                <span class="function">func</span>
                <span class="paren-deep-1">(</span>
                    <span class="paren-deep-2">{</span>
                        <span class="function">val</span>
                        <span class="paren-deep-3">(</span>
                        <span class="value">'field'</span>
                        <span class="paren-deep-3">)</span>:
                        <span class="value">'Contact'</span>
                    <span class="paren-deep-2">}</span>
                <span class="paren-deep-1">)</span>
            </div>
        `)

        expect(excel.toHtml(`func({ val('field'): 'Contact' })`)).toEqual(htmlObject);
    });

    test('Testing quotes', () => {
        expect(excel.toHtml(`EQ(VALUE('#firstName'), 'John')`)).toContain(`<span class="value">'John'</span>`);
        expect(excel.toHtml(`EQ(VALUE("#firstName"), "John")`)).toContain(`<span class="value">'John'</span>`);
        expect(excel.toHtml(`EQ(VALUE("#firstName"), "John")`)).toEqual(removeExtraSpaces(`
            <div>
                <span class="function">EQ</span>
                <span class="paren-deep-1">(</span>
                <span class="function">VALUE</span>
                <span class="paren-deep-2">(</span>
                <span class="value">'#firstName'</span>
                <span class="paren-deep-2">)</span>,
                <span class="value">'John'</span>
                <span class="paren-deep-1">)</span>
            </div>
        `));
    })

    test('toHtml(tree) with invalid Excel-like formula should throw exception', () => {
        expect(() => { excel.toHtml(`NOT(EQ(investorType)), 'individual')`)}).toThrow();
        expect(() => { excel.toHtml(`NOT(EQ(investorType, 'individual'`)}).toThrow();
    });

    test('toHtml(tree, flexible=true) should parse incomplete formula and autocomplete quotes', () => {
        expect(excel.toHtml(rule7String, true)).toEqual(removeExtraSpaces(rule7Html));
        expect(excel.toHtml("EQ(legalForm, 'KG", true)).toContain(`<span class="value">'KG'</span>`);
        expect(excel.toHtml("EQ(", true)).toEqual(`<div><span class="function">EQ</span><span class="paren-deep-1">(</span></div>`);
    });

    test('toHtml(tree, flexible=true) should parse complete formula', () => {
        expect(excel.toHtml(`EQ(VALUE("#firstName"), "John")`, true)).toEqual(removeExtraSpaces(`
            <div>
                <span class="function">EQ</span>
                <span class="paren-deep-1">(</span>
                <span class="function">VALUE</span>
                <span class="paren-deep-2">(</span>
                <span class="value">'#firstName'</span>
                <span class="paren-deep-2">)</span>,
                <span class="value">'John'</span>
                <span class="paren-deep-1">)</span>
            </div>
        `));
    });

    test('Excel.toHtml() parent deeps should loop from 0 to max deep level', () => {
        expect(excel.toHtml(rule8String, true)).toEqual(removeExtraSpaces(rule8Html));
    });

    test('Excel.toHtml() should escape nested html', () => {
        expect(excel.toHtml(`TMPL('<i class="pi pi-plus"></i>')`, true)).toEqual(removeExtraSpaces(`
            <div>
                <span class="function">TMPL</span>
                <span class="paren-deep-1">(</span>
                <span class="value">'&lt;i class=&quot;pi pi-plus&quot;&gt;&lt;/i&gt;'</span>
                <span class="paren-deep-1">)</span>
            </div>
        `));
    });

});
