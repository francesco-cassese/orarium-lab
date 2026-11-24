import { test, expect } from 'vitest';
import { incrementa } from './contatore.js';

test('primo file: incrementa restituisce un numero', () => {
  const valore = incrementa();
  console.log('primo.test.js valore =', valore, 'pid =', process.pid);
  expect(typeof valore).toBe('number');
});
