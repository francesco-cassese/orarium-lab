import { caricaDopo, leggiIngrediente, leggiIngredienteMancante } from "./ingredienti.js";
import { expect, test } from "vitest";

test('controlla che il nome sia farina', async () => {
    const ingrediente = await leggiIngrediente(1);
    expect(ingrediente.nome).toBe('farina');
});

test('con resolves, la promessa restituisce l’ingrediente con id 1 e nome farina', async () => {
    await expect(leggiIngrediente(1)).resolves.toEqual({ id: 1, nome: 'farina' });
});

test("manda l'errore per l'ingrediente mancante", async () => {
    await expect(leggiIngredienteMancante()).rejects.toThrow('Ingrediente non trovato');
});

test('caricaDopo passa «burro» alla callback dopo 100 millisecondi', async () => {
    const valore = await new Promise((resolve) => caricaDopo(resolve));
    expect(valore).toBe('burro');
});