# 05 - Funzioni finte

## Teoria

### L'idea in due righe

Quando provo del codice, a volte dipende da qualcosa che non voglio usare davvero: una richiesta di rete lenta, un errore difficile da provocare. Al posto della cosa vera metto una funzione finta, un mock: decido io cosa risponde e, dopo, posso controllare come è stata chiamata.
In Vitest i mock si creano con l'oggetto `vi`; in questo esercizio uso solo `vi.fn()`.

### Creare un mock con `vi.fn()`

`vi.fn()` crea una funzione che, di default, non fa niente e restituisce `undefined`, ma registra ogni chiamata. Posso chiederle se è stata chiamata (`toHaveBeenCalled`) e quante volte (`toHaveBeenCalledTimes`).

### Decidere cosa restituisce

`mockReturnValue(x)` fa restituire sempre `x`. `mockReturnValueOnce(x)` lo fa restituire solo una volta, poi il mock torna a come era prima. Per le funzioni asincrone ci sono `mockResolvedValue` e `mockRejectedValue`: il mock restituisce una promessa risolta o rifiutata. La pagina avverte che `mockReturnValue` restituisce lo stesso valore qualunque argomento riceva il mock.

### Dare al mock un comportamento

Quando il mock deve fare qualcosa con gli argomenti, con `mockImplementation` gli do una funzione al posto di quella vera. La scorciatoia è passarla direttamente a `vi.fn(...)`.

### Guardare come è stato chiamato

Il mock si ricorda ogni chiamata. Posso controllare quante sono state (`toHaveBeenCalledTimes`), con quali argomenti (`toHaveBeenCalledWith`), gli argomenti di una chiamata precisa (`toHaveBeenNthCalledWith`, dove la prima è la numero 1) e dell'ultima (`toHaveBeenLastCalledWith`). I dati grezzi stanno in `.mock.calls` (gli argomenti di ogni chiamata) e in `.mock.results` (cosa ha restituito o lanciato).

### Il trabocchetto: riferimenti, non copie

`.mock.calls` conserva i riferimenti agli argomenti, non copie. Se passo un oggetto al mock e poi lo modifico, la chiamata registrata mostra l'oggetto già modificato. La pagina propone due rimedi: copiare l'oggetto al momento della chiamata (con `mockImplementation` e `structuredClone`), oppure fare il controllo prima della modifica.

**Analogia (mia, non della documentazione): il garzone finto.**

Metto al banco un garzone finto: non prepara niente, ma segna su un quaderno ogni ordine che riceve, e sono io a decidere cosa risponde. Alla fine leggo il quaderno per sapere se il mio codice ha ordinato quello che doveva. Il quaderno segna il foglio che gli ho dato, non una fotocopia: se dopo cambio il foglio, il quaderno mostra il foglio cambiato.
Dove l'analogia si ferma: il garzone finto non dimostra che quello vero funzioni. Il mock controlla il mio codice, non la cosa che ho sostituito.

### In breve

| | Cosa fa |
|---|---|
| `vi.fn()` | crea una funzione finta che restituisce `undefined` e registra le chiamate |
| `mockReturnValue(x)` | la funzione finta restituisce sempre `x` |
| `mockReturnValueOnce(x)` | la restituisce una volta sola, poi torna a come era |
| `mockResolvedValue(x)` / `mockRejectedValue(e)` | la funzione finta restituisce una promessa risolta con `x` o rifiutata con `e` |
| `mockImplementation(fn)` | la funzione finta esegue `fn` al posto di quella vera |
| `toHaveBeenCalledTimes(n)` | controlla quante volte è stata chiamata |
| `toHaveBeenCalledWith(a, b)` | controlla che almeno una chiamata abbia avuto quegli argomenti |
| `.mock.calls` / `.mock.results` | gli argomenti e i risultati di ogni chiamata, da leggere a mano |

## Dalla documentazione (parole originali)

