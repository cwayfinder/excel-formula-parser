/*
 * Tests for excel.ts
 */

import { Excel } from './excel';
import { html } from './test-utils';
import {
    ruleExtraTree, ruleExtraString,
    rule0Tree, rule0String,
    rule1Tree, rule1String,
    rule2Tree, rule2String,
    rule2aTree, rule2aString,
    rule3Tree, rule3String,
    rule4Tree, rule4String,
    rule5Tree, rule5String,
    rule6String, rule6Html,
    rule7String, rule7Html,
    rule8String, rule8Html,
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
    });

});

describe('Excel.toHtml() end usage tests', () => {
    test('toHtml(tree) should return a builded html from Excel-like formula', () => {
        expect(excel.toHtml(rule6String)).toEqual(html(rule6Html));
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
        expect(excel.toHtml('EQ(firstName, 2)')).toEqual(html(`
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
        const expectedNumberArray = (
            `[<span class="value">100.23</span>, <span class="value">232.46</span>, <span class="value">567.98</span>]`
        );
        expect(excel.toHtml('EQ(person, [100.23, 232.46, 567.98])')).toContain(expectedNumberArray);

        const expectedStringArray = (
            `[<span class="value">'name'</span>, <span class="value">'lastname'</span>, <span class="value">'age'</span>]`
        )
        expect(excel.toHtml(`EQ(person, ['name', 'lastname', 'age'])`)).toContain(expectedStringArray);
    });

    test('Testing quotes', () => {
        expect(excel.toHtml(`EQ(VALUE('#firstName'), 'John')`)).toContain(`<span class="value">'John'</span>`);
        expect(excel.toHtml(`EQ(VALUE("#firstName"), "John")`)).toContain(`<span class="value">'John'</span>`);
        expect(excel.toHtml(`EQ(VALUE("#firstName"), "John")`)).toEqual(html(`
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
        expect(excel.toHtml(rule7String, true)).toEqual(html(rule7Html));
        expect(excel.toHtml("EQ(legalForm, 'KG", true)).toContain(`<span class="value">'KG'</span>`);
        expect(excel.toHtml("EQ(", true)).toEqual(`<div><span class="function">EQ</span><span class="paren-deep-1">(</span></div>`);
    });

    test('toHtml(tree, flexible=true) should parse complete formula', () => {
        expect(excel.toHtml(`EQ(VALUE("#firstName"), "John")`, true)).toEqual(html(`
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
        expect(excel.toHtml(rule8String, true)).toEqual(html(rule8Html));
    });

});
