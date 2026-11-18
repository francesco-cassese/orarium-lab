# 03 - Gruppi e preparazione dei test

## Teoria

### L'idea in due righe

Quando un file ha molti test, due cose diventano un problema: capire quali test vanno insieme e fare in modo che ogni test parta da una situazione pulita.
`describe` raggruppa i test; `beforeEach` e `afterEach` preparano e puliscono attorno a ogni test.

### Il problema: i test che si sporcano a vicenda

Se due test usano lo stesso dato (per esempio un array dichiarato fuori dai test) e il primo lo modifica, il secondo parte da un dato già cambiato.
Il risultato di un test dipende allora da quello che è successo prima, e basta cambiare l'ordine dei test per ottenere un risultato diverso. La pagina li chiama «flaky», cioè instabili.

### `beforeEach` e `afterEach`

`beforeEach` registra una funzione che parte prima di ogni test; `afterEach` una funzione che parte dopo ogni test. Servono a far partire ogni test da uno stato noto: per esempio `beforeEach` rimette l'array come era all'inizio.
Secondo la pagina, `afterEach` parte anche quando il test fallisce.

### `beforeAll` e `afterAll`

Fanno la stessa cosa, ma una volta sola per tutto il file (o per tutto il gruppo): `beforeAll` prima del primo test, `afterAll` dopo l'ultimo. Servono per le preparazioni costose, come aprire una connessione. Non si usano per ripristinare lo stato tra un test e l'altro: per quello c'è `beforeEach`.

### `describe`: un gruppo di test con un nome

`describe` crea un gruppo (in inglese «suite») con un nome, e dentro ci vanno i test che parlano della stessa cosa. Il nome del gruppo compare nell'output davanti a quello del test.
I `describe` si possono annidare, ma la pagina consiglia di non esagerare.

### Gli hook dentro un `describe`

Un hook scritto dentro un `describe` vale solo per i test di quel gruppo; un hook scritto fuori, al livello del file, vale per tutti i test del file. Così ogni gruppo può avere la sua preparazione.

### Ordine di esecuzione

La pagina descrive l'ordine così: gli hook esterni avvolgono quelli interni. Prima di un test parte il `beforeEach` esterno e poi quello interno; dopo il test l'ordine si inverte, e parte prima l'`afterEach` interno. L'ordine reale lo guardo nel passo 8, scrivendo un messaggio in ogni hook.

**Analogia (mia, non della documentazione): il banco di lavoro.**

Prima di ogni impasto preparo il banco con gli ingredienti pesati (`beforeEach`) e a fine impasto lo pulisco (`afterEach`). Accendere il forno una volta all'inizio della giornata è `beforeAll`; spegnerlo la sera, `afterAll`. Ogni reparto, pasticceria o panetteria, ha il suo banco: è il `describe`.
Dove l'analogia si ferma: in laboratorio la farina rimasta sul banco la vedo; in un test la modifica che il test precedente ha lasciato nel dato non si vede, e nessuno la pulisce se non lo scrivo io in un hook.

### In breve

| | Cosa fa |
|---|---|
| `describe(nome, funzione)` | raggruppa i test, con un nome |
| `beforeEach(funzione)` | parte prima di ogni test |
| `afterEach(funzione)` | parte dopo ogni test (anche se fallisce, dice la pagina) |
| `beforeAll(funzione)` | parte una volta, prima del primo test |
| `afterAll(funzione)` | parte una volta, dopo l'ultimo test |

## Dalla documentazione (parole originali)

