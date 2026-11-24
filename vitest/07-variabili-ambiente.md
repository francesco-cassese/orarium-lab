# 07 - Variabili d'ambiente

## Teoria

### L'idea in due righe

Nell'esercizio 06 ho sostituito una variabile globale con `vi.stubGlobal` e l'ho rimessa a posto con `vi.unstubAllGlobals`. Qui faccio lo stesso con le variabili d'ambiente: `vi.stubEnv` cambia il valore di una variabile, `vi.unstubAllEnvs` rimette quelli originali.

### Cambiare una variabile d'ambiente

`vi.stubEnv('NOME', 'valore')` cambia il valore di una variabile d'ambiente in due posti: `process.env` e `import.meta.env`. Il codice che sto provando legge il valore finto, senza che io debba toccare l'ambiente vero. Per le tre variabili `PROD`, `DEV` e `SSR` il valore è un booleano; per tutte le altre è una stringa, oppure `undefined`.

### Rimettere a posto

`vi.unstubAllEnvs()` ripristina tutte le variabili cambiate con `vi.stubEnv`. La prima volta che viene chiamato, Vitest si ricorda il valore originale e lo tiene finché `unstubAllEnvs` non viene chiamato di nuovo. Se cambio una variabile assegnandola a mano (`import.meta.env.MODE = 'test'`), `unstubAllEnvs` non la può ripristinare.

### In breve

| | Cosa fa |
|---|---|
| `vi.stubEnv('NOME', 'valore')` | cambia la variabile in `process.env` e in `import.meta.env` |
| `vi.stubEnv('NOME', undefined)` | la toglie (il valore diventa `undefined`) |
| `vi.unstubAllEnvs()` | rimette tutte le variabili cambiate con `stubEnv` ai valori originali |
| assegnazione diretta | cambia il valore, ma `unstubAllEnvs` non lo può ripristinare |

## Dalla documentazione (parole originali)

