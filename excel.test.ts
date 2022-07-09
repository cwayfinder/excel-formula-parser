/*
 * Tests for excel.ts
 */

import { Excel } from './excel';
import {
    ruleExtraTree, ruleExtraString,
    rule0Tree, rule0String,
    rule1Tree, rule1String,
    rule2Tree, rule2String,
    rule3Tree, rule3String,
    rule4Tree, rule4String,
    rule5Tree, rule5String,
    rule6String, rule6Html,
    rule7String, rule7Html
} from './cases'

const excel : Excel = new Excel()

describe('Excel.parse() end usage tests', () => {

    test('Parse(string) should build a AST', () => {
        expect(excel.parse(ruleExtraString)).toEqual(ruleExtraTree);
        expect(excel.parse(rule0String)).toEqual(rule0Tree);
        expect(excel.parse(rule1String)).toEqual(rule1Tree);
        expect(excel.parse(rule2String)).toEqual(rule2Tree);
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
        expect(excel.toHtml(rule6String)).toEqual(rule6Html);
    });

    test('toHtml(tree) with invalid Excel-like formula should throw exception', () => {
        expect(() => { excel.toHtml(`=NOT(EQ(investorType)), 'individual')`)}).toThrow();
        expect(() => { excel.toHtml(`=NOT(EQ(investorType, 'individual'`)}).toThrow();
    });

    test('toHtml(tree, flexible=true) should parse incomplete formula without problem', () => {
        expect(excel.toHtml(rule7String, true)).toEqual(rule7Html);
    });

});
