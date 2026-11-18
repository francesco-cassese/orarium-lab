import { expect, test } from 'vitest';
import dividi from './dividi';

class Utente {
    constructor(nome) {
        this.nome = nome;
    }
}

test('2 più 2 fa 4', () => {
    expect(2 + 2).toBe(4);
});

test('confronta due stringhe', () => {
    expect('ciao').toBe('ciao');
});

test('due oggetti con lo stesso contenuto sono uguali per toEqual', () => {
    const a = { nome: 'Alice' };
    const b = { nome: 'Alice' };
    expect(a).toEqual(b);
});

test('due oggetti con lo stesso contenuto non sono lo stesso oggetto', () => {
    const a = { nome: 'Alice' };
    const b = { nome: 'Alice' };
    expect(a).not.toBe(b);
});

test('una variabile che punta allo stesso oggetto passa con toBe', () => {
    const a = { nome: 'Alice' };
    const c = a;
    expect(c).toBe(a);
});

test('un campo undefined: toEqual lo ignora', () => {
    expect({ a: 1 }).toEqual({ a: 1, b: undefined });
});

test('un campo undefined: toStrictEqual non lo ignora', () => {
    expect({ a: 1 }).not.toStrictEqual({ a: 1, b: undefined });
});

test('un Utente è uguale per toEqual a un oggetto con gli stessi campi', () => {
    expect(new Utente('Alice')).toEqual({ nome: 'Alice' });
});

test('un Utente non è uguale per toStrictEqual a un oggetto con gli stessi campi', () => {
    expect(new Utente('Alice')).not.toStrictEqual({ nome: 'Alice' });
});

test('dividi per zero lancia un errore', () => {
    expect(() => dividi(1, 0)).toThrow();
});

test('dividi per zero lancia un errore con il messaggio che contiene «zero»', () => {
    expect(() => dividi(1, 0)).toThrow('zero');
});

test('dividi per zero lancia un errore con il messaggio che rispetta /zero/', () => {
    expect(() => dividi(1, 0)).toThrow(/zero/);
});

test('dividi 6 per 3 dà 2', () => {
    expect(dividi(6, 3)).toBe(2);
});

test('un array con un buco è uguale per toEqual a uno con undefined', () => {
    expect([, 1]).toEqual([undefined, 1]);
});

test('un array con un buco non è uguale per toStrictEqual a uno con undefined', () => {
    expect([, 1]).not.toStrictEqual([undefined, 1]);
});
