import { test, expect, vi } from 'vitest';
import { leggiLingua } from './leggi.js';

test('stubEnv cambia il valore in process.env', () => {
    vi.stubEnv('LINGUA', 'it');
    expect(leggiLingua()).toBe('it');
    expect(process.env.LINGUA).toBe('it');
});

test('stubEnv con undefined toglie la variabile', () => {
    vi.stubEnv('LINGUA', undefined);
    expect(leggiLingua()).toBeUndefined();
    expect(process.env.LINGUA).toBeUndefined();
});

test('stubEnv con un booleano su PROD', () => {
    vi.stubEnv('PROD', true);
    expect(import.meta.env.PROD).toBe(true);
});

test('due stubEnv e un solo ripristino riportano il valore originale', () => {
    vi.stubEnv('TURNO', 'mattina');
    vi.stubEnv('TURNO', 'sera');
    expect(process.env.TURNO).toBe('sera');
    vi.unstubAllEnvs();
    expect(process.env.TURNO).toBeUndefined();
});