import { test, expect, beforeEach, describe } from 'vitest';

let ingredienti = ['farina', 'burro', 'uova']

beforeEach(() => { ingredienti = ['farina', 'burro', 'uova']; });

describe('ingredienti', () => {
    test("verifica che la lunghezza dell'array sia 2", () => {
        ingredienti.pop();
        expect(ingredienti).toHaveLength(2);
    });

    test("verifica che la lunghezza dell'array sia 3", () => {
        expect(ingredienti).toHaveLength(3);
    });
});