- Da [Vi, vi.stubEnv](https://vitest.dev/api/vi): "Changes the value of environmental variable on `process.env` and `import.meta.env`."; "You can restore its value by calling `vi.unstubAllEnvs`."; "You can also change the value by simply assigning it, but you won't be able to use `vi.unstubAllEnvs` to restore previous value:"
- Da [Vi, vi.unstubAllEnvs](https://vitest.dev/api/vi): "Restores all `import.meta.env` and `process.env` values that were changed with `vi.stubEnv`."; "When it's called for the first time, Vitest remembers the original value and will store it, until `unstubAllEnvs` is called again."

## Con parole mie

### 1. Cosa cambia stubEnv

> Cosa fa `vi.stubEnv` e in quali due posti cambia il valore?

**Risposta:** `vi.stubEnv` cambia il valore di una variabile d'ambiente. Lo cambia in due posti: in `process.env` e in `import.meta.env`.

- **Visto:** nel passo 2 `vi.stubEnv('LINGUA', 'it')` cambia `process.env.LINGUA`, e nel passo 6 `vi.stubEnv('VITE_INDIRIZZO_API', 'http://localhost:8000')` cambia `import.meta.env.VITE_INDIRIZZO_API`. Sono due variabili diverse, lette in due posti diversi.
- **Dalla pagina:** «Changes the value of environmental variable on `process.env` and `import.meta.env`.»
- **Non provato:** che la stessa variabile letta in `process.env` e in `import.meta.env` dia lo stesso valore: non l'ho ancora visto.

### 2. Togliere una variabile

> Come faccio a far sparire una variabile d'ambiente durante un test? Che tipo di valore accetta `vi.stubEnv` per `PROD`, `DEV` e `SSR`?

**Risposta:** Per far sparire una variabile scrivo `vi.stubEnv('NOME', undefined)`: il valore diventa `undefined`. Per `PROD`, `DEV` e `SSR` il valore è un booleano. Per tutte le altre è una stringa, oppure `undefined`.

- **Visto:** nel passo 3, con `vi.stubEnv('LINGUA', undefined)`, `leggiLingua()` e `process.env.LINGUA` valgono `undefined`. Con `vi.stubEnv('PROD', true)`, `import.meta.env.PROD` vale `true`.
- **Dalla pagina:** «value: T extends 'PROD' | 'DEV' | 'SSR' ? boolean : string | undefined»; «vi.stubEnv('NODE_ENV', undefined)».
- **Non provato:** `DEV` e `SSR` con un booleano.

### 3. Assegnare a mano

> Cosa succede se cambio una variabile assegnandola direttamente, invece di usare `vi.stubEnv`?

**Risposta:** Se assegno la variabile a mano, il valore cambia, ma `vi.unstubAllEnvs()` non lo può rimettere a posto.

- **Visto:** nel passo 5 ho assegnato `process.env.REPARTO = 'pasticceria'`, poi ho chiamato `vi.unstubAllEnvs()`: `process.env.REPARTO` è rimasto `'pasticceria'`.
- **Dalla pagina:** «You can also change the value by simply assigning it, but you won't be able to use `vi.unstubAllEnvs` to restore previous value:»

### 4. A che valore torna

> Se chiamo `vi.stubEnv` due volte sulla stessa variabile e poi `vi.unstubAllEnvs()`, a quale valore torna?

**Risposta:** Torna al valore di prima del primo `vi.stubEnv`, non a quello della seconda chiamata.

- **Visto:** nel passo 4, dopo due `vi.stubEnv` su `TURNO` e poi `vi.unstubAllEnvs()`, `process.env.TURNO` vale `undefined`. Il valore di prima del primo `stubEnv` era `undefined`, perché il test non imposta `TURNO` prima.
- **Dalla pagina:** «When it's called for the first time, Vitest remembers the original value and will store it, until `unstubAllEnvs` is called again.»
- **Dedotto:** il valore originale è quello prima della prima chiamata, perché la pagina dice che Vitest se lo ricorda alla prima chiamata.

### 5. Pulire tra un test e l'altro

> Come faccio a rimettere a posto le variabili dopo ogni test senza ripetere la chiamata in ognuno?

**Risposta:** Metto `vi.unstubAllEnvs()` in un `afterEach`, come ho fatto con `vi.unstubAllGlobals()` nell'esercizio 06. Così non lo ripeto in ogni test.

- **Visto:** nel passo 4, in `pulizia.test.js`, senza `afterEach` il secondo test trova `CORSIA` ancora `'A'`. Con `afterEach(() => { vi.unstubAllEnvs() });` il secondo test trova `undefined`.
- **Dedotto:** è lo stesso schema dell'esercizio 06. La pagina non lo dice per le variabili d'ambiente.

## Esercizio: la traccia

Lavoro in `vitest/07-variabili-ambiente`, dentro il lab.
Non tocco la cartella `orarium`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un test rosso di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio ho usato `pnpm exec vitest run`.

### Passo 1: preparare la cartella

- Comando: `mkdir ..\07-variabili-ambiente`, poi `Set-Location ..\07-variabili-ambiente`, poi `pnpm init`, poi `pnpm add -D vitest`.
- Cosa ho visto: `mkdir` ha creato la cartella `07-variabili-ambiente` in `vitest` (output `d-----`). `Set-Location` ha portato il prompt a `vitest\07-variabili-ambiente`.
- `pnpm init` ha scritto `package.json` con nome `07-variabili-ambiente`, `"type": "module"` e lo script `test` con `echo "Error: no test specified" && exit 1`. `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.1` in `devDependencies`, in 903 millisecondi.
- Poi ho cambiato lo script `test` a mano, nel file `package.json`, in `vitest run`. Controllo con `Select-String -Path package.json -Pattern '"test"|vitest'`: riga 7 `"test": "vitest run"` e riga 21 `"vitest": "^5.1.1"`.
- Cosa ho concluso: la cartella è pronta, con Vitest 5.1.1 e lo script `test` impostato a `vitest run`.

### Passo 2: cambiare una variabile in process.env

- Scrivo `leggi.js`, con `leggiLingua()` che restituisce `process.env.LINGUA`. Controllo con `Get-Content leggi.js`: mostra le cinque righe che ho scritto.
- Scrivo `ambiente.test.js`, con un test «stubEnv cambia il valore in process.env»: chiamo `vi.stubEnv('LINGUA', 'it')`, poi controllo che `leggiLingua()` valga `'it'` e che `process.env.LINGUA` valga `'it'`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 1 test, verde («Tests 1 passed»): `ambiente.test.js (1 test)` e «stubEnv cambia il valore in process.env». Nel passo 2 non ho visto nessun rosso prima del verde.
- Cosa ho concluso: `vi.stubEnv` cambia `process.env`, e il codice che legge `process.env.LINGUA` vede il valore finto.

### Passo 3: togliere una variabile

- Aggiungo a `ambiente.test.js` un test «stubEnv con undefined toglie la variabile»: chiamo `vi.stubEnv('LINGUA', undefined)`, poi controllo che `leggiLingua()` e `process.env.LINGUA` valgano `undefined`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 2 test, verdi («Tests 2 passed»).
- Cosa ho concluso: con `undefined` la variabile sparisce sia da `leggiLingua()` sia da `process.env`.
- Aggiungo un terzo test, «stubEnv con un booleano su PROD»: chiamo `vi.stubEnv('PROD', true)`, poi controllo che `import.meta.env.PROD` valga `true`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 3 test, verdi («Tests 3 passed»): `ambiente.test.js (3 tests)`, con «stubEnv cambia il valore in process.env», «stubEnv con undefined toglie la variabile» e «stubEnv con un booleano su PROD».
- Cosa ho concluso: con `PROD` impostato a `true`, `import.meta.env.PROD` vale `true`.
- Controllo fatto apposta: ho commentato la riga `vi.stubEnv('LINGUA', 'it')` nel primo test, e ho rilanciato `pnpm exec vitest run`: 3 test, 1 fallito, «stubEnv cambia il valore in process.env», alla riga 6, colonna 27. Il messaggio dice `AssertionError: expected undefined to be 'it' // Object.is equality`, con `- "it"` (il valore che ho scritto) e `+ undefined` (il valore ricevuto). Gli altri due test sono verdi («Tests 1 failed | 2 passed (3)»).
  - Cosa ho concluso: senza `vi.stubEnv`, `leggiLingua()` non trova `LINGUA`, e il primo test fallisce.
- Poi ho rimesso la riga `vi.stubEnv('LINGUA', 'it')`, e ho rilanciato `pnpm exec vitest run`: 3 test, tutti verdi («Tests 3 passed»).
  - Cosa ho concluso: con la riga rimessa, il primo test torna verde.

### Passo 4: due cambi e un solo ripristino

- Aggiungo a `ambiente.test.js` un quarto test, «due stubEnv e un solo ripristino riportano il valore originale»: chiamo `vi.stubEnv('TURNO', 'mattina')`, poi `vi.stubEnv('TURNO', 'sera')`, controllo che `process.env.TURNO` valga `'sera'`, e poi che valga `undefined`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 4 test, 1 fallito: «due stubEnv e un solo ripristino riportano il valore originale», alla riga 25, colonna 31. Il messaggio dice `AssertionError: expected 'sera' to be undefined`, con `- Expected: undefined` e `+ Received: "sera"`. Gli altri tre test sono verdi. Il risultato finale è «Tests 1 failed | 3 passed (4)».
- Cosa ho concluso: il test non chiama ancora `vi.unstubAllEnvs()` prima della riga 25, quindi `process.env.TURNO` resta `'sera'`.
- Poi ho messo `vi.unstubAllEnvs()` alla riga 25, tra il controllo su `'sera'` e quello su `undefined`, e ho rilanciato `pnpm exec vitest run`: 4 test, tutti verdi («Tests 4 passed»).
  - Cosa ho concluso: dopo `vi.unstubAllEnvs()` la riga 26 vede `undefined`. Nel test `TURNO` non era impostata prima della prima chiamata, quindi il valore originale era `undefined`.
- Controllo fatto apposta, in un file a parte, `pulizia.test.js`: il primo test chiama `vi.stubEnv('CORSIA', 'A')` e controlla `process.env.CORSIA`, senza `vi.unstubAllEnvs()`. Il secondo controlla che `process.env.CORSIA` sia `undefined`. Comando: `pnpm exec vitest run pulizia.test.js`
  - Cosa ho visto: 2 test, 1 fallito: «il secondo test trova CORSIA come prima», alla riga 9, colonna 32. Il messaggio dice `AssertionError: expected 'A' to be undefined`, con `- Expected: undefined` e `+ Received: "A"`. Il primo test è verde. Il risultato finale è «Tests 1 failed | 1 passed (2)».
  - Cosa ho concluso: senza `vi.unstubAllEnvs()` tra un test e l'altro, `CORSIA` resta `'A'` nel secondo test.
- Poi ho messo `afterEach(() => { vi.unstubAllEnvs() });` in cima a `pulizia.test.js`, e ho rilanciato `pnpm exec vitest run pulizia.test.js`: 2 test, tutti verdi («Tests 2 passed»).
  - Cosa ho concluso: con `vi.unstubAllEnvs()` dopo ogni test, `CORSIA` torna com'era, e il secondo test trova `undefined`.

### Passo 5: assegnare a mano senza stubEnv

- Scrivo `a-mano.test.js`, con un test «un valore assegnato a mano e unstubAllEnvs»: assegno `process.env.REPARTO = 'pasticceria'` direttamente, chiamo `vi.unstubAllEnvs()`, poi controllo che `process.env.REPARTO` valga `undefined`.
- Comando: `pnpm exec vitest run a-mano.test.js`
- Cosa ho visto: 1 test, fallito: «un valore assegnato a mano e unstubAllEnvs», alla riga 6, colonna 33. Il messaggio dice `AssertionError: expected 'pasticceria' to be undefined`, con `- Expected: undefined` e `+ Received: "pasticceria"`. Il risultato finale è «Tests 1 failed (1)».
- Cosa ho concluso: `vi.unstubAllEnvs()` non ripristina un valore assegnato a mano: `process.env.REPARTO` resta `'pasticceria'`.
- Poi ho cambiato il test in «un valore assegnato a mano resta dopo unstubAllEnvs», con il controllo `toBe('pasticceria')` alla riga 6, e ho rilanciato `pnpm exec vitest run a-mano.test.js`: 1 test, verde («Tests 1 passed»).
  - Cosa ho concluso: il valore assegnato a mano resta dopo `vi.unstubAllEnvs()`. Il test ora controlla questo comportamento, e non più il ripristino.

### Passo 6: leggere import.meta.env

- Scrivo `indirizzo.test.js`, con un test «stubEnv cambia import.meta.env»: `afterEach` con `vi.unstubAllEnvs()`, poi chiamo `vi.stubEnv('VITE_INDIRIZZO_API', 'http://localhost:8000')` e controllo che `leggiIndirizzo()` valga `'http://localhost:8000'`. Il file importa `leggiIndirizzo` da `./indirizzo.js`.
- Comando: `pnpm exec vitest run indirizzo.test.js`
- Cosa ho visto: 0 test, suite fallita: `Error: Cannot find module './indirizzo.js'`, alla riga 2 di `indirizzo.test.js`. Il risultato finale è «Test Files 1 failed (1)», «Tests no tests».
- Cosa ho concluso: manca il file `indirizzo.js` con `leggiIndirizzo`. Non l'ho ancora scritto, quindi il test non parte.
- Poi ho scritto `indirizzo.js`, con `leggiIndirizzo()` che restituisce `import.meta.env.VITE_INDIRIZZO_API`, e ho rilanciato `pnpm exec vitest run indirizzo.test.js`: 1 test, verde («Tests 1 passed»).
  - Cosa ho concluso: `vi.stubEnv` cambia `import.meta.env`, e il codice che legge `import.meta.env.VITE_INDIRIZZO_API` vede il valore finto.
- Controllo fatto apposta: ho commentato la riga `vi.stubEnv('VITE_INDIRIZZO_API', 'http://localhost:8000')`, e ho rilanciato `pnpm exec vitest run indirizzo.test.js`: 1 test, fallito, «stubEnv cambia import.meta.env», alla riga 10, colonna 30. Il messaggio dice `AssertionError: expected undefined to be 'http://localhost:8000' // Object.is equality`, con `- "http://localhost:8000"` (il valore che ho scritto) e `+ undefined` (il valore ricevuto). Il risultato finale è «Tests 1 failed (1)».
  - Cosa ho concluso: senza `vi.stubEnv`, `leggiIndirizzo()` non trova `VITE_INDIRIZZO_API`, e il test fallisce.
- Run finale. Comando: `pnpm test`, poi `$LASTEXITCODE`.
  - Cosa ho visto: `Test Files 4 passed (4)`, `Tests 8 passed (8)`, codice di uscita 0. I file sono `indirizzo.test.js`, `a-mano.test.js`, `ambiente.test.js` e `pulizia.test.js`.
  - Cosa ho concluso: l'esercizio è verde con lo script `test`, su tutti e quattro i file.

## Dopo l'esercizio

### Cosa ho fatto

- Ho preparato la cartella `07-variabili-ambiente` con Vitest 5.1.1 e lo script `test` (passo 1).
- Ho scritto `leggi.js` e `indirizzo.js`, e quattro file di test: `ambiente.test.js` (4 test), `pulizia.test.js` (2 test), `a-mano.test.js` (1 test) e `indirizzo.test.js` (1 test).
- Comandi usati, già nel diario [comandi.md](comandi.md): `mkdir`, `Set-Location`, `pnpm init`, `pnpm add -D vitest`, `Select-String`, `Get-Content`, `pnpm exec vitest run`, `pnpm test`, `$LASTEXITCODE`.

### Cosa ho visto

- `vi.stubEnv` cambia `process.env`, e il codice che legge `process.env.LINGUA` vede il valore finto (passo 2).
- Con `undefined` la variabile sparisce sia da `process.env` sia dal codice che la legge (passo 3).
- Con `vi.stubEnv('PROD', true)`, `import.meta.env.PROD` vale `true` (passo 3).
- Due `vi.stubEnv` su `TURNO` e poi `vi.unstubAllEnvs()` riportano `process.env.TURNO` a `undefined` (passo 4).
- Senza `afterEach`, `CORSIA` resta `'A'` nel test dopo; con `afterEach(() => { vi.unstubAllEnvs() });` torna `undefined` (passo 4).
- Un valore assegnato a mano con `process.env.REPARTO = ...` resta dopo `vi.unstubAllEnvs()` (passo 5).
- `vi.stubEnv` cambia `import.meta.env.VITE_INDIRIZZO_API`, letto da `leggiIndirizzo()` (passo 6).

### Cosa ho verificato

Conteggi run per run, in ordine. Tutte le run rosse sono controlli fatti apposta; nessun rosso per sbaglio.

- Run 1 (passo 2): 1 test, verde.
- Run 2 (passo 3): 2 test, verdi (con `undefined`).
- Run 3 (passo 3): 3 test, verdi (con `PROD`).
- Run 4 (passo 3): 3 test, 1 rosso di controllo (riga 6, `vi.stubEnv` commentato).
- Run 5 (passo 3): 3 test, verdi (riga rimessa).
- Run 6 (passo 4): `ambiente.test.js`, 4 test, 1 rosso di controllo (riga 25, senza `vi.unstubAllEnvs()`).
- Run 7 (passo 4): `ambiente.test.js`, 4 test, verdi (con `vi.unstubAllEnvs()` alla riga 25).
- Run 8 (passo 4): `pulizia.test.js`, 2 test, 1 rosso di controllo (riga 9, senza `afterEach`).
- Run 9 (passo 4): `pulizia.test.js`, 2 test, verdi (con `afterEach`).
- Run 10 (passo 5): `a-mano.test.js`, 1 test, rosso di controllo (riga 6, atteso `undefined`).
- Run 11 (passo 5): `a-mano.test.js`, 1 test, verde (atteso `'pasticceria'`).
- Run 12 (passo 6): `indirizzo.test.js`, 0 test (modulo `indirizzo.js` mancante).
- Run 13 (passo 6): `indirizzo.test.js`, 1 test, verde.
- Run 14 (passo 6): `indirizzo.test.js`, 1 test, 1 rosso di controllo (riga 10, `vi.stubEnv` commentato).
- Run 15 (finale): `pnpm test`, 4 file, 8 test verdi, codice di uscita 0.

### Cosa ho dedotto e non ancora verificato

- Il valore originale di `TURNO` era `undefined` perché il test non lo imposta prima della prima chiamata: è una deduzione dal codice (passo 4).

### Domande aperte

- Il test su `PROD` sta in `ambiente.test.js`, senza `afterEach` con `vi.unstubAllEnvs()`: `PROD` resta `true` per i test dopo? Non lo so.

### Applicazione in Orarium

Ho cercato nel mio `orarium` locale, in sola lettura, i punti che usano `VITE_API_BASE_URL`, `stubEnv` e `unstubAllEnvs`: non ho ancora confrontato le righe con il repo pubblico al commit `b582ce6`: questo non l'ho verificato. Non ho cambiato nulla in `orarium`.

- **Visto:** `frontend/src/api/ingredients.js`, riga 25: la funzione `fetchIngredients` è dichiarata lì. Alla riga 30 l'indirizzo è costruito con `import.meta.env.VITE_API_BASE_URL`.
- **Visto:** `frontend/src/IngredientList.test.jsx`, riga 20: `vi.stubEnv('VITE_API_BASE_URL', 'http://api.test/api/v1')`, dentro un `beforeEach` che inizia alla riga 19. Riga 25: `vi.unstubAllEnvs()`, dentro un `afterEach` che inizia alla riga 24. È lo stesso schema del passo 4 e del passo 6.
- **Visto:** `frontend/.env.example`, riga 3: `VITE_API_BASE_URL=http://localhost:8000/api/v1`.
- **Visto:** `frontend/README.md`, riga 29: «Le variabili con prefisso `VITE_` finiscono nel codice che arriva al browser: non metterci segreti.»
- **Visto:** con `Select-String` nella cartella `frontend` del mio `orarium` locale, sui file `src\api\ingredients.js`, `src\IngredientList.test.jsx`, `.env.example` e `README.md`, ho trovato: `async function fetchIngredients` alla riga 25 di `ingredients.js`; `beforeEach(` alla riga 19 e `afterEach(` alla riga 24 di `IngredientList.test.jsx`; `VITE_API_BASE_URL=` alla riga 3 di `.env.example`; la frase «finiscono nel codice che arriva al browser» alla riga 29 di `README.md`. Non ho ancora confrontato queste righe con il repo pubblico al commit `b582ce6`.
- **Visto:** ho eseguito i test del mio `orarium` locale. `IngredientList.test.jsx` passa 12 test: è il file che usa `vi.stubEnv` e `vi.unstubAllEnvs` (righe 20 e 25). `App.test.jsx` passa 1 test. Ci sono anche `Esercizi.test.js` (8 test) e `Componenti.test.jsx` (8 test): sono miei file di esercizi locali, esclusi da git con `.git/info/exclude`. In totale: 29 test in 4 file sul mio computer, di cui 13 in 2 file tracciati. Orarium usa Vitest 5.0.5, il lab usa 5.1.1.

Nel 07 ho visto `stubEnv` cambiare `import.meta.env`. In Orarium il codice legge `import.meta.env.VITE_API_BASE_URL` in `ingredients.js`, e il test cambia la stessa variabile in `IngredientList.test.jsx`. Ora l'ho anche eseguito: il run qui sopra è verde.

Nessuna PR per ora, è una scelta.

## Fonti

- [Vi (vi.stubEnv, vi.unstubAllEnvs)](https://vitest.dev/api/vi)
- [Repo Orarium, commit b582ce6](https://github.com/francesco-cassese/orarium/commit/b582ce6)
