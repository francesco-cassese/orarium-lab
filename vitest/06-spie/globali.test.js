import { expect, test, vi, afterEach } from 'vitest';
import { leggiIngrediente } from './rete';

afterEach(() => { vi.unstubAllGlobals() });

test('con fetch finto, leggiIngrediente restituisce un ingrediente', async () => {
    const fetchFinto = vi.fn().mockResolvedValue({ json: async () => ({ id: 1, nome: 'farina' }) });
    vi.stubGlobal('fetch', fetchFinto);

    const ingrediente = await leggiIngrediente(1);

    expect(ingrediente).toEqual({ id: 1, nome: 'farina' });
    expect(fetchFinto).toHaveBeenCalledWith('/api/ingredients/1');
});

test('dopo il primo test, fetch è ancora quella finta?', () => {
    expect(fetch.mock).toBeUndefined();
});