- Da [Mock Functions](https://vitest.dev/guide/learn/mock-functions): "When writing tests, you often need to replace a real function or module with a controlled version. This is called mocking."; "Mock functions let you control what a dependency returns, observe how it was called, and isolate the code under test from side effects."; "Vitest provides mocking utilities through the `vi` object."
- Da [Mock Functions, Creating Mock Functions](https://vitest.dev/guide/learn/mock-functions): "The simplest way to create a mock is with `vi.fn()`."; "This gives you a function that does nothing by default (returns `undefined`), but tracks every call made to it:"
- Da [Mock Functions, Mock Return Values](https://vitest.dev/guide/learn/mock-functions): "A mock that always returns `undefined` isn't very useful on its own."; "You'll usually want to control what it returns so you can test how your code reacts to different values:"; "If the function you're mocking is async, use `mockResolvedValue` and `mockRejectedValue` to control the promise outcome:"; "`mockReturnValue` always returns the same value regardless of the arguments the mock receives."
- Da [Mock Functions, Mock Implementation](https://vitest.dev/guide/learn/mock-functions): "`mockImplementation` lets you provide a full replacement function:"; "As a shorthand, you can pass the implementation directly to `vi.fn()`:"
- Da [Mock Functions, Inspecting Calls](https://vitest.dev/guide/learn/mock-functions): "One of the most powerful things about mock functions is that they remember every call made to them."; "You can assert on how many times a function was called, what arguments it received, and what it returned:"; "The `.mock` property gives you full access to the call history."; "In addition to `.mock.calls`, you can also inspect `.mock.results` to see what the mock returned (or threw) on each call:"
- Da [Mock Functions, Inspecting Calls (avviso)](https://vitest.dev/guide/learn/mock-functions): "`.mock.calls` stores references to the arguments, not copies."; "If you pass an object to a mock and then mutate it afterwards, the recorded call will reflect the mutated state, not the state at the time of the call:"; "If you need to assert on the original values, you can use `mockImplementation` to capture a clone at call time:"; "Alternatively, you can make your assertion before the mutation happens."

## Con parole mie

### 1. Cos'è un mock

> Cos'è un mock e perché si usa? Cosa fa `vi.fn()` appena lo creo, senza altro?

**Risposta:** Un mock è semplicemente una funzione finta che uso per poter testare il mio codice senza dipendere da una richiesta di rete lenta, o da un errore difficile da provocare. Appena creato con `vi.fn()`, il mock non fa niente e restituisce `undefined`, ma registra ogni chiamata che riceve.

- **Visto:** passo 2: `expect(finta()).toBeUndefined()` passa, e le chiamate registrate erano due.
- **Dalla pagina:** «When writing tests, you often need to replace a real function or module with a controlled version. This is called mocking.»; «This gives you a function that does nothing by default (returns `undefined`), but tracks every call made to it:».

### 2. Decidere cosa restituisce

> Che differenza c'è tra `mockReturnValue` e `mockReturnValueOnce`? Cosa uso se la funzione che sostituisco è asincrona?

**Risposta:** `mockReturnValue(x)` fa restituire sempre `x`. `mockReturnValueOnce(x)` lo fa restituire solo la prima volta; dalla seconda il mock torna a com'era prima. Se la funzione che sostituisco è asincrona, uso `mockResolvedValue(x)` per una promessa risolta, o `mockRejectedValue(e)` per una promessa rifiutata.

- **Visto:** passo 3: con `mockReturnValue(10)` ogni chiamata restituisce `10`; dopo `mockReturnValueOnce(20)` la chiamata successiva restituisce `20`. Passo 4: con `mockResolvedValue({ nome: 'farina' })`, `await leggiIngrediente()` dà l'oggetto, e con `mockRejectedValue` il `rejects.toThrow` passa.
- **Dalla pagina:** «`mockReturnValue` always returns the same value regardless of the arguments the mock receives.»; «If the function you're mocking is async, use `mockResolvedValue` and `mockRejectedValue` to control the promise outcome:».

### 3. Dare un comportamento al mock

> Quando mi serve `mockImplementation` invece di un valore fisso?

**Risposta:** Mi serve quando il mock deve fare qualcosa in base agli argomenti che riceve. Un valore fisso con `mockReturnValue` va bene se la risposta è sempre la stessa. Con `mockImplementation` do al mock una funzione intera al posto di quella vera.

- **Visto:** passo 5: con `mockImplementation` il mock `costo` moltiplica i due argomenti (`costo(2, 3)` vale `6`, `costo(10, 3)` vale `30`). Con `mockReturnValue(6)` al posto di `mockImplementation`, `costo(10, 3)` fallisce, perché restituisce sempre `6`.
- **Dalla pagina:** «`mockImplementation` lets you provide a full replacement function:»; «As a shorthand, you can pass the implementation directly to `vi.fn()`:».

### 4. Guardare le chiamate

> Che cosa posso controllare di un mock dopo che è stato chiamato? Cosa mi dicono `.mock.calls` e `.mock.results`?

**Risposta:** Posso controllare quante volte è stato chiamato, con quali argomenti, e cosa ha restituito. `.mock.calls` mi dice gli argomenti di ogni chiamata. `.mock.results` mi dice cosa ha restituito o lanciato ogni chiamata.

- **Visto:** passo 6: con due chiamate a `controllaScorta` il mock risulta chiamato due volte, con gli argomenti di ciascuna chiamata; `.mock.results` registra per ciascuna chiamata `{ type: 'return', value: undefined }`.
- **Dalla pagina:** «You can assert on how many times a function was called, what arguments it received, and what it returned:»; «In addition to `.mock.calls`, you can also inspect `.mock.results` to see what the mock returned (or threw) on each call:».

### 5. Il trabocchetto dei riferimenti

> Se passo un oggetto a un mock e poi lo modifico, cosa vedo nella chiamata registrata? Come posso evitarlo?

**Risposta:** Vedo l'oggetto già modificato, perché `.mock.calls` tiene un riferimento all'oggetto, non una copia. Per evitarlo posso fare il controllo prima della modifica, oppure salvare una copia al momento della chiamata con `mockImplementation`.

- **Visto:** passo 7: dopo aver modificato `ordine.quantita`, la chiamata registrata mostra `quantita: 2`, e il controllo fatto dopo la modifica fallisce. Se il controllo viene fatto prima della modifica, passa. Con `structuredClone` dentro `mockImplementation`, la copia salvata vale `{ quantita: 1 }`, mentre `registra.mock.calls[0][0].quantita` vale `2`.
- **Dalla pagina:** «`.mock.calls` stores references to the arguments, not copies.»; «If you need to assert on the original values, you can use `mockImplementation` to capture a clone at call time:»; «Alternatively, you can make your assertion before the mutation happens.»

### 6. Un mock che non restituisce niente

> A cosa serve un mock che non restituisce niente? Cosa controllo, in quel caso?

**Risposta:** Serve quando il codice chiama una funzione e non mi interessa il suo risultato, ma voglio sapere che l'ha chiamata. In quel caso controllo che sia stata chiamata, quante volte e con quali argomenti.

- **Visto:** passo 6: con `controllaScorta` e `avvisa` (un mock senza valore di ritorno) il test controlla quante volte e con quali argomenti è stato chiamato, e passa.
- **Dalla pagina:** «Mock functions let you control what a dependency returns, observe how it was called, and isolate the code under test from side effects.»

## Esercizio: la traccia

Lavoro in `vitest/05-finte`, dentro il lab. Tutti i file di codice li scrivo io, da capo.
Non tocco la cartella `orarium`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un test rosso di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio ho usato `pnpm exec vitest run`.

### Passo 1: preparare la cartella

- Comando: `mkdir ..\05-finte` e `Set-Location ..\05-finte`, poi `pnpm init`, poi `pnpm add -D vitest`, dentro `vitest/05-finte`; poi imposto lo script `test` del `package.json` a `vitest run`; poi controllo il `package.json` con `Select-String`.
- Cosa ho visto: `mkdir` ha creato la cartella `05-finte` (output `d-----`, nome `05-finte`). `pnpm init` ha scritto `package.json` con nome `05-finte`, `"type": "module"` e lo script `test` con `echo "Error: no test specified" && exit 1`. `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.1` in `devDependencies`, in 870 millisecondi. Il controllo con `Select-String` mostra `"test": "vitest run"` alla riga 7 e `"vitest": "^5.1.1"` tra le dipendenze.
- Cosa ho concluso: la cartella è pronta, con Vitest 5.1.1 installato come dipendenza di sviluppo e lo script `test` impostato a `vitest run`.

### Passo 2: un mock e le sue chiamate

- Scrivo `finte.test.js` con un test che crea `const finta = vi.fn()` e controlla con `expect(finta).toHaveBeenCalled()` e `expect(finta).toHaveBeenCalledTimes(1)`, senza chiamare `finta`, per dimenticanza: non era un rosso previsto.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 1 test, fallito: «crea la prima chiamata mock». Il messaggio dice `AssertionError: expected "vi.fn()" to be called at least once`, alla riga 5, colonna 19, su `expect(finta).toHaveBeenCalled()`.
- Cosa ho concluso: il mock appena creato non è stato chiamato, quindi `toHaveBeenCalled` fallisce per primo. La riga con `toHaveBeenCalledTimes(1)` non arriva a essere eseguita.
- Poi ho aggiunto la chiamata `finta();` prima dei due controlli, e ho rilanciato `pnpm exec vitest run`: 1 test, verde («Tests 1 passed»).
- Cosa ho concluso: con una chiamata al mock, `toHaveBeenCalled` e `toHaveBeenCalledTimes(1)` passano entrambi.
- Poi ho aggiunto, in fondo al test, `expect(finta()).toBeUndefined();` e `expect(finta).toHaveBeenCalledTimes(2);`, e ho rilanciato `pnpm exec vitest run`: 1 test passato («Tests 1 passed»).
  - Cosa ho concluso: `finta()` restituisce `undefined`, e le chiamate registrate sono due: quella della riga 5 e quella della riga 8, dentro `expect(finta())`.
- Poi ho cambiato la riga 9 da `toHaveBeenCalledTimes(2)` a `toHaveBeenCalledTimes(1)`, e ho rilanciato `pnpm exec vitest run`: 1 test fallito, alla riga 9, colonna 19. Il messaggio dice `AssertionError: expected "vi.fn()" to be called 1 times, but got 2 times`.
  - Cosa ho concluso: le chiamate registrate erano due, perché la seconda l'ho fatta dentro `expect(finta())` alla riga 8.

### Passo 3: cosa restituisce un mock

- Scrivo un secondo test con `const scorta = vi.fn().mockReturnValue(10)`, e controllo `scorta()` con `toBe(10)`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 2 test, tutti passati («Tests 2 passed»). Il secondo si chiamava «il valore di scorta deve essere 10».
- Versione con `scorta.mockReturnValueOnce(20)`: controllo che la chiamata successiva restituisca `20`.
  - Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, tutti passati («Tests 2 passed»). Il secondo si chiama «la scorta restituisce 10, tranne una volta 20».
  - Cosa ho concluso: `mockReturnValue(10)` fa restituire `10` a ogni chiamata, e `mockReturnValueOnce(20)` fa restituire `20` solo alla chiamata successiva.
- Aggiungo la riga 17 `expect(scorta()).toBe(20);`:
  - Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, 1 fallito, «la scorta restituisce 10, tranne una volta 20», alla riga 17, colonna 22. Il messaggio dice `AssertionError: expected 10 to be 20 // Object.is equality`, poi `- Expected` e `+ Received`, e sotto `- 20` e `+ 10`.
  - Cosa ho concluso: la terza chiamata restituisce `10`, non `20`: il valore `20` vale solo per la chiamata successiva a `mockReturnValueOnce`.
- Ultima versione, con la riga 17 cambiata in `expect(scorta()).toBe(10);`:
  - Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, tutti verdi («Tests 2 passed»).

### Passo 4: un mock asincrono

- Scrivo un test `async` con `vi.fn().mockResolvedValue({ nome: 'farina' })`, controllo il nome dopo `await leggiIngrediente()`, poi uso `mockRejectedValue(new Error('Ingrediente non trovato'))` e controllo il rifiuto con `rejects.toThrow('Ingrediente non trovato')`.
- Comando: `pnpm exec vitest run`
- Prima run, con `await expect(leggiIngrediente()).toBe('farina')` alla riga 23: 3 test, 1 fallito, «mock asincrono». Il messaggio dice `AssertionError: expected Promise{…} to be 'farina' // Object.is equality`, con `Received: Promise {}`, alla riga 23, colonna 38.
- Seconda versione, con la riga 29 scritta come `await (leggiIngrediente().rejects.toThrow('Ingrediente non trovato'));`: 3 test, 1 fallito, «mock asincrono». Il messaggio dice `TypeError: Cannot read properties of undefined (reading 'toThrow')`, alla riga 29, colonna 38.
  - Cosa ho concluso: `.rejects` attaccato alla chiamata del mock, e non a `expect(...)`, dà `undefined`, quindi `.toThrow` non può essere letto. Il `rejects` va dentro `expect(...)`.
- Versione corretta, con la riga 29 come `await expect(leggiIngrediente()).rejects.toThrow('Ingrediente non trovato');`:
  - Comando: `pnpm exec vitest run`
  - Cosa ho visto: 3 test, tutti verdi («Tests 3 passed»).
- Poi ho cambiato la stringa attesa in `rejects.toThrow('altro')` e ho rilanciato `pnpm exec vitest run`:
  - Cosa ho visto: 3 test, 1 fallito, «mock asincrono», alla riga 29, colonna 37. Il messaggio dice `AssertionError: expected [Function] to throw error including 'altro' but got 'Ingrediente non trovato'`, con `Expected: "altro"` e `Received: "Ingrediente non trovato"`.
  - Cosa ho concluso: con `rejects.toThrow` una stringa che non è nel messaggio fa fallire il test, e il messaggio mostra il messaggio ricevuto.

### Passo 5: un mock con un comportamento

- Scrivo un quarto test: un mock `costo` con `vi.fn()` e `mockImplementation` che moltiplica chili per prezzo al chilo, con i controlli `costo(2, 3)` uguale a `6` e `costo(10, 3)` uguale a `30`. Poi un secondo mock `costo2` creato con `vi.fn((chili, prezzo) => chili * prezzo)`, con il controllo `costo2(2, 3)` uguale a `6`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 4 test, tutti verdi («Tests 4 passed»). Il quarto si chiama «il costo è chili per prezzo al chilo».
- Cosa ho concluso: `mockImplementation` fa eseguire al mock la funzione che gli ho dato, con gli argomenti della chiamata; la scorciatoia `vi.fn(...)` dà lo stesso risultato.
- Poi ho sostituito, nel quarto test, `mockImplementation(...)` su `costo` con `mockReturnValue(6)`, per vedere la differenza con un valore fisso, e ho rilanciato `pnpm exec vitest run`: 4 test, 1 fallito, «il costo è chili per prezzo al chilo», alla riga 36, colonna 26. Il messaggio dice `AssertionError: expected 6 to be 30 // Object.is equality`, poi `- Expected` e `+ Received`, e sotto `- 30` e `+ 6`.
  - Cosa ho concluso: con `mockReturnValue(6)` il mock restituisce `6` per ogni argomento: `costo(2, 3)` passa, ma `costo(10, 3)` no, perché il valore è fisso e non dipende dagli argomenti.

### Passo 6: guardare le chiamate

- Scrivo due test con `controllaScorta` da `scorta.js`. Nel primo, con quantità 2, controllo che restituisca `false`, che `avvisa` sia chiamato una volta (`toHaveBeenCalledTimes(1)`) e con `'farina: scorta bassa'` (`toHaveBeenCalledWith`). Nel secondo, con quantità 10, controllo che restituisca `true` e che `avvisa` non sia chiamato (`.not.toHaveBeenCalled()`).
- Comando: `pnpm exec vitest run`
- Cosa ho visto: versione con `'farina: scorta bassa'`: 6 test, tutti verdi.
- Poi ho cambiato la stringa in `'farina: scorta alta'` e ho rilanciato `pnpm exec vitest run`: 6 test, 1 fallito: «scorta bassa: avvisa e restituisce false», alla riga 47, colonna 20. Il messaggio dice `AssertionError: expected "vi.fn()" to be called with arguments: [ 'farina: scorta alta' ]`, con `- "farina: scorta alta"` (il valore che ho scritto) e `+ "farina: scorta bassa"` (il valore ricevuto). Il secondo test, «scorta sufficiente: non avvisa e restituisce true», passa.
  - Cosa ho concluso: `toHaveBeenCalledWith` confronta gli argomenti della chiamata registrata, e la chiamata ha ricevuto `'farina: scorta bassa'`.
- Poi ho rimesso `'farina: scorta bassa'`.
- Poi ho aggiunto il terzo test, «leggo più chiamate con mock.calls e results»: `controllaScorta` due volte (`'farina'` con 2, `'burro'` con 1), controlli con `toHaveBeenCalledTimes(2)`, `toHaveBeenNthCalledWith(1, ...)`, `toHaveBeenLastCalledWith(...)` e `toEqual` su `avvisa.mock.calls`, e `console.log(avvisa.mock.results);` senza controllo. Ho rilanciato `pnpm exec vitest run`: 6 test, tutti verdi («Tests 6 passed»).
  - Cosa ho visto: i test erano 6 e non 7: «scorta sufficiente» non c'era più, perché l'avevo sovrascritto con il test nuovo.
  - Poi ho rimesso il test «scorta sufficiente: non avvisa e restituisce true» e ho rilanciato `pnpm exec vitest run`: 7 test, tutti verdi («Tests 7 passed»).
  - Cosa ho visto: il `console.log` stampa due oggetti, uno per chiamata, ciascuno con `type: 'return'` e `value: undefined`.
  - Cosa ho concluso: `avvisa` è stato chiamato due volte e non ha restituito nulla in nessuna delle due chiamate, quindi `.mock.results` registra `undefined` per ciascuna.

### Passo 7: il trabocchetto dei riferimenti

- Scrivo un test con `registra = vi.fn()` e `ordine = { quantita: 1 }`: chiamo `registra(ordine)`, poi cambio `ordine.quantita` in `2`, e controllo con `toHaveBeenCalledWith({ quantita: 1 })`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 8 test, 7 passati e 1 fallito: «il mock ricorda il riferimento, non una copia», alla riga 72, colonna 22. Il messaggio dice `AssertionError: expected "vi.fn()" to be called with arguments: [ { quantita: 1 } ]`. Nel confronto, `- "quantita": 1` è il valore che ho scritto, e `+ "quantita": 2` è il valore dell'oggetto registrato.
  - Cosa ho concluso: la chiamata registrata mostra `quantita: 2`, cioè l'oggetto già modificato, perché il mock ha tenuto il riferimento e non una copia.
- Poi ho spostato il controllo `toHaveBeenCalledWith({ quantita: 1 })` prima di `ordine.quantita = 2`, e ho rilanciato `pnpm exec vitest run`: 8 test, tutti verdi («Tests 8 passed»).
  - Cosa ho concluso: se faccio il controllo prima della modifica, la chiamata registrata ha ancora `quantita: 1` e il test passa. È il secondo rimedio della pagina.
- Poi ho aggiunto il nono test, «una copia fatta al momento della chiamata non cambia»: `copie` è un array vuoto, `registra` è un `vi.fn(...)` che mette in `copie` una copia dell'ordine con `structuredClone`, poi chiamo `registra(ordine)` e cambio `ordine.quantita` in `2`. Controllo con `toEqual` che `copie[0]` sia `{ quantita: 1 }`, e con `toBe` che `registra.mock.calls[0][0].quantita` valga `2`. Ho rilanciato `pnpm exec vitest run`: 9 test, tutti verdi («Tests 9 passed»).
  - Cosa ho concluso: `copie[0]` vale `{ quantita: 1 }` e `registra.mock.calls[0][0].quantita` vale `2`. La copia fatta con `structuredClone` è il primo rimedio della pagina.
- Poi ho sostituito `console.log(avvisa.mock.results);` con `expect(avvisa.mock.results).toEqual([{ type: 'return', value: undefined }, { type: 'return', value: undefined }]);` e ho rilanciato `pnpm exec vitest run`: 9 test, tutti verdi, senza output sul terminale.
- Nel test «il mock ricorda il riferimento, non una copia» ho aggiunto in fondo, dopo la modifica, `expect(registra.mock.calls[0][0]).toBe(ordine);`: controlla che l'oggetto registrato sia lo stesso `ordine`, non una copia. L'ho visto passare nella run finale con `pnpm test`. Ho anche tolto l'`await` inutile davanti a `expect(ingrediente.nome).toBe('farina')`, ho rinominato il primo test in «un mock registra le chiamate e restituisce undefined» e ho tolto il punto e virgola dopo la funzione in `scorta.js`.
- Ho lanciato `pnpm test`, con `$LASTEXITCODE`: 9 test, tutti verdi, codice `0`.

## Dopo l'esercizio

### Cosa ho fatto

- Comandi usati: `mkdir`, `Set-Location`, `pnpm init`, `pnpm add -D vitest`, `git status --short -uall`, `pnpm test`, `Select-String`, `pnpm exec vitest run`. Descritti nel [diario](comandi.md).

### Cosa ho visto

- Un mock creato con `vi.fn()` non fa niente, restituisce `undefined` e registra le chiamate (passo 2).
- `mockReturnValue` restituisce sempre lo stesso valore; `mockReturnValueOnce` vale solo per la chiamata successiva (passo 3).
- Un `rejects.toThrow` con una stringa che non è nel messaggio fa fallire il test; senza `expect(...)` il `.rejects` non si legge (passo 4).
- `mockImplementation` fa eseguire al mock una funzione con gli argomenti della chiamata; un valore fisso con `mockReturnValue` no (passo 5).
- `.mock.calls` registra i riferimenti agli argomenti: dopo una modifica, la chiamata registrata mostra il valore modificato (passo 7).
- Quando `toHaveBeenCalledWith` fallisce, il messaggio mostra «1st vi.fn() call» con gli argomenti della chiamata e `Number of calls: 1` (passo 6).
- `.mock.results` registra per ogni chiamata `{ type: 'return', value: undefined }` (passo 6).
- Una copia fatta con `structuredClone` dentro `mockImplementation` conserva `quantita: 1` anche dopo la modifica dell'oggetto (passo 7).

### Cosa ho verificato

- Con `pnpm exec vitest run` nella cartella `05-finte`, le run che ho visto nei passi: 1 test verde dopo la chiamata (passo 2), 2 test verdi con `mockReturnValueOnce` (passo 3), 3 test verdi con la versione corretta di `rejects` (passo 4), 4 test verdi con `mockImplementation` (passo 5), 6 test verdi nella versione con `'farina: scorta bassa'` del passo 6, poi 7 dopo aver rimesso «scorta sufficiente», 8 test verdi con il controllo prima della modifica e 9 con il test su `structuredClone` (passo 7). Dopo aver sostituito `console.log` con `expect`, i test sono rimasti 9 (passo 7).
- Con `pnpm test` (lo script `vitest run`), nella cartella `05-finte`: 9 test verdi e codice di uscita `0`.

### Cosa ho dedotto e non ancora verificato

- Non so se `mockReturnValue(Promise.resolve(...))` si comporta come `mockResolvedValue`: non l'ho provato. Il repo pubblico usa la prima forma.

### Domande aperte

- Come si comporta `mockReturnValue(Promise.resolve(...))` rispetto a `mockResolvedValue`, e in quali casi cambia la risposta?
- Perché `[Function]` compare di nuovo nel messaggio di `rejects.toThrow('altro')`, come nel passo 5 di 04?

### Applicazione in Orarium

- **Visto:** nel repo pubblico, `IngredientList.test.jsx` sostituisce `fetch` con `vi.stubGlobal('fetch', vi.fn())` (riga 21) e risponde con `fetch.mockReturnValue(respondWith(...))` in dieci punti (righe 31, 44, 60, 78, 93, 104, 115, 129, 143, 162) e con un altro `mockReturnValue` alla riga 187. `respondWith` (righe 12–17) restituisce una `Promise.resolve` con `ok: true` e `json`. Alle righe 184–187 c'è un `mockReturnValueOnce(...)` seguito da `mockReturnValue(...)`: la prima risposta è la pagina 1, le successive la pagina 2. Alla riga 69 c'è `fetch.mockRejectedValue(new Error('rete'))`, alla riga 97 un `toHaveBeenCalledWith(` e alla riga 206 un `toHaveBeenCalledTimes(3)`.
- **Visto:** `App.test.jsx`, righe 7–10, usa `vi.fn(() => new Promise(() => {}))`, cioè la scorciatoia con l'implementazione, con una promessa che non si risolve mai.
- **Visto:** nel repo pubblico non compaiono `mockResolvedValue`, `mockImplementation`, `vi.spyOn` né `vi.mock`.
- **Visto:** `Componenti.test.jsx` usa `vi.fn()` per `onCambia` e `onCambio`, e `Esercizi.test.js` ha un test su `mockReturnValueOnce`. Esistono solo sul mio computer, quindi non li conto come lavoro di Orarium.

Non nasce nessuna PR da questo esercizio, per scelta: il test diretto di `fetchIngredients` userebbe questi stessi strumenti, ma serve anche `vi.stubGlobal`, che vedremo nell'esercizio 06. Decido dopo il 06.

## Fonti

- [Mock Functions](https://vitest.dev/guide/learn/mock-functions)
