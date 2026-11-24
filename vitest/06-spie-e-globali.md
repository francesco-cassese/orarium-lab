# 06 - Spie e globali

## Teoria

### L'idea in due righe

Nell'esercizio 05 ho creato funzioni finte da zero con `vi.fn()`. Qui faccio due cose diverse: metto una spia su una funzione che esiste già (`vi.spyOn`) e sostituisco una variabile globale, come `fetch` (`vi.stubGlobal`). In tutti e due i casi devo ricordarmi di rimettere le cose a posto alla fine del test.

### Una spia su un metodo

`vi.spyOn(oggetto, 'metodo')` non crea una funzione nuova: avvolge un metodo che esiste già nell'oggetto. Di default il metodo originale continua a funzionare, e io posso osservare ogni chiamata (`toHaveBeenCalledWith`, `toHaveBeenCalledTimes`). Se voglio, posso anche cambiare cosa risponde, per esempio con `mockReturnValue`.

### Lo stato che resta

Un mock si ricorda le chiamate, i valori restituiti e le implementazioni che gli ho dato. Se non lo pulisco tra un test e l'altro, quello che è rimasto finisce nel test dopo. Vitest ha tre livelli di pulizia: `mockClear()` cancella lo storico delle chiamate e dei risultati ma tiene l'implementazione che ho dato; `mockReset()` cancella anche l'implementazione; `mockRestore()` vale per le spie e rimette il metodo originale. Il modo più comodo è `vi.restoreAllMocks()` in un `afterEach`, oppure l'opzione `restoreMocks` nella configurazione.

### Una variabile globale finta

`vi.stubGlobal('nome', valore)` mette il valore dentro `globalThis`, così il codice lo trova come una variabile globale (per esempio `fetch`). Di default Vitest non rimette a posto queste globali: lo fa `vi.unstubAllGlobals()` chiamato a mano, oppure l'opzione `unstubGlobals` nella configurazione.

### In breve

| | Cosa fa |
|---|---|
| `vi.spyOn(oggetto, 'metodo')` | avvolge un metodo che esiste già; l'originale funziona e le chiamate si registrano |
| `spia.mockReturnValue(x)` | sulla spia, fa restituire `x` al posto dell'originale |
| `mockClear()` | cancella storico e risultati, tiene l'implementazione data |
| `mockReset()` | cancella anche l'implementazione data |
| `mockRestore()` | per le spie: rimette il metodo originale |
| `vi.restoreAllMocks()` | rimette a posto tutti i mock, di solito in un `afterEach` |
| `vi.stubGlobal('nome', valore)` | mette il valore in `globalThis` |
| `vi.unstubAllGlobals()` | rimette le globali com'erano |

## Dalla documentazione (parole originali)

