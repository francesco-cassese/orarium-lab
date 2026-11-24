import { test, expect } from 'vitest';

test('con jsdom window e document ci sono', () => {
  expect(typeof window).not.toBe('undefined');
  expect(typeof document).not.toBe('undefined');
});
