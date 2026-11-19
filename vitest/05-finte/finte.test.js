import { expect, test, vi } from 'vitest';
import { controllaScorta } from './scorta.js';

test('un mock registra le chiamate e restituisce undefined', () => {
    const finta = vi.fn();
    finta();
    expect(finta).toHaveBeenCalled();
    expect(finta).toHaveBeenCalledTimes(1);
    expect(finta()).toBeUndefined();
    expect(finta).toHaveBeenCalledTimes(2);
});

test('la scorta restituisce 10, tranne una volta 20', () => {
    const scorta = vi.fn().mockReturnValue(10);
    expect(scorta()).toBe(10);
    scorta.mockReturnValueOnce(20);
    expect(scorta()).toBe(20);
    expect(scorta()).toBe(10);
});

test('mock asincrono', async () => {
    const leggiIngrediente = vi.fn().mockResolvedValue({ nome: 'farina' });

    const ingrediente = await leggiIngrediente();

    expect(ingrediente.nome).toBe('farina');

    leggiIngrediente.mockRejectedValue(new Error('Ingrediente non trovato'));

    await expect(leggiIngrediente()).rejects.toThrow('Ingrediente non trovato');
});

test('il costo è chili per prezzo al chilo', () => {
    const costo = vi.fn().mockImplementation((chili, prezzo) => chili * prezzo);
    expect(costo(2, 3)).toBe(6);
    expect(costo(10, 3)).toBe(30);

    const costo2 = vi.fn((chili, prezzo) => chili * prezzo);
    expect(costo2(2, 3)).toBe(6);
});

test('scorta bassa: avvisa e restituisce false', () => {
    const avvisa = vi.fn();
    expect(controllaScorta('farina', 2, avvisa)).toBe(false);
    expect(avvisa).toHaveBeenCalledTimes(1);
    expect(avvisa).toHaveBeenCalledWith('farina: scorta bassa');
});

test('scorta sufficiente: non avvisa e restituisce true', () => {
    const avvisa = vi.fn();
    expect(controllaScorta('farina', 10, avvisa)).toBe(true);
    expect(avvisa).not.toHaveBeenCalled();
});

test('leggo più chiamate con mock.calls e results', () => {
    const avvisa = vi.fn();
    controllaScorta('farina', 2, avvisa);
    controllaScorta('burro', 1, avvisa);
    expect(avvisa).toHaveBeenCalledTimes(2);
    expect(avvisa).toHaveBeenNthCalledWith(1, 'farina: scorta bassa');
    expect(avvisa).toHaveBeenLastCalledWith('burro: scorta bassa');
    expect(avvisa.mock.calls).toEqual([['farina: scorta bassa'], ['burro: scorta bassa']]);
    expect(avvisa.mock.results).toEqual([
        { type: 'return', value: undefined },
        { type: 'return', value: undefined },
    ]);
});

test('il mock ricorda il riferimento, non una copia', () => {
    const registra = vi.fn();
    const ordine = { quantita: 1 };
    registra(ordine);
    expect(registra).toHaveBeenCalledWith({ quantita: 1 });
    ordine.quantita = 2;
    expect(registra.mock.calls[0][0]).toBe(ordine);
});

test('una copia fatta al momento della chiamata non cambia', () => {
    const copie = [];
    const registra = vi.fn((ordine) => {
        copie.push(structuredClone(ordine));
    });
    const ordine = { quantita: 1 };
    registra(ordine);
    ordine.quantita = 2;
    expect(copie[0]).toEqual({ quantita: 1 });
    expect(registra.mock.calls[0][0].quantita).toBe(2);
});

