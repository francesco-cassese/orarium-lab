import { test, expect, beforeEach, describe } from 'vitest';

let dolci = ['farina', 'burro'];

describe('dolci', () => {
    beforeEach(() => {
        dolci = ['farina', 'burro'];
        console.log('hook dolci');
    });

    test("l'array dolci ha due elementi", () => {
        expect(dolci).toHaveLength(2);
    });
});

let salati = ['sale', 'olio', 'pepe'];

describe('salati', () => {
    beforeEach(() => {
        salati = ['sale', 'olio', 'pepe'];
        console.log('hook salati');
    });

    test("l'array salati ha tre elementi", () => {
        expect(salati).toHaveLength(3);
    });
});