- Da [Mock Functions, Spying on Methods](https://vitest.dev/guide/learn/mock-functions): "`vi.spyOn` is different from `vi.fn()` in an important way."; "Instead of creating a brand new function, it wraps an existing method on an object."; "The original implementation still works by default, but you can observe every call and optionally override the behavior:"; "This is particularly useful when you want to verify that your code calls a method correctly without replacing the method's behavior entirely."
- Da [Mock Functions, Resetting Mocks](https://vitest.dev/guide/learn/mock-functions): "Mock functions accumulate state as tests run."; "If you don't reset them between tests, this state can leak and cause confusing failures."; "Vitest provides three levels of cleanup:"; "`mockClear()` clears the recorded call history and return values, but keeps any custom implementation you've set"; "`mockReset()` does everything `mockClear` does, and also removes any custom implementation, returning the mock to its default state"; "`mockRestore()` is specifically for spies created with `vi.spyOn`. It restores the original object method, effectively undoing the spy. On `vi.fn()` mocks, it behaves the same as `mockReset`"; "In practice, the easiest approach is to restore all mocks automatically after each test:"; "Even better, you can configure this globally with the `restoreMocks` option so you don't need the `afterEach` at all:"
- Da [Mocking Globals](https://vitest.dev/guide/mocking/globals): "You can mock global variables that are not present with `jsdom` or `node` by using `vi.stubGlobal` helper."; "It will put the value of the global variable into a `globalThis` object."; "By default, Vitest does not reset these globals, but you can turn on the `unstubGlobals` option in your config to restore the original values after each test or call `vi.unstubAllGlobals()` manually."

## Con parole mie

### 1. Spia e funzione finta

> Che differenza c'è tra `vi.spyOn` e `vi.fn()`? Cosa succede al metodo originale quando metto una spia?

**Risposta:** `vi.fn()` crea una funzione nuova. `vi.spyOn` invece prende un metodo che esiste già in un oggetto e lo avvolge. Il metodo originale continua a funzionare, e io posso vedere ogni chiamata.

- **Visto:** nel passo 2, con la spia su `prezzoAlChilo`, `costo('farina', 3)` vale `6`, e la spia registra la chiamata con `'farina'` una volta.
- **Dalla pagina:** «`vi.spyOn` is different from `vi.fn()` in an important way.»; «Instead of creating a brand new function, it wraps an existing method on an object.»

### 2. Cambiare cosa risponde la spia

> Come posso osservare le chiamate a un metodo senza cambiarlo? E come lo faccio rispondere in un altro modo?

**Risposta:** Creo la spia con `vi.spyOn(oggetto, 'metodo')` e la lascio com'è: così il metodo continua a fare il suo lavoro, e io controllo le chiamate con `toHaveBeenCalledWith` o `toHaveBeenCalledTimes`. Se voglio che risponda in un altro modo, uso `spia.mockReturnValue(x)`.

- **Visto:** nel passo 3, con `spia.mockReturnValue(10)`, `costo('farina', 3)` vale `30`.
- **Dalla pagina:** «The original implementation still works by default, but you can observe every call and optionally override the behavior:».

### 3. I tre livelli di pulizia

> Che differenza c'è tra `mockClear`, `mockReset` e `mockRestore`?

**Risposta:** `mockClear` cancella solo lo storico delle chiamate e i risultati, e tiene l'implementazione che ho dato. `mockReset` cancella anche l'implementazione. `mockRestore`, per una spia, rimette il metodo originale.

- **Visto:** nel passo 5, dopo `mockClear` lo storico è vuoto e `finta()` vale ancora `7`. Dopo `mockReset` su una `vi.fn()` con `mockReturnValue(7)`, `finta()` vale `undefined`. Su una spia, `mockRestore` e `mockReset` riportano `prezzoAlChilo('farina')` a `2`.
- **Dalla pagina:** «`mockClear()` clears the recorded call history and return values, but keeps any custom implementation you've set»; «`mockReset()` does everything `mockClear` does, and also removes any custom implementation, returning the mock to its default state»; «`mockRestore()` is specifically for spies created with `vi.spyOn`.».

### 4. Perché pulire tra un test e l'altro

> Cosa può andare storto se non pulisco i mock tra un test e l'altro? Come lo evito senza ripeterlo in ogni test?

**Risposta:** Lo stato di un mock resta da un test all'altro: le chiamate del test prima finiscono nel test dopo, e il risultato può dipendere dall'ordine dei test. Per evitarlo posso chiamare `vi.restoreAllMocks()` in un `afterEach`, oppure impostare `restoreMocks` nella configurazione, così non lo ripeto in ogni test.

- **Visto:** nel passo 4, il terzo test ha trovato la spia del secondo ancora attiva: `costo('farina', 3)` valeva `30` invece di `6`. Con `afterEach(() => { vi.restoreAllMocks() });` il terzo test è passato.
- **Dalla pagina:** «If you don't reset them between tests, this state can leak and cause confusing failures.»; «Even better, you can configure this globally with the `restoreMocks` option so you don't need the `afterEach` at all:».
- **Dedotto:** il risultato di un test può dipendere dall'ordine dei test, se lo stato dei mock resta da un test all'altro. È una mia deduzione.

### 5. Sostituire una globale

> Cosa fa `vi.stubGlobal` e quando mi serve?

**Risposta:** `vi.stubGlobal('nome', valore)` mette il valore dentro `globalThis`, così il codice lo trova come variabile globale. Mi serve quando il codice usa una globale come `fetch` e io non voglio che faccia una richiesta vera.

- **Visto:** nel passo 6, con `vi.stubGlobal('fetch', fetchFinto)`, `leggiIngrediente(1)` chiama la finta con `'/api/ingredients/1'` e restituisce `{ id: 1, nome: 'farina' }`.
- **Dalla pagina:** «You can mock global variables that are not present with `jsdom` or `node` by using `vi.stubGlobal` helper.»; «It will put the value of the global variable into a `globalThis` object.».
- **Dedotto:** lo userei per sostituire una globale come `fetch`, così il codice non fa una richiesta vera. È un uso che deduco: la pagina non lo dice.

### 6. Rimettere a posto le globali

> Le globali sostituite con `vi.stubGlobal` tornano da sole com'erano? Come le rimetto a posto?

**Risposta:** No: di default Vitest non le rimette a posto da solo. Le rimetto a posto chiamando `vi.unstubAllGlobals()`, per esempio in un `afterEach`, oppure con l'opzione `unstubGlobals` nella configurazione.

- **Visto:** nel passo 7, senza `vi.unstubAllGlobals()` il secondo test trova `fetch` ancora mock. Con `afterEach(() => { vi.unstubAllGlobals() });` il secondo test passa.
- **Dalla pagina:** «By default, Vitest does not reset these globals, but you can turn on the `unstubGlobals` option in your config to restore the original values after each test or call `vi.unstubAllGlobals()` manually.»

## Esercizio: la traccia

Lavoro in `vitest/06-spie`, dentro il lab.
Non tocco la cartella `orarium`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un test rosso di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio ho usato `pnpm exec vitest run`.

### Passo 1: preparare la cartella

- Comando: `mkdir ..\06-spie` e `Set-Location ..\06-spie`, poi `pnpm init`, poi `pnpm add -D vitest`; poi imposto lo script `test` a `vitest run` e controllo con `Select-String`.
- Cosa ho visto: `mkdir` ha creato la cartella `06-spie` in `vitest` (output `d-----`). `Set-Location` mi ha portato dentro `06-spie`: il prompt ora è `vitest\06-spie`.
- `pnpm init` ha scritto `package.json` con nome `06-spie`, `"type": "module"` e lo script `test` con `echo "Error: no test specified" && exit 1`. `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.1` in `devDependencies`, in 829 millisecondi.
- Controllo con `Select-String` su `package.json`: `"test": "vitest run"` alla riga 7 e `"vitest": "^5.1.1"` alla riga 21.
- Cosa ho concluso: la cartella è pronta, con Vitest 5.1.1 e lo script `test` impostato a `vitest run`.

### Passo 2: una spia su un metodo

- Scrivo `spie.test.js`: creo `const spia = vi.spyOn(listino, 'prezzoAlChilo')`, chiamo `costo('farina', 3)` e controllo che valga `6`, poi controllo la spia con `toHaveBeenCalledWith('farina')` e `toHaveBeenCalledTimes(1)`.
- Scrivo anche i file di supporto. `listino.js` contiene un oggetto `listino` con il metodo `prezzoAlChilo(nome)`, che restituisce `2` per la farina e `5` per gli altri. `costo.js` contiene `costo(nome, chili)`, che moltiplica `listino.prezzoAlChilo(nome)` per i chili.
- Run 1, errore mio (rosso accidentale). Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, fallito: «una spia lascia funzionare il metodo e registra la chiamata». Il messaggio dice `TypeError: 5 is not a spy or a call to a spy!`, alla riga 9, colonna 20, su `expect(spia()).toHaveBeenCalledWith('farina')`.
  - Cosa ho concluso: avevo scritto `spia()` con le parentesi, cioè la spia è stata chiamata e `expect` ha ricevuto il valore restituito (`5`), non la spia. `toHaveBeenCalledWith` vuole la spia stessa, senza parentesi.
- Run 2. Comando: `pnpm exec vitest run`, dopo aver tolto le parentesi: `expect(spia).toHaveBeenCalledWith('farina')`.
  - Cosa ho visto: 1 test, verde («Tests 1 passed»).
  - Cosa ho concluso: la spia lascia funzionare `prezzoAlChilo`, `costo` restituisce `6`, e la chiamata con `'farina'` viene registrata una volta.
- Run 3, controllo fatto apposta: `toHaveBeenCalledWith('burro')`. Comando: `pnpm exec vitest run`.
  - Cosa ho visto: 1 test, fallito, alla riga 9, colonna 18. Il messaggio dice `AssertionError: expected "prezzoAlChilo" to be called with arguments: [ 'burro' ]`, poi `1st prezzoAlChilo call`, con `- "burro"` (il valore che ho scritto) e `+ "farina"` (il valore ricevuto). `Number of calls: 1`.
  - Cosa ho concluso: la spia registra il nome del metodo, `prezzoAlChilo`, e l'argomento che la funzione ha ricevuto davvero, `'farina'`.

### Passo 3: cambiare cosa risponde la spia

- Scrivo un secondo test, «una spia può restituire un altro valore»: creo `const spia = vi.spyOn(listino, 'prezzoAlChilo')`, poi `spia.mockReturnValue(10)`, e controllo che `costo('farina', 3)` valga `30`.
- Run 4. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, tutti verdi («Tests 2 passed»).
  - Cosa ho concluso: con `mockReturnValue(10)` la spia fa restituire `10` a `prezzoAlChilo`, e `costo` moltiplica per `3`: il risultato è `30`.
- Run 5, controllo fatto apposta: `toBe(6)` al posto di `toBe(30)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, 1 fallito, «una spia può restituire un altro valore», alla riga 18, colonna 32. Il messaggio dice `AssertionError: expected 30 to be 6 // Object.is equality`, con `- 6` (il valore che ho scritto) e `+ 30` (il valore ricevuto).
  - Cosa ho concluso: il `6` era il valore del prezzo vero della farina; con la spia che risponde `10` il risultato è `30`.

### Passo 4: lo stato che resta tra un test e l'altro

- Scrivo un terzo test, «senza spia, costo usa il listino vero», senza `vi.spyOn`, che controlla `costo('farina', 3)` uguale a `6`.
- Run 6. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 3 test, 1 fallito: «senza spia, costo usa il listino vero», alla riga 23, colonna 32. Il messaggio dice `AssertionError: expected 30 to be 6 // Object.is equality`, con `- 6` (il valore che ho scritto) e `+ 30` (il valore ricevuto).
  - Cosa ho concluso: la spia del secondo test, con `mockReturnValue(10)`, è ancora attiva nel terzo test: non l'ho ripristinata. Per questo `costo` restituisce `30` e non il `6` del listino vero.
- Run 7, dopo aver aggiunto in cima al file `afterEach(() => { vi.restoreAllMocks() });`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 3 test, tutti verdi («Tests 3 passed»).
  - Cosa ho concluso: `vi.restoreAllMocks()` dopo ogni test rimette a posto la spia, e il terzo test torna a usare il listino vero (`6`).

### Passo 5: i tre livelli di pulizia

- Scrivo un quarto test, «mockClear cancella lo storico e tiene il valore»: `const finta = vi.fn().mockReturnValue(7)`, una chiamata a `finta()`, poi `finta.mockClear()`, e controllo che `toHaveBeenCalledTimes(0)` e che `finta()` valga `7`.
- Run 8, errore mio (rosso accidentale): le righe 33 e 34 erano scambiate. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 4 test, 1 fallito: «mockClear cancella lo storico e tiene il valore», alla riga 33, colonna 21. Il messaggio dice `TypeError: 7 is not a spy or a call to a spy!`, su `expect(finta()).toHaveBeenCalledTimes(0)`.
  - Cosa ho concluso: alla riga 33 avevo `finta()` con le parentesi dentro `toHaveBeenCalledTimes`: il valore restituito (`7`) è finito in `expect` al posto della funzione.
- Run 9, dopo aver rimesso le righe nell'ordine giusto e tolto le parentesi da `expect(finta)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 4 test, tutti verdi («Tests 4 passed»).
  - Cosa ho concluso: dopo `mockClear` lo storico è vuoto (`0` chiamate), e `finta()` restituisce ancora `7`: il valore è rimasto, lo storico no.
- Run 10, dopo aver aggiunto il quinto test, «mockReset cancella anche il valore» (`vi.fn().mockReturnValue(7)`, una chiamata, poi `finta.mockReset()`, controllo `toHaveBeenCalledTimes(0)` e `finta()` uguale a `undefined`) e il sesto, «mockRestore rimette il metodo originale» (`vi.spyOn(listino, 'prezzoAlChilo').mockReturnValue(10)`, poi `spia.mockRestore()`, controllo `listino.prezzoAlChilo('farina')` uguale a `2`). Comando: `pnpm exec vitest run`
  - Cosa ho visto: 6 test, tutti verdi («Tests 6 passed»).
  - Cosa ho concluso: `mockReset` cancella anche il valore, quindi il mock torna a restituire `undefined`; `mockRestore` rimette il metodo originale, e il listino torna a dare `2` per la farina.
- Run 11, controllo fatto apposta: `finta.mockClear()` al posto di `finta.mockReset()` nel quinto test. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 6 test, 1 fallito: «mockReset cancella anche il valore», alla riga 42, colonna 21. Il messaggio dice `AssertionError: expected 7 to be undefined`, con `- undefined` (il valore che ho scritto) e `+ 7` (il valore ricevuto).
  - Cosa ho concluso: `mockClear` tiene il valore `7`; a cancellarlo è solo `mockReset`.
- Run 12, dopo aver ripristinato `finta.mockReset()` nel quinto test e aggiunto il settimo test, «mockReset su una spia»: la spia di `prezzoAlChilo` con `mockReturnValue(10)`, poi `spia.mockReset()`, e controllo che `listino.prezzoAlChilo('farina')` valga `2`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 7 test, tutti verdi («Tests 7 passed»).
  - Cosa ho concluso: su una spia, `mockReset` riporta il metodo al comportamento originale (`2` per la farina), non a `undefined`. Nel caso che ho provato, con `mockReturnValue(10)` e poi `mockReset()`, il valore torna quello del listino vero.

### Passo 6: una funzione globale finta

- Scrivo `globali.test.js`: creo `fetchFinto` con `vi.fn().mockResolvedValue({ json: async () => ({ id: 1, nome: 'farina' }) })`, poi `vi.stubGlobal('fetch', fetchFinto)`. Chiamo `leggiIngrediente(1)` di `rete.js` e controllo che il risultato sia `{ id: 1, nome: 'farina' }`, e che `fetchFinto` sia stato chiamato con `'/api/ingredients/1'`.
- Scrivo anche `rete.js`, con `leggiIngrediente(id)`: chiama `fetch` con `/api/ingredients/${id}` e restituisce `risposta.json()`.
- Run 13. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 8 test, tutti verdi («Tests 8 passed»): `spie.test.js (7 tests)` e `globali.test.js (1 test)`.
  - Cosa ho concluso: con `vi.stubGlobal` la finta prende il posto di `fetch`, e il test passa con l'indirizzo `/api/ingredients/1`.
- Run 14, controllo fatto apposta: atteso `'/api/ingredients/2'`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 8 test, 1 fallito: «con fetch finto, leggiIngrediente restituisce un ingrediente», alla riga 11, colonna 24. Il messaggio dice `AssertionError: expected "vi.fn()" to be called with arguments: [ '/api/ingredients/2' ]`, poi `1st vi.fn() call`, con `- "/api/ingredients/2"` (il valore che ho scritto) e `+ "/api/ingredients/1"` (il valore ricevuto). `Number of calls: 1`. Il risultato finale è «Tests 1 failed | 7 passed (8)».
  - Cosa ho concluso: la finta registra l'indirizzo costruito con l'id passato, cioè `1`. Il test è arrivato alla riga 11, quindi il `toEqual` della riga 10 è passato: `leggiIngrediente` ha restituito il valore letto da `json()` finto.

### Passo 7: rimettere a posto le globali

- Aggiungo a `globali.test.js` un secondo test, «dopo il primo test, fetch è ancora quella finta?», senza `vi.stubGlobal`, che controlla `expect(fetch.mock).toBeUndefined()`. Non ho ancora chiamato `vi.unstubAllGlobals()`.
- Run 15. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 9 test, 1 fallito: «dopo il primo test, fetch è ancora quella finta?», alla riga 15, colonna 24. Il messaggio dice `AssertionError: expected { calls: [], contexts: [], …(5) } to be undefined`, con `- Expected: undefined` e `+ Received:` che mostra un oggetto con `"calls": []`. Il primo test è passato. Il risultato finale è «Tests 1 failed | 8 passed (9)».
  - Cosa ho concluso: dopo il primo test, `fetch` è ancora un mock: ha la proprietà `mock`. Il test non l'ha ripristinato da solo. Non ho ancora verificato se è la stessa finta del primo test: lo storico è vuoto, e questo test non chiama `fetch`.
  - Osservazione: nell'oggetto ricevuto `calls` è `[]`, anche se il primo test aveva chiamato `fetchFinto` una volta. La finta è rimasta, ma lo storico delle sue chiamate è vuoto. Non so perché.
- Run 16, dopo aver messo `afterEach(() => { vi.unstubAllGlobals() });` in cima a `globali.test.js`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 9 test, tutti verdi («Tests 9 passed»): `globali.test.js (2 tests)` e `spie.test.js (7 tests)`. In questa run `globali.test.js` è comparso prima di `spie.test.js`.
  - Cosa ho concluso: con `vi.unstubAllGlobals()` dopo ogni test, `fetch` torna a non essere la finta, e il secondo test passa.
- Run 17, finale. Comando: `pnpm test`, poi `$LASTEXITCODE`.
  - Cosa ho visto: `Test Files 2 passed (2)`, `Tests 9 passed (9)`, codice di uscita 0.
  - Cosa ho concluso: l'esercizio è verde con lo script `test`, su tutti e due i file.

## Dopo l'esercizio

### Cosa ho fatto

- Ho preparato la cartella `06-spie` con Vitest 5.1.1 e lo script `test`.
- Ho scritto `spie.test.js` (7 test) con `vi.spyOn`, `mockReturnValue`, `mockClear`, `mockReset`, `mockRestore` e `afterEach` con `vi.restoreAllMocks()`.
- Ho scritto `globali.test.js` (2 test) con `vi.stubGlobal('fetch', ...)` e `afterEach` con `vi.unstubAllGlobals()`.
- Ho scritto i file di supporto `listino.js`, `costo.js` e `rete.js`.
- Comandi usati, già nel diario [comandi.md](comandi.md): `mkdir`, `Set-Location`, `pnpm init`, `pnpm add -D vitest`, `Select-String`, `pnpm exec vitest run`, `pnpm test`, `$LASTEXITCODE`.

### Cosa ho visto

- La spia lascia funzionare il metodo originale, e il messaggio di errore usa il nome del metodo (passo 2);
- Una spia può cambiare cosa risponde (passo 3);
- Lo stato di una spia resta nei test successivi senza `vi.restoreAllMocks()` (passo 4);
- Cosa fanno `mockClear`, `mockReset` e `mockRestore` (passo 5);
- `mockReset` su una spia ha riportato il valore originale (passo 5);
- `vi.stubGlobal` sostituisce `fetch` e resta nei test dopo, finché non c'è `vi.unstubAllGlobals()` (passi 6 e 7);
- `calls: []` nel secondo test e l'ordine dei file che cambia: sono osservazioni senza spiegazione (passo 7).

### Cosa ho verificato

Conteggi run per run, in ordine. Le run rosse sono indicate come accidentali o di controllo.

- Run 1 (passo 2): 1 test, rosso accidentale (`expect(spia())`).
- Run 2 (passo 2): 1 test, verde.
- Run 3 (passo 2): 1 test, rosso di controllo (`'burro'`).
- Run 4 (passo 3): 2 test, verdi.
- Run 5 (passo 3): 2 test, rosso di controllo (`toBe(6)`).
- Run 6 (passo 4): 3 test, rosso (stato rimasto dal secondo test).
- Run 7 (passo 4): 3 test, verdi.
- Run 8 (passo 5): 4 test, rosso accidentale (righe 33 e 34 scambiate).
- Run 9 (passo 5): 4 test, verdi.
- Run 10 (passo 5): 6 test, verdi.
- Run 11 (passo 5): 6 test, rosso di controllo (`mockClear` al posto di `mockReset`).
- Run 12 (passo 5): 7 test, verdi.
- Run 13 (passo 6): 8 test, verdi.
- Run 14 (passo 6): 8 test, rosso di controllo (`/api/ingredients/2`).
- Run 15 (passo 7): 9 test, rosso (`fetch.mock`).
- Run 16 (passo 7): 9 test, verdi.
- Run 17 (finale): `pnpm test`, 2 file, 9 test verdi, `$LASTEXITCODE` 0.

### Cosa ho dedotto e non ancora verificato

- Il risultato di un test può dipendere dall'ordine dei test (domanda 4). È una deduzione: non ho provato un caso in cui l'ordine cambi il risultato.
- Lo userei per sostituire `fetch` nei test, così il codice non fa richieste vere (domanda 5). La pagina non lo dice, e non ho provato altri usi.
- Nella run 1 (passo 2) il `5` probabilmente viene dal metodo originale chiamato con `undefined`, perché `expect(spia())` chiama la spia senza argomenti. È una deduzione dal codice, non l'ho provata.

### Domande aperte

- Perché nel secondo test lo storico delle chiamate della fetch finta è vuoto?
- Perché l'ordine dei due file cambia da una run all'altra?
- Come funzionano `vi.stubEnv` e `vi.unstubAllEnvs`, che `IngredientList.test.jsx` usa in Orarium?

### Applicazione in Orarium

Ho controllato i file di test e `vite.config.js` nel mio `orarium` locale, e le righe coincidono con quelle del repo pubblico al commit `b582ce6`. Sono fatti letti nel codice, non idee. Non ho cambiato nulla in `orarium`.

- **Visto:** `IngredientList.test.jsx`, riga 21: `vi.stubGlobal('fetch', vi.fn())` dentro un `beforeEach`; riga 26: `vi.unstubAllGlobals()` dentro un `afterEach`. È lo stesso schema del passo 7.
- **Visto:** `App.test.jsx`: `vi.stubGlobal(` alla riga 7, `vi.unstubAllGlobals()` alla riga 14.
- **Visto:** `vite.config.js`, blocco `test`: ha solo `environment: 'jsdom'` e `setupFiles: './src/test/setup.js'`. Non ci sono `restoreMocks`, `unstubGlobals` né `clearMocks`.
- **Visto:** `src/test/setup.js` ha un `afterEach` con `cleanup()` di React Testing Library, non un mock.
- **Visto:** `Componenti.test.jsx` usa `vi.stubGlobal` (righe 105 e 133) e `vi.unstubAllGlobals()` (riga 101), ma esiste solo sul mio computer, quindi non lo conto come lavoro di Orarium.
- **Visto:** nel repo non compaiono `vi.spyOn` né `vi.restoreAllMocks`.
- **Visto:** `IngredientList.test.jsx` usa anche `vi.stubEnv('VITE_API_BASE_URL', ...)` alla riga 20 e `vi.unstubAllEnvs()` alla riga 25: non l'ho ancora studiato.
- **Visto:** `fetchIngredients` (`api/ingredients.js`, riga 25) non ha un test diretto: viene provata solo attraverso `IngredientList.jsx` (riga 20).

Non nasce nessuna PR da questo esercizio, per scelta: il test diretto di `fetchIngredients` serve anche `vi.stubEnv`, che non ho ancora studiato. Decido dopo l'esercizio sulle variabili d'ambiente.

## Fonti

- [Mock Functions](https://vitest.dev/guide/learn/mock-functions)
- [Mocking Globals](https://vitest.dev/guide/mocking/globals)
- [Repo Orarium, commit b582ce6](https://github.com/francesco-cassese/orarium/commit/b582ce6)
