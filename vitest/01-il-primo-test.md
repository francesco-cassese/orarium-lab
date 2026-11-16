# 01 - Il primo test
 
## Teoria
 
### L'idea in due righe

Un test è un piccolo programma che controlla che un altro pezzo di codice faccia quello che mi aspetto.
Vitest è lo strumento che trova i test, li esegue e mi dice quali sono passati e quali no.
 
### Un test ha un nome e delle verifiche

Ogni test ha un nome, cioè una frase che dice cosa controlla, e una funzione con una o più verifiche.
Le verifiche si scrivono con `expect`: guarda un valore e controlla che sia quello atteso.
Se una verifica non è soddisfatta, il test fallisce; se tutte lo sono, il test passa.
 
**Analogia (mia, non della documentazione): la ricetta.**

Una ricetta dice «300 g di farina, 200 g di burro»; il test è la pesata che faccio a fine preparazione:
non produce l'impasto, controlla che sia venuto come dice la ricetta.
Dove l'analogia si ferma: una pesata si fa a mano e una volta sola; un test si riesegue in pochi secondi, ogni volta che cambio il codice.
 
### `test` e `it`

`test` e `it` sono la stessa cosa: cambia solo come si legge la frase. Con `it` si scrive «it shows the ingredients» (in inglese, «esso mostra gli ingredienti»); con `test` il nome è più libero.
 
### Dove stanno i file di test

Vitest cerca i file che hanno `.test.` o `.spec.` nel nome, per esempio `somma.test.js`. Un file senza queste parti non viene letto.
 
### Rosso e verde

Un test che fallisce si chiama «rosso»; uno che passa, «verde». Si parte dal rosso, perché così so che il test è capace di fallire, e poi si scrive il codice che lo rende verde.
 
### Eseguire i test

- `vitest run` esegue tutti i test una volta e si ferma.
- `vitest` da solo, in un terminale normale, resta acceso e rilancia i test quando i file cambiano («watch mode»). In un terminale non interattivo, come la CI, parte come `vitest run`.

### Cosa serve

Vitest richiede Node 22.12.0 o più recente e Vite 6.4.0 o più recente. La pagina Getting Started dice di installarlo con `npm install -D vitest` (o il comando equivalente di pnpm). Non dice se Vite arriva insieme a lui o va installato a parte: lo vedrò nell'esercizio.
 
### In breve

| | Cosa fa |
|---|---|
| `test(nome, funzione)` | definisce un test |
| `expect(valore)` | crea una verifica sul valore |
| `vitest run` | esegue una volta e si ferma |
| `vitest` | resta acceso e rilancia al cambiamento dei file |
 
## Dalla documentazione (parole originali)

- Da [Getting Started](https://vitest.dev/guide/): "Vitest requires Vite >=v6.4.0 and Node >=v22.12.0."; "By default, tests must contain `.test.` or `.spec.` in their file name."; "To run tests once without watching for file changes, use `vitest run`."
- Da [Writing Tests](https://vitest.dev/guide/learn/writing-tests): "A test verifies that a piece of code produces the expected result."; "Each test has a name (a string describing what it checks) and a function that contains one or more assertions."; "If any assertion fails, the test fails."; "They behave identically." (su `test` e `it`).
- Da [Writing Tests, sezione Test Files](https://vitest.dev/guide/learn/writing-tests): "By default, Vitest looks for any file that contains `.test.` or `.spec.` in its name, such as `utils.test.js`, `app.spec.js`, or `math.test.jsx`."
- Da [expect](https://vitest.dev/api/expect): "`expect` is used to create assertions. In this context `assertions` are functions that can be called to assert a statement."; "If it's not, the assertion will throw an error, and the test will fail."
- Da [Command Line Interface](https://vitest.dev/guide/cli): "Will enter the watch mode in development environment and run mode in CI (or non-interactive terminal) automatically." (su `vitest`); "Perform a single run without watch mode." (su `vitest run`).

## Con parole mie
 
### 1. Cos'è un test
 
> Cos'è un test, e da quali due parti è fatto?
 
**Risposta:**
 
### 2. Cosa fa `expect`
 
> Cosa fa `expect`? Cosa succede al test se una verifica non è soddisfatta?
 
**Risposta:**
 
### 3. `test` e `it`
 
> Che differenza c'è tra `test` e `it`?
 
**Risposta:**
 
### 4. Come Vitest trova i test
 
> Se creo un file `somma.js` con dentro un test, Vitest lo esegue? Perché?
 
**Risposta:**
 
### 5. `vitest` e `vitest run`
 
> Che differenza c'è tra `vitest` e `vitest run`? In quale caso li useresti?
 
**Risposta:**
 
### 6. Perché si parte dal rosso
 
> Perché si scrive prima un test che fallisce, e solo dopo il codice che lo fa passare?
 
**Risposta:**
 
## Esercizio: la traccia
 
Lavoro in `vitest/01-primo-test`, dentro il lab. Tutti i file di codice li scrivo io, da capo.
Non tocco la cartella `orarium`.
 
### Passo 1: controllare la versione di Node

- Comando: `node -v`
- Cosa ho visto:
- Cosa ho concluso:

### Passo 2: preparare la cartella e installare Vitest

- Comando: `pnpm init`, poi `pnpm add -D vitest`, dentro `vitest/01-primo-test`
- Cosa ho visto:
- Cosa ho concluso:

### Passo 3: un test per una funzione che non esiste (rosso)

- Scrivo `somma.test.js`: un test che importa `somma` da `./somma.js` e si aspetta che `somma(2, 3)` sia `5`. Il file `somma.js` non c'è ancora.
- Comando: `pnpm exec vitest run`
- Cosa ho visto:
- Cosa ho concluso:

### Passo 4: una funzione sbagliata (ancora rosso)

- Creo `somma.js` con una funzione `somma` che restituisce un risultato sbagliato di proposito.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: (il messaggio con il valore atteso e quello ricevuto)
- Cosa ho concluso:

### Passo 5: la funzione giusta (verde)

- Correggo `somma.js`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto:
- Cosa ho concluso:

### Passo 6: il test deve poter fallire

- Cambio il valore atteso nel test, da `5` a `6`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto:
- Cosa ho concluso:

### Passo 7: il modo watch

- Rimetto `5`. Comando: `pnpm exec vitest` (senza `run`). Con il comando acceso, cambio un valore nel test, salvo, guardo il terminale; poi lo rimetto a posto e salvo. Esco con `Ctrl+C`.
- Cosa ho visto:
- Cosa ho concluso:

### Passo 8: un file senza `.test.` nel nome

- Rinomino `somma.test.js` in `somma-prova.js`. Comando: `pnpm exec vitest run`. Poi rimetto il nome giusto.
- Cosa ho visto:
- Cosa ho concluso:

## Dopo l'esercizio
 
### Cosa ho fatto

- Comandi usati (descritti nel [diario](comandi.md)):

### Cosa ho visto

-

### Cosa ho verificato

-

### Cosa ho dedotto e non ancora verificato

-

### Domande aperte

-

### Applicazione in Orarium

Da scrivere alla fine dell'esercizio: Orarium ha già `pnpm test` che esegue `vitest run`; qui non cambia niente.
 
## Fonti

- [Getting Started](https://vitest.dev/guide/)
- [Writing Tests](https://vitest.dev/guide/learn/writing-tests)
- [expect](https://vitest.dev/api/expect)
- [Command Line Interface](https://vitest.dev/guide/cli)