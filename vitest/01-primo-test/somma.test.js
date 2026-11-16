import { expect, test } from 'vitest';
import somma from './somma.js';


test('controlla la somma di due numeri', function () {
    expect(somma(2, 3)).toBe(5);
});