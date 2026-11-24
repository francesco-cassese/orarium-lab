import { test, expect, vi } from 'vitest';
import { costoOrdine, costoScontato } from './ordine.js';

const mocks = vi.hoisted(() => ({
    prezzoAlChilo: vi.fn(),
}));

vi.mock('./prezzi.js', async () => {
    const originale = await vi.importActual('./prezzi.js');
    return {
        ...originale,
        prezzoAlChilo: mocks.prezzoAlChilo,
    };
});

test('un valore condiviso con vi.hoisted', () => {
    mocks.prezzoAlChilo.mockReturnValue(10);
    expect(costoOrdine('farina', 3)).toBe(30);
});

test('un mock parziale: solo il prezzo è finto', () => {
    mocks.prezzoAlChilo.mockReturnValue(10);
    expect(costoScontato('farina', 3, 50)).toBe(15);
});