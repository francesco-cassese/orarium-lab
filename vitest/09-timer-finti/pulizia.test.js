import { test, expect, vi, afterEach } from 'vitest';

afterEach(() => { vi.useRealTimers(); });

test('il primo test accende i timer finti', () => {
    vi.useFakeTimers();
    expect(vi.isFakeTimers()).toBe(true);
});

test('il secondo test trova i timer veri', () => {
    expect(vi.isFakeTimers()).toBe(false);
});
