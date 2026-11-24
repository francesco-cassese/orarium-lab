import { test, expect } from 'vitest';

test('conteggioSetup esiste', () => {
  console.log('conteggioSetup =', globalThis.conteggioSetup);
  expect(globalThis.conteggioSetup).toBeDefined();
});
