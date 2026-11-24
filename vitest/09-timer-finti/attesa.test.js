import { test, expect, vi } from 'vitest';
import { chiamaDopo, ripeti, adesso } from './attesa.js';

test('un timer finto scatta quando passa il tempo', () => {
    vi.useFakeTimers();
    const f = vi.fn();
    chiamaDopo(f, 1000);
    vi.advanceTimersByTime(1000);
    expect(f).toHaveBeenCalledTimes(1);
});

test('il timer scatta esattamente a 1000 ms', () => {
    vi.useFakeTimers();
    const f = vi.fn();
    chiamaDopo(f, 1000);
    vi.advanceTimersByTime(999);
    expect(f).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(f).toHaveBeenCalledTimes(1);
});

test('un intervallo scatta a ogni scadenza', () => {
    vi.useFakeTimers();
    const f = vi.fn();
    ripeti(f, 50);
    vi.advanceTimersByTime(150);
    expect(f).toHaveBeenCalledTimes(3);
});

test('il contatore conta il timer in attesa', () => {
    vi.useFakeTimers();
    const id = ripeti(vi.fn(), 50);
    expect(vi.getTimerCount()).toBe(1);
    clearInterval(id);
    expect(vi.getTimerCount()).toBe(0);
});

test('runOnlyPendingTimers fa scattare il timer in coda una volta sola', () => {
    vi.useFakeTimers();
    const f = vi.fn();
    ripeti(f, 50);
    vi.runOnlyPendingTimers();
    expect(f).toHaveBeenCalledTimes(1);
});

test('runAllTimers fa finire un intervallo che si ferma da solo', () => {
    vi.useFakeTimers();
    let chiamate = 0;
    const id = ripeti(() => {
        chiamate++;
        if (chiamate === 3) {
            clearInterval(id);
        }
    }, 50);
    vi.runAllTimers();
    expect(chiamate).toBe(3);
});

test('setSystemTime decide che ora è', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1998, 11, 19));
    expect(adesso()).toBe(new Date(1998, 11, 19).valueOf());
});

test('la data finta avanza con i timer finti', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(1998, 11, 19));
    const prima = adesso();
    vi.advanceTimersByTime(1000);
    expect(adesso() - prima).toBe(1000);
});
