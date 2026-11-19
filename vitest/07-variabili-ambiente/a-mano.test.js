import { test, expect, vi } from 'vitest';

test('un valore assegnato a mano resta dopo unstubAllEnvs', () => {
    process.env.REPARTO = 'pasticceria';
    vi.unstubAllEnvs();
    expect(process.env.REPARTO).toBe('pasticceria');
});