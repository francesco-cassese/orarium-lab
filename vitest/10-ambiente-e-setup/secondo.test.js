import { test, expect } from 'vitest';
import { incrementa } from './contatore.js';

test('secondo file: incrementa restituisce un numero', () => {
  const valore = incrementa();
  console.log('secondo.test.js valore =', valore, 'pid =', process.pid);
  expect(typeof valore).toBe('number');
});
