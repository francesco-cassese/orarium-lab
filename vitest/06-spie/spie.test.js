import { expect, test, vi, afterEach } from 'vitest';
import { costo } from './costo.js';
import { listino } from './listino.js';

afterEach(() => { vi.restoreAllMocks() });

test('una spia lascia funzionare il metodo e registra la chiamata', () => {
    const spia = vi.spyOn(listino, 'prezzoAlChilo');

    expect(costo('farina', 3)).toBe(6);
    expect(spia).toHaveBeenCalledWith('farina');
    expect(spia).toHaveBeenCalledTimes(1);
});

test('una spia può restituire un altro valore', () => {
    const spia = vi.spyOn(listino, 'prezzoAlChilo');

    spia.mockReturnValue(10);

    expect(costo('farina', 3)).toBe(30);
});

test('senza spia, costo usa il listino vero', () => {

    expect(costo('farina', 3)).toBe(6);
});

test('mockClear cancella lo storico e tiene il valore', () => {
    const finta = vi.fn().mockReturnValue(7);
    finta();
    finta.mockClear()

    expect(finta).toHaveBeenCalledTimes(0);
    expect(finta()).toBe(7);
});

test('mockReset cancella anche il valore', () => {
    const finta = vi.fn().mockReturnValue(7);
    finta();
    finta.mockReset();
    expect(finta).toHaveBeenCalledTimes(0);
    expect(finta()).toBeUndefined()
});

test('mockRestore rimette il metodo originale', () => {
    const spia = vi.spyOn(listino, 'prezzoAlChilo').mockReturnValue(10);
    spia.mockRestore();

    expect(listino.prezzoAlChilo('farina')).toBe(2);
});

test('mockReset su una spia', () => {
    const spia = vi.spyOn(listino, 'prezzoAlChilo').mockReturnValue(10);
    expect(listino.prezzoAlChilo('farina')).toBe(10);

    spia.mockReset();
    expect(listino.prezzoAlChilo('farina')).toBe(2);
});