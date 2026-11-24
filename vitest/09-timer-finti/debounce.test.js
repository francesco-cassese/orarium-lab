import { test, expect, vi, afterEach } from 'vitest';
import { debounce } from './debounce.js';

afterEach(() => { vi.useRealTimers(); });

test('debounce chiama la funzione una sola volta, con l\'ultimo argomento', () => {
    vi.useFakeTimers();
    const f = vi.fn();
    const cerca = debounce(f, 300);
    cerca('f');
    vi.advanceTimersByTime(100);
    cerca('fa');
    vi.advanceTimersByTime(100);
    cerca('far');
    vi.advanceTimersByTime(299);
    expect(f).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(f).toHaveBeenCalledTimes(1);
    expect(f).toHaveBeenCalledWith('far');
});
