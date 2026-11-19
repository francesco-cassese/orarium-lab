import { test, expect, vi, afterEach } from 'vitest';

afterEach(() => {
    vi.unstubAllEnvs();
});

test('il primo test cambia CORSIA', () => {
    vi.stubEnv('CORSIA', 'A');
    expect(process.env.CORSIA).toBe('A');
});

test('il secondo test trova CORSIA come prima', () => {
    expect(process.env.CORSIA).toBeUndefined();
});