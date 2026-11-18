import { test, expect, beforeAll, afterAll, beforeEach, afterEach, describe } from 'vitest';

beforeAll(() => { console.log('beforeAll fuori'); });
afterAll(() => { console.log('afterAll fuori'); });
beforeEach(() => { console.log('beforeEach fuori'); });
afterEach(() => { console.log('afterEach fuori'); });

describe('gruppo', () => {
    beforeEach(() => { console.log('beforeEach dentro'); });
    afterEach(() => { console.log('afterEach dentro'); });

    test('primo test', () => {
        console.log('test 1');
        expect(1 + 1).toBe(2);
    });

    test('secondo test', () => {
        console.log('test 2');
        expect(2 + 2).toBe(4);
    });
});
