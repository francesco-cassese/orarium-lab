import { screen } from '@testing-library/dom';
import { expect, test } from 'vitest';

test('un nav senza etichetta ha il ruolo navigation', () => {
    document.body.innerHTML = '<nav><a href="/uno">Uno</a></nav>';

    expect(screen.getByRole('navigation')).toBeDefined();
});

test('due nav senza etichetta: getByRole lancia un errore', () => {
    document.body.innerHTML = `
    <nav><a href="/uno">Uno</a></nav>
    <nav><a href="/due">Due</a></nav>
  `;

    expect(() => screen.getByRole('navigation')).toThrow(/multiple elements/);
});

test('due nav con aria-label diverse: il nome li distingue', () => {
    document.body.innerHTML = `
    <nav aria-label="Sito"><a href="/uno">Uno</a></nav>
    <nav aria-label="Paginazione"><a href="/due">Due</a></nav>
  `;

    expect(screen.getByRole('navigation', { name: 'Sito' }).textContent).toBe('Uno');
    expect(screen.getByRole('navigation', { name: 'Paginazione' }).textContent).toBe('Due');
});

test('il nome di un nav è il testo di aria-label, senza il ruolo', () => {
    document.body.innerHTML =
        '<nav aria-label="Navigazione del sito"><a href="/uno">Uno</a></nav>';

    expect(() => screen.getByRole('navigation', { name: 'Sito' })).toThrow();
    expect(
        screen.getByRole('navigation', { name: 'Navigazione del sito' }),
    ).toBeDefined();
});

test('il paginatore dentro un nav si trova per nome', () => {
    document.body.innerHTML = `
    <nav aria-label="Paginazione">
      <p>Pagina 1 di 5</p>
      <button type="button">Indietro</button>
      <button type="button">Avanti</button>
    </nav>
  `;

    expect(screen.getByRole('navigation', { name: 'Paginazione' })).toBeDefined();
    expect(screen.getAllByRole('button')).toHaveLength(2);
});

test('il paginatore senza nav non ha il landmark navigation', () => {
    document.body.innerHTML = `
    <p>Pagina 1 di 5</p>
    <button type="button">Indietro</button>
    <button type="button">Avanti</button>
  `;

    expect(() => screen.getByRole('navigation')).toThrow();
    expect(screen.getByRole('button', { name: 'Avanti' })).toBeDefined();
});