- Da [Setup and Teardown](https://vitest.dev/guide/learn/setup-teardown): "beforeEach runs before every test in the file, and afterEach runs after every test, even if the test fails."; "beforeAll and afterAll run once for the entire suite, while beforeEach and afterEach repeat for every test."; "This makes them perfect for ensuring each test starts with a known state."
- Da [Setup and Teardown](https://vitest.dev/guide/learn/setup-teardown): "Without these hooks, mutations like pop or push from earlier tests would affect subsequent ones,"; "which is a classic source of flaky tests, while the hooks guarantee clean state for every test."
- Da [Setup and Teardown, Scoping with `describe`](https://vitest.dev/guide/learn/setup-teardown): "Hooks defined inside a describe block only apply to the tests within that block."; "Top-level hooks apply to every test in the file."
- Da [Setup and Teardown, Execution Order](https://vitest.dev/guide/learn/setup-teardown): "Top-level hooks wrap around inner hooks, forming a nesting structure:"; "Within each test, outer beforeEach runs first (setting up the broadest context),"; "After the test, the order reverses: inner afterEach cleans up the narrow context first,"
- Da [Hooks](https://vitest.dev/api/hooks.html): "Register a callback to be called before each of the tests in the current suite runs."; "Register a callback to be called after each one of the tests in the current suite completes."
- Da [describe](https://vitest.dev/api/describe): "`describe` is used to group related tests and benchmarks into a suite."; "Suites help organize your test files by creating logical blocks, making test output easier to read"
- Da [Writing Tests, Grouping Tests with `describe`](https://vitest.dev/guide/learn/writing-tests): "`describe` creates a test suite, which is a named group of tests:"; "You can nest `describe` blocks for further organization, but keep nesting shallow."; "Deeply nested tests are harder to read."

## Con parole mie

### 1. A cosa serve `describe`

> A cosa serve `describe`, e cosa cambia nell'output di Vitest quando lo usi?

**Risposta:** `describe` serve a raggruppare i test che parlano della stessa cosa, e a dare un nome al gruppo. Così i test sono ordinati per argomento.

- **Visto:** passo 6: il nome del gruppo `ingredienti` compare sopra i due test, rientrati.
- **Dalla pagina:** `describe` crea un gruppo di test con un nome (la pagina lo chiama «suite»). Così l'output è più facile da leggere.

### 2. `beforeEach` e `afterEach`

> Cosa fanno `beforeEach` e `afterEach`, e quando partono?

**Risposta:** `beforeEach` è una funzione che parte prima di ogni test: serve a rimettere le cose come erano all'inizio. `afterEach` parte dopo ogni test: serve a pulire quello che il test ha lasciato. Per esempio, se un test cambia un array, `beforeEach` può rimetterlo com'era prima del test successivo.

- **Visto:** passo 5: il messaggio dell'`afterEach` compare anche per il test che fallisce.
- **Dalla pagina:** `beforeEach` parte prima di ogni test del file; `afterEach` parte dopo ogni test, anche se il test fallisce.

### 3. Test che dipendono l'uno dall'altro

> Perché un test non dovrebbe dipendere dal risultato di un test precedente? Cosa succede se lo fa?

**Risposta:** Un test deve poter funzionare da solo, senza contare su quello che hanno fatto gli altri. Se dipende dal test prima, il risultato cambia quando cambio l'ordine dei test. Così il test diventa instabile: a volte passa, a volte no, e non capisco più perché.

- **Visto:** passi 2 e 4: senza hook, con l'ordine «sia 2» prima il secondo test fallisce; con «sia 3» prima passano tutti e due.
- **Dalla pagina:** la pagina chiama questi test «flaky», cioè instabili.
- **Non provato:** lanciando con il filtro un test che dipende dal precedente, senza l'altro, il risultato: non l'ho ancora provato.

### 4. `beforeEach` e `beforeAll`

> Che differenza c'è tra `beforeEach` e `beforeAll`? Per quale dei due prepareresti ogni volta un array nuovo, e per quale una connessione al database?

**Risposta:** `beforeEach` parte prima di ogni test. `beforeAll` parte una sola volta, prima di tutti i test del gruppo. Per l'array nuovo userei `beforeEach`, così ogni test parte con un array pulito. Per la connessione al database userei `beforeAll`, così la apro una volta sola.

- **Visto:** passo 8: `beforeAll` è partito una volta sola, all'inizio. Passi 3 e 4: con `beforeEach` l'array viene rimesso a posto prima di ogni test.
- **Dalla pagina:** `beforeAll` gira una volta sola per tutta la suite; `beforeEach` si ripete per ogni test.
- **Dedotto:** la connessione conviene aprirla una volta sola, perché aprirla ogni volta richiede tempo. È un mio ragionamento.

### 5. Dove vale un hook

> Un `beforeEach` scritto dentro un `describe` vale per tutti i test del file? E uno scritto fuori da ogni `describe`?

**Risposta:** No. Un `beforeEach` dentro un `describe` vale solo per i test di quel gruppo. Uno scritto fuori da ogni `describe` vale per tutti i test del file.

- **Visto:** passo 7: ogni `beforeEach` è partito solo per i test del suo gruppo. Passo 8: gli hook fuori da ogni `describe` sono partiti per tutti i test, anche per quelli dentro il `describe`.
- **Dalla pagina:** «Hooks defined inside a describe block only apply to the tests within that block.»; «Top-level hooks apply to every test in the file.»

### 6. L'ordine degli hook

> Con un `beforeEach` e un `afterEach` fuori da ogni `describe` e altri due dentro un `describe`, in che ordine partono attorno a un test del gruppo?

**Risposta:** Prima di un test parte per primo il `beforeEach` fuori dal `describe`, poi quello dentro. Dopo il test l'ordine si inverte: parte per primo l'`afterEach` dentro il `describe`, poi quello fuori.

- **Visto:** passo 8: prima parte il `beforeEach` fuori e poi quello dentro; dopo il test, prima l'`afterEach` dentro e poi quello fuori.
- **Dalla pagina:** «Within each test, outer beforeEach runs first»; «After the test, the order reverses: inner afterEach cleans up the narrow context first».

## Esercizio: la traccia

Lavoro in `vitest/03-gruppi`, dentro il lab. Tutti i file di codice li scrivo io, da capo.
Non tocco la cartella `orarium`.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un test rosso di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio ho usato `pnpm exec vitest run`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.

### Passo 1: preparare la cartella

- Comando: `mkdir`, `pnpm init`, poi `pnpm add -D vitest`, dentro `vitest/03-gruppi`; poi `git status --short -uall`
- Cosa ho visto: ho creato la cartella `vitest/03-gruppi` con `mkdir` (output `d-----`, nome `03-gruppi`). Con `pnpm init` è stato scritto `package.json` con nome `03-gruppi` e `"type": "module"`. Poi `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.0` in `devDependencies`, in 2,1 secondi. Con `git status --short -uall`, lanciato in `vitest/03-gruppi`, i file non tracciati sono `../03-gruppi-e-preparazione.md` (cioè `vitest/03-gruppi-e-preparazione.md`), `package.json` e `pnpm-lock.yaml`; `node_modules` non compare.
- Cosa ho concluso: la cartella è pronta, con Vitest installato come dipendenza di sviluppo.

### Passo 2: due test che usano lo stesso array, senza hook (rosso, di proposito)

- Scrivo `gruppi.test.js` con `let ingredienti = ['farina', 'burro', 'uova']` fuori dai test e due test. Il primo toglie un elemento con `ingredienti.pop()` e controlla che la lunghezza sia 2 (`toHaveLength(2)`). Il secondo controlla che la lunghezza sia 3.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 2 test, 1 passato (quello con `pop()`) e 1 fallito (quello della lunghezza 3). Il messaggio dice `AssertionError: expected [ 'farina', 'burro' ] to have a length of 3 but got 2`, con `- Expected: 3` e `+ Received: 2`. La freccia punta a `gruppi.test.js:11:25`, sulla riga di `toHaveLength(3)`.
- Cosa ho concluso: il secondo test ha trovato l'array con `'farina'` e `'burro'`, senza `'uova'`, cioè già modificato dal test di prima.

### Passo 3: lo stesso con `beforeEach`

- Aggiungo `beforeEach` che rimette `ingredienti` a `['farina', 'burro', 'uova']` prima di ogni test.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 0 test. Il file non è partito: «Failed Suites 1», con `TypeError: "beforeEach" callback value must be function, received "object"` alla riga 5 di `gruppi.test.js`, dove c'è `beforeEach(['farina', 'burro', 'uova']);`.
- Cosa ho concluso: `beforeEach` vuole una funzione, e nel file gli ho passato un array. Il file non arriva ai test.
- Poi ho messo la funzione: `beforeEach(() => { ingredienti = ['farina', 'burro', 'uova']; });`. Rilanciato `pnpm exec vitest run`: 2 test, tutti verdi («Tests 2 passed»); il secondo test, «verifica che la lunghezza dell'array sia 3», passa.

### Passo 4: scambio l'ordine dei due test

- Con `beforeEach` al suo posto, scambio i due test nel file (il secondo diventa il primo).
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 2 test, tutti verdi («Tests 2 passed»). L'ordine nell'output è cambiato: prima «la lunghezza dell'array sia 3», poi «la lunghezza dell'array sia 2».
- Cosa ho concluso: con `beforeEach` nel file, lo scambio dei test non rompe il risultato: il test con `pop()` non cambia più l'array per il test che viene dopo.

Seconda prova: ho commentato il `beforeEach`, lasciando i due test con l'ordine scambiato (prima «sia 3», poi «sia 2»).
- Cosa ho visto: 2 test passati («Tests 2 passed»).
- Cosa ho concluso: senza hook, l'ordine dei test cambia il risultato, per questi due test: con «sia 2» per primo il secondo test fallisce (passo 2), con «sia 3» per primo passano tutti e due (passo 4).

### Passo 5: `afterEach` quando il test fallisce (rosso, di proposito)

- Aggiungo un `afterEach` che scrive con `console.log` un messaggio. Cambio il valore atteso di un test, per farlo fallire.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 2 test, 1 passato («sia 2») e 1 fallito («sia 3»), con il valore atteso cambiato a 7. Il messaggio dice `AssertionError: expected [ 'farina', 'burro', 'uova' ] to have a length of 7 but got 3`, alla riga 14, colonna 25. Il messaggio `ciao dal console log` compare due volte: una sotto `stdout | ... > verifica che la lunghezza dell'array sia 2` e una sotto `stdout | ... > verifica che la lunghezza dell'array sia 3`, cioè anche per il test fallito.
- Cosa ho concluso: l'`afterEach` è partito anche dopo il test che è fallito, come dice la pagina («afterEach runs after every test, even if the test fails»). La prova riguarda un solo caso. Dal messaggio vedo anche che l'array ricevuto aveva tre elementi: il `beforeEach` l'aveva rimesso a posto anche dopo il `pop()` del test precedente.
- Poi rimetto il valore giusto.

### Passo 6: `describe`

- Metto i due test dentro un `describe('ingredienti', () => { ... })`, lasciando fuori il `beforeEach`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 2 test, tutti verdi («Tests 2 passed»). Nell'output compare il gruppo `ingredienti (2)`, e sotto i due test, rientrati.
- Cosa ho concluso: il nome del gruppo compare sopra i nomi dei test, rientrati sotto di lui.

### Passo 7: un hook dentro un `describe`

- Scrivo due `describe`, ciascuno con il suo `beforeEach` dentro e un suo array: per esempio `'dolci'` con `['farina', 'burro']` e `'salati'` con `['sale', 'olio', 'pepe']`. In ogni gruppo un test controlla la lunghezza dell'array del gruppo.
- Comando: `pnpm exec vitest run hook-nei-gruppi` (con il nome del file come filtro)
- Cosa ho visto: 2 test, tutti verdi («Tests 2 passed»). Nell'output ci sono due gruppi: `dolci (1)` con «l'array dolci ha due elementi», e `salati (1)` con «l'array salati ha tre elementi».
- Cosa ho concluso: ogni gruppo ha il suo `beforeEach` e il suo array, e i due test passano senza dipendere l'uno dall'altro.

Seconda prova: ho messo un `console.log` in ogni `beforeEach` dei due gruppi (`hook dolci` e `hook salati`).
- Cosa ho visto: `hook dolci` compare solo nel blocco `stdout | ... > dolci > l'array dolci ha due elementi`, e `hook salati` solo in quello del test dei salati.
- Cosa ho concluso: in questa prova, ogni `beforeEach` è partito solo per il test del suo gruppo.

### Passo 8: l'ordine degli hook

- Scrivo un `console.log` con un'etichetta mia in ogni hook: `beforeAll`, `afterAll`, `beforeEach` e `afterEach` fuori da ogni `describe`, più un `beforeEach` e un `afterEach` dentro un `describe` che contiene due test. Anche i test scrivono un messaggio.
- Comando: `pnpm exec vitest run ordine` (con il nome del file come filtro)
- Cosa ho visto: 2 test, tutti verdi («Tests 2 passed»). I messaggi, nell'ordine in cui compaiono:
  1. `beforeAll fuori`, una volta sola all'inizio;
  2. per il «primo test»: `beforeEach fuori`, `beforeEach dentro`, `test 1`, `afterEach dentro`, `afterEach fuori`;
  3. per il «secondo test»: la stessa sequenza, con `test 2`;
  4. `afterAll fuori`, una volta sola alla fine.
- Cosa ho concluso: prima di ogni test è partito per primo l'hook esterno (`beforeEach fuori`) e poi quello interno (`beforeEach dentro`). Dopo ogni test l'ordine si è invertito: prima l'`afterEach` interno, poi quello esterno. `beforeAll` e `afterAll` sono partiti una volta sola, uno all'inizio e uno alla fine. Gli hook esterni sono partiti anche per i test dentro il `describe`.

## Dopo l'esercizio

### Cosa ho fatto

- Comandi usati (descritti nel [diario](comandi.md)): `mkdir`, `pnpm init`, `pnpm add -D vitest`, `git status --short -uall`, `pnpm exec vitest run`. Ho usato `pnpm exec vitest run` anche con il nome di un file (`hook-nei-gruppi`, `ordine`), per eseguire solo quel file.

### Cosa ho visto

- Senza hook, con `pop()` nel primo test, il secondo test trova l'array già modificato e fallisce (passo 2).
- Con `beforeEach` come funzione i due test passano. Con un array al posto della funzione, `beforeEach` dà `TypeError` quando il file viene caricato: l'output dice 0 test e «Failed Suites 1» (passo 3).
- Senza hook, scambiando l'ordine dei test il risultato cambia: con l'ordine del passo 2 il test era rosso, con quello scambiato passa (passo 4).
- L'`afterEach` parte anche dopo un test che fallisce (passo 5).
- `describe` dà un nome al gruppo, e nell'output il gruppo conta i suoi test (passo 6).
- Un `beforeEach` dentro un `describe` parte solo per i test di quel gruppo (passo 7).
- Ordine degli hook: prima di ogni test parte l'esterno, poi l'interno; dopo, l'ordine si inverte. `beforeAll` e `afterAll` partono una volta sola (passo 8).
- Con `pnpm exec vitest run` lanciato in `vitest/03-gruppi`, con tutti e tre i file insieme, i messaggi dei file diversi sono mescolati: `hook dolci` compare prima di `beforeAll fuori`, e `hook salati` si inserisce tra i messaggi dell'ordine. L'ordine dei messaggi dentro `ordine.test.js` è lo stesso del passo 8.

### Cosa ho verificato

- Con `pnpm exec vitest run` lanciato in `vitest/03-gruppi`, con i tre file insieme il risultato è verde: 3 file e 6 test passati.

### Cosa ho dedotto e non ancora verificato

- Che Vitest esegua i file insieme, e che per questo i messaggi si mescolano: è un'ipotesi, finché non la verifico.
- Che `beforeAll` e `afterAll` si comportino allo stesso modo dentro un `describe`: li ho visti solo a livello di file, non dentro un `describe`.

### Domande aperte

- Vitest esegue i file di test in parallelo, e dove lo dice la documentazione?

### Applicazione in Orarium

- **Visto:** Orarium usa già `beforeEach` e `afterEach` in tre file. `App.test.jsx` ha un `beforeEach` alla riga 6 e un `afterEach` alla riga 13, fuori da ogni `describe`. `IngredientList.test.jsx` ha un `beforeEach` alla riga 19 e un `afterEach` alla riga 24, senza `describe`. `src/test/setup.js` ha un `afterEach` alla riga 5.
- **Visto:** in `App.test.jsx` c'è un solo `describe`, quello chiamato `App`, alla riga 17.
- **Visto:** `beforeAll` e `afterAll` non compaiono in nessun file di `frontend/src`.

Non nasce nessuna issue né PR da questo esercizio: è una scelta, perché non c'è niente da cambiare. Il lavoro vero sui test di Orarium sta nell'esercizio 08.

## Fonti

- [Setup and Teardown](https://vitest.dev/guide/learn/setup-teardown)
- [Hooks](https://vitest.dev/api/hooks.html)
- [describe](https://vitest.dev/api/describe)
- [Writing Tests](https://vitest.dev/guide/learn/writing-tests)
