import { test, expect, vi, afterEach } from 'vitest';
import { leggiIndirizzo } from './indirizzo.js';

afterEach(() => {
    vi.unstubAllEnvs();
});

test('stubEnv cambia import.meta.env', () => {
    vi.stubEnv('VITE_INDIRIZZO_API', 'http://localhost:8000');
    expect(leggiIndirizzo()).toBe('http://localhost:8000');
});