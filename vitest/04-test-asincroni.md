# 04 - Test asincroni

## Teoria

### L'idea in due righe

Molto codice JavaScript non risponde subito: restituisce una promessa, e il risultato arriva dopo. Un test deve aspettare quel risultato prima di controllarlo; se non aspetta, controlla un valore che non c'è ancora, oppure finisce prima che il codice abbia fatto il suo lavoro.
In Vitest si aspetta con `async` e `await`; per le promesse si può anche scrivere il controllo direttamente con `resolves` e `rejects`.

### Il problema: il test che non aspetta

La pagina parte da qui: Vitest deve sapere quando il codice che sta provando ha finito, prima di passare al test dopo. Con `async`, la pagina dice che Vitest aspetta la promessa restituita dalla funzione del test; senza, la funzione finisce subito.
In pratica: una funzione che restituisce una promessa va chiamata con `await` dentro un test dichiarato `async`. Senza, quello che il test ha in mano è la promessa stessa, non il suo risultato.

### `async` e `await` dentro il test

Si scrive `async` davanti alla funzione del test e `await` davanti alla chiamata che restituisce la promessa. Il test finisce quando la funzione ha finito, e se la promessa viene rifiutata il test fallisce con il motivo del rifiuto.

### `resolves` e `rejects`

`resolves` e `rejects` si attaccano a `expect(...)` quando il valore è una promessa: aprono la promessa e applicano il confronto al valore risolto o al motivo del rifiuto. Così non serve una variabile intermedia.
Davanti a `expect` ci va sempre `await`. Se manca, secondo la pagina Vitest se ne accorge e fa fallire il test alla fine.

### Il test che passa per sbaglio: contare i controlli

Un test passa quando nessun controllo fallisce. Se i controlli sono dentro una funzione che non viene mai chiamata (per esempio il corpo di un `forEach` su un array vuoto), nessun controllo viene eseguito e il test passa senza aver controllato niente.
`expect.hasAssertions()` fa fallire il test se nessun controllo è stato eseguito; `expect.assertions(n)` lo fa fallire se i controlli eseguiti non sono esattamente `n`.

### Le funzioni con callback

Le funzioni più vecchie non restituiscono una promessa: chiamano una funzione che gli passi (la callback) quando hanno finito. La pagina propone di avvolgerle in una `Promise`, passando `resolve` come callback, e di fare `await` sulla promessa. Aggiunge che serve soprattutto per le librerie che non usano ancora le promesse.

### Il timeout

Ogni test ha un tempo massimo; secondo la pagina, di default sono 5 secondi. Serve a non far restare la suite bloccata per sempre. Per un test che ha davvero bisogno di più tempo, si passa un numero (in millisecondi) come terzo argomento di `test`.

### Le promesse rifiutate e non gestite

Se in un test parte una promessa che viene rifiutata e nessuno la aspetta né la intercetta, secondo la pagina Vitest lo segnala come errore nella run: di solito indica un bug vero.

**Analogia (mia, non della documentazione): la lievitazione.**

Metto l'impasto a lievitare e, se guardo subito com'è venuto, vedo l'impasto di prima: non sbaglio il controllo, lo faccio troppo presto. `await` è aspettare che sia lievitato prima di guardare. Il timeout è il timer del forno: se l'impasto non è pronto entro il tempo, non aspetto in eterno.
Dove l'analogia si ferma: in cucina capisco a occhio quanto serve aspettare; in un test il tempo giusto non lo so, e se lo allungo troppo la suite diventa lenta.

### In breve

| | Cosa fa |
|---|---|
| `async` / `await` | il test aspetta il risultato della promessa prima di controllarlo |
| `expect(p).resolves.…` | apre la promessa risolta e confronta il valore (con `await` davanti) |
| `expect(p).rejects.…` | apre il rifiuto e confronta l'errore (con `await` davanti) |
| `expect.hasAssertions()` | il test fallisce se nessun controllo è stato eseguito |
| `expect.assertions(n)` | il test fallisce se i controlli eseguiti non sono esattamente `n` |
| `new Promise(resolve => …)` | avvolge una funzione con callback in una promessa |
| terzo argomento di `test` | tempo massimo del test, in millisecondi (default 5 secondi) |

## Dalla documentazione (parole originali)

- Da [Testing Async Code](https://vitest.dev/guide/learn/async): "JavaScript code frequently runs asynchronously."; "Vitest needs to know when the code it is testing has completed before moving on to the next test."
- Da [Testing Async Code, Async/Await](https://vitest.dev/guide/learn/async): "The most straightforward approach is to make your test function `async`."; "Vitest will automatically wait for the returned promise to resolve before considering the test complete."; "If the promise rejects, the test fails with the rejection reason."
- Da [Testing Async Code, Resolves and Rejects](https://vitest.dev/guide/learn/async): "They unwrap the promise and then apply the matcher to the resolved or rejected value:"; "Don't forget the `await` before `expect`."; "Vitest will detect unawaited assertions and fail the test at the end of it."; "Sometimes you'd rather assert on a promise directly instead of `await`-ing it into a variable first."
- Da [expect, `resolves` e `rejects`](https://vitest.dev/api/expect): "`resolves` is intended to remove boilerplate when asserting asynchronous code."; "If the assertion is not awaited, the test will be marked as "failed" at the end of the test."; per `rejects`: "If the promise successfully resolves, the assertion will fail."
- Da [Testing Async Code, Assertion Counting](https://vitest.dev/guide/learn/async): "the test would still pass because no assertion failed."; "`expect.hasAssertions()` guards against this by verifying that at least one assertion ran during the test:"; "`expect.assertions(n)` is more precise:"
- Da [expect, `expect.assertions` e `expect.hasAssertions`](https://vitest.dev/api/expect): "After the test has passed or failed verify that a certain number of assertions was called during a test."; "After the test has passed or failed verify that at least one assertion was called during a test."
- Da [Testing Async Code, Callbacks](https://vitest.dev/guide/learn/async): "Since Vitest works with promises, the simplest approach is to wrap the callback in a `Promise`:"; "Pass `resolve` as the success callback, and the test will wait until the callback is invoked."; "The callback wrapping pattern above is mainly useful for older libraries that haven't adopted promises yet."
- Da [Testing Async Code, Timeouts](https://vitest.dev/guide/learn/async): "By default, each test has a 5-second timeout."; "This prevents your test suite from getting stuck indefinitely."
- Da [Testing Async Code, Unhandled Rejections](https://vitest.dev/guide/learn/async): "By default, Vitest reports unhandled promise rejections as errors in the test run."; "This is intentional: unhandled rejections usually indicate real bugs"
- Da [expect, `toThrow`](https://vitest.dev/api/expect): "This does not apply for async calls as `rejects` correctly unwraps the promise:" (la regola della funzione intorno non vale con `rejects`).

## Con parole mie

### 1. Perché serve `await`

> Perché un test che prova una funzione asincrona ha bisogno di `async` e `await`? Cosa ha in mano il test se manca `await`?

**Risposta:** Una funzione asincrona non dà subito il risultato: dà una promessa, cioè un risultato che arriva dopo. Il test deve aspettare quel risultato prima di controllarlo. Con `async` e `await` il test aspetta, e poi fa il controllo. Se manca `await`, il test ha in mano la promessa, non il valore: controlla qualcosa che non c'è ancora.

- **Visto:** passo 3: senza `await`, la variabile contiene `Promise { { id: 1, nome: 'farina' } }`, e `ingrediente.nome` è `undefined`.
- **Dalla pagina:** «Vitest will automatically wait for the returned promise to resolve before considering the test complete.»

### 2. `resolves` e `rejects`

> A cosa servono `resolves` e `rejects`? Perché davanti a `expect` ci va `await`?

**Risposta:** `resolves` e `rejects` mi permettono di controllare direttamente il risultato di una promessa. `resolves` controlla il valore quando la promessa va a buon fine; `rejects` controlla il motivo quando la promessa viene rifiutata. Davanti a `expect` ci va `await` perché così il test aspetta la promessa prima di fare il controllo.

- **Visto:** passo 6: senza `await` davanti a `expect`, il test fallisce con «was not awaited». Passi 2 e 4: la versione con la variabile (passo 2) e quella con `resolves` (passo 4) passano entrambe con il valore giusto.
- **Dalla pagina:** «Don't forget the `await` before `expect`.»; «Vitest will detect unawaited assertions and fail the test at the end of it.»; «Sometimes you'd rather assert on a promise directly instead of `await`-ing it into a variable first.»

### 3. Il test che passa per sbaglio

> Come può un test asincrono passare senza aver controllato niente? Cosa fanno `expect.hasAssertions()` e `expect.assertions(n)` per evitarlo?

**Risposta:** Un test passa se nessun controllo fallisce. Se i controlli sono dentro una parte del codice che non viene mai eseguita, il test passa senza aver controllato niente. `expect.hasAssertions()` fa fallire il test se nessun controllo è stato eseguito. `expect.assertions(n)` lo fa fallire se i controlli eseguiti non sono esattamente `n`.

- **Visto:** passo 7: con `expect.hasAssertions()` e nessun controllo eseguito, il test fallisce con `expected any number of assertion, but got none`.
- **Dalla pagina:** «`expect.hasAssertions()` guards against this by verifying that at least one assertion ran during the test»; «`expect.assertions(n)` is more precise».

### 4. Le callback

> Come provi una funzione che non restituisce una promessa ma chiama una callback quando ha finito?

**Risposta:** Avvolgo la funzione in una `Promise`, e passo `resolve` come callback. Poi scrivo `await` davanti alla promessa, così il test aspetta che la callback venga chiamata.

- **Visto:** passo 8: con `new Promise` e `resolve`, il test riceve `'burro'`; il test dura 111 ms.
- **Dalla pagina:** «Pass `resolve` as the success callback, and the test will wait until the callback is invoked.»

### 5. Il timeout

> Quanto dura il timeout di un test, per default? Perché esiste, e come si cambia per un solo test?

**Risposta:** Per default ogni test ha 5 secondi. Il timeout serve a non bloccare la suite per sempre. Per un solo test passo un numero in millisecondi come terzo argomento di `test`.

- **Visto:** passo 9: il timeout scatta a 5000 ms; con `10_000` come terzo argomento il test passa in 6002 ms.
- **Dalla pagina:** «By default, each test has a 5-second timeout.»; «This prevents your test suite from getting stuck indefinitely.»

### 6. Le promesse non gestite

> Cosa fa Vitest se in un test parte una promessa che viene rifiutata e nessuno la aspetta?

**Risposta:** Vitest la segnala come errore nella run. Non la fa passare in silenzio.

- **Visto:** passo 10: i cinque test sono verdi, ma la run mostra «Errors 1 error» e il codice di uscita è `1`.
- **Dalla pagina:** «By default, Vitest reports unhandled promise rejections as errors in the test run.»; «unhandled rejections usually indicate real bugs».

## Esercizio: la traccia

Lavoro in `vitest/04-asincrono`, dentro il lab. Tutti i file di codice li scrivo io, da capo.
Non tocco la cartella `orarium`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un test rosso di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio ho usato `pnpm exec vitest run`.

### Passo 1: preparare la cartella

- Comando: `mkdir`, `pnpm init`, poi `pnpm add -D vitest`, dentro `vitest/04-asincrono`; poi imposto lo script `test` del `package.json` a `vitest run`; poi `git status --short -uall`
- Cosa ho visto: ho creato la cartella `vitest/04-asincrono` con `mkdir` (output `d-----`, nome `04-asincrono`). `pnpm init` ha scritto `package.json` con nome `04-asincrono` e `"type": "module"`. `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.1` in `devDependencies`, in 824 millisecondi. Poi ho cambiato lo script: alla riga 7 di `package.json` c'era `"test": "echo \"Error: no test specified\" && exit 1"`, ora c'è `"test": "vitest run"`. Con `git status --short -uall`, lanciato in `vitest/04-asincrono`, i file non tracciati sono `package.json`, `pnpm-lock.yaml` e `../04-test-asincroni.md`; `../02-i-confronti.md` e `../README.md` risultano modificati. `node_modules` non compare.
- Episodio: per sbaglio ho lanciato `pnpm init` e `pnpm add -D vitest` dentro `vitest`. Ho cancellato i file con `Remove-Item -Recurse -Force` e li ho rifatti in `04-asincrono`. Con `Test-Path` ho controllato tre percorsi: tre `False`, cioè che non esistevano più.
- Cosa ho concluso: la cartella è pronta, con Vitest 5.1.1 installato come dipendenza di sviluppo e lo script `test` impostato a `vitest run`.

### Passo 2: un test asincrono con `async` e `await`

- Scrivo `ingrediente.js` con la funzione `leggiIngrediente(id)`, con dentro `Promise.resolve({ id, nome: 'farina' })`. Scrivo `asincrono.test.js` con un test `async` che fa `await leggiIngrediente(1)` e controlla con `toBe` che il nome sia `'farina'`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 1 test, fallito: «controlla che il nome sia farina». La versione eseguita è `await leggiIngredienti(1).toBe('farina');`, senza `expect` e con un nome di funzione diverso (`leggiIngredienti`). Il messaggio dice `TypeError: Cannot read properties of undefined (reading 'toBe')`, alla riga 5, colonna 30.
- Cosa ho concluso: la prima esecuzione è rossa, ma non è il rosso previsto: il test si ferma prima del controllo sul nome, perché `.toBe` viene chiamato su un valore `undefined`.
- Versione con la riga `await leggiIngrediente(1)` e `expect('farina').toBe('farina')`:
  - Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, verde.
  - Cosa ho concluso: il test è verde, ma confronta `'farina'` con `'farina'`: non controlla il risultato della funzione. Me l'ha fatto notare Claude.
- Il file con la funzione si chiamava `ingrediente.js`. L'ho rinominato in `ingredienti.js` direttamente da VS Code, senza un comando del terminale. Nell'import del test il percorso è passato da `./ingrediente.js` a `./ingredienti.js`.
- Prima della correzione, ho aperto `ingredienti.js` e `asincrono.test.js` con `Get-Content` e ho lanciato di nuovo `pnpm exec vitest run`. Nel file `ingredienti.js` la funzione `leggiIngrediente(id)` scrive `Promise.resolve({ id, nome: 'farina' });` senza `return`. Nel test c'è `await expect(leggiIngrediente(1)).toBe('farina');`.
  - Cosa ho visto: 1 test, fallito. Il messaggio dice `AssertionError: expected undefined to be 'farina' // Object.is equality`, con `- Expected: "farina"` e `+ Received: undefined`, alla riga 5, colonna 39.
  - Cosa ho concluso: la funzione restituisce `undefined`, perché nel file manca il `return` davanti a `Promise.resolve`; il test riceve `undefined`, non la promessa.
- Dopo la correzione, rilanciato `pnpm exec vitest run`: 1 test, verde («Test Files 1 passed», «Tests 1 passed»). Nel file ora c'è `return Promise.resolve(...)` in `ingredienti.js`, e il test fa `const ingrediente = await leggiIngrediente(1);` seguito da `expect(ingrediente.nome).toBe('farina');`.
  - Cosa ho concluso: il test aspetta il risultato e controlla il campo `nome` dell'ingrediente, non la promessa.
- Poi ho cambiato il valore atteso da `'farina'` a `'burro'`, per vedere un rosso di proposito, e ho lanciato `pnpm exec vitest run`.
  - Cosa ho visto: 1 test, fallito. Il messaggio dice `AssertionError: expected 'farina' to be 'burro' // Object.is equality`, con `- Expected: "burro"` e `+ Received: "farina"`, alla riga 6, colonna 30, su `expect(ingrediente.nome).toBe('burro')`.
  - Cosa ho concluso: il test controlla il nome restituito dalla funzione: con un valore sbagliato fallisce e mi dice quale valore ha ricevuto.

### Passo 3: lo stesso senza `await` (rosso, di proposito)

- Cambio il test: tolgo `async` e `await`, e metto in una variabile quello che restituisce `leggiIngrediente(1)`, poi controllo `variabile.nome` con `toBe('farina')`. Voglio leggere il messaggio per intero.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 1 test, fallito. Nella prima esecuzione il messaggio dice `AssertionError: expected undefined to be 'farina' // Object.is equality`, con `- Expected: "farina"` e `+ Received: undefined`, alla riga 6, colonna 30, su `expect(ingrediente.nome).toBe('farina')`.
- Ho aggiunto un `console.log(ingrediente)` e rilanciato. Il log stampa `Promise { { id: 1, nome: 'farina' } }`, e il fallimento è alla riga 7, con lo stesso messaggio.
- Cosa ho concluso: senza `await`, la variabile contiene la promessa, non il risultato; `ingrediente.nome` è `undefined`.
- Poi rimetto la versione con `await`.

### Passo 4: `resolves`

- Scrivo un test `async` con `await expect(leggiIngrediente(1)).resolves.toEqual({ id: 1, nome: 'farina' })`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 2 test, tutti verdi («Tests 2 passed»): «controlla che il nome sia farina» e «con resolves, la promessa restituisce l'ingrediente con id 1 e nome farina».
- Poi ho cambiato il valore atteso in `resolves.toEqual({ id: 1, nome: 'burro' })` e ho rilanciato `pnpm exec vitest run`. Cosa ho visto: 2 test, 1 fallito, quello con `resolves`. Il messaggio dice `AssertionError: expected { id: 1, nome: 'farina' } to deeply equal { id: 1, nome: 'burro' }`, con `- "nome": "burro"` e `+ "nome": "farina"`, alla riga 10, colonna 38 (`asincrono.test.js:10:38`). Il messaggio è diverso da quello di `toBe`: qui c'è «to deeply equal» e un confronto riga per riga, con il campo `nome` che non torna; il messaggio di `toBe` aveva `// Object.is equality`.
- Cosa ho concluso: `resolves` apre la promessa e confronta il valore risolto: con `'farina'` passa, con `'burro'` fallisce e mi dice che cosa ha ricevuto.

### Passo 5: `rejects`

- Scrivo in `ingredienti.js` la funzione `leggiIngredienteMancante()`, che restituisce `Promise.reject(new Error('Ingrediente non trovato'))`. Scrivo un test con `await expect(leggiIngredienteMancante()).rejects.toThrow('Ingrediente non trovato')`.
- Prima del test ho cambiato l'export in `ingredienti.js`: da `export default` a `export { leggiIngrediente, leggiIngredienteMancante }`, e nel test l'import con le graffe.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 3 test, tutti verdi («Tests 3 passed»). Il terzo è «manda l'errore per l'ingrediente mancante», con `await expect(leggiIngredienteMancante()).rejects.toThrow('Ingrediente non trovato')`.
- Cosa ho concluso: `rejects` apre il rifiuto della promessa e controlla il messaggio dell'errore; con `await` davanti a `expect` il test passa.
- Poi ho cambiato la stringa attesa in `rejects.toThrow('negativo')` e ho rilanciato `pnpm exec vitest run`.
  - Cosa ho visto: 3 test, 1 fallito: «manda l'errore per l'ingrediente mancante». Il messaggio dice `AssertionError: expected [Function] to throw error including 'negativo' but got 'Ingrediente non trovato'`, con `Expected: "negativo"` e `Received: "Ingrediente non trovato"`, alla riga 14, colonna 45 (`asincrono.test.js:14:45`). Il messaggio scrive `[Function]`, anche se nel test non c'è nessuna funzione intorno a `leggiIngredienteMancante()`: lo annoto così come compare.
  - Cosa ho concluso: con `rejects.toThrow` una stringa che non è nel messaggio fa fallire il test, e il messaggio mostra il messaggio ricevuto.

### Passo 6: `resolves` senza `await` davanti a `expect` (rosso, di proposito)

- Scrivo un test `async` con `expect(leggiIngrediente(1)).resolves.toEqual({ id: 1, nome: 'farina' })`, senza `await` davanti a `expect`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 4 test, 1 fallito: «resolves senza await davanti a expect». Il messaggio dice `Error: Promise returned by expect(actual).resolves.toEqual(expected) was not awaited. This assertion is asynchronous and must be awaited; otherwise, it is not guaranteed to complete before the test finishes:` e mostra `await expect(actual).resolves.toEqual(expected)`. Il fallimento è alla riga 18, colonna 32 (`asincrono.test.js:18:32`), sulla chiamata senza `await`.
- Cosa ho concluso: il test è fallito per l'`await` mancante, non per il valore: l'oggetto atteso `{ id: 1, nome: 'farina' }` era quello giusto.
- Poi ho rimesso `await`.

### Passo 7: il test che passa per sbaglio

- Scrivo un test con `const lista = []`, poi `lista.forEach((x) => { expect(x).toBe(1); })`. Poi aggiungo `expect.hasAssertions()` come prima riga del test. Poi provo `expect.assertions(2)` con un solo controllo vero dentro il test.
- Comando: `pnpm exec vitest run` (dopo ogni modifica)
- Cosa ho visto:
  - Prima run: 5 test, tutti verdi. Sono i primi tre, il quarto con `await` rimesso, e il test del `forEach` su un array vuoto senza `expect.hasAssertions()`, verde in 0 ms e senza nessun controllo eseguito.
  - Con `expect.hasAssertions()` come prima riga: 4 test, 1 fallito, «un controllo dentro un forEach su un array vuoto». Il messaggio dice `expected any number of assertion, but got none`, alla riga 18, colonna 12.
  - Con `expect.hasAssertions(2)` come prima riga: 4 test, 1 fallito, stesso messaggio `expected any number of assertion, but got none`, alla riga 18, colonna 12.
  - Con `expect.assertions(2)`: 4 test, 1 fallito. Il messaggio dice `Error: expected number of assertions to be 2, but got 0`, senza riga indicata.
  - Poi ho aggiunto `expect(lista.length).toBe(0);` fuori dal `forEach`, lasciando `expect.assertions(2)`, e ho rilanciato `pnpm exec vitest run`: 4 test, 1 fallito. Il messaggio dice `Error: expected number of assertions to be 2, but got 1`. Un controllo è stato eseguito (quello fuori dal `forEach`), quello dentro no.
- Cosa ho concluso: il test senza controlli eseguiti fallisce: `expect.hasAssertions` e `expect.assertions(2)` segnalano entrambi che i controlli eseguiti sono zero.

### Passo 8: una funzione con callback

- Scrivo in `ingredienti.js` la funzione `caricaDopo(callback)`, che con `setTimeout(callback, 100, 'burro')` chiama la callback dopo 100 millisecondi con la stringa `'burro'`. Scrivo un test `async` che avvolge la chiamata in `new Promise` (passando `resolve` come callback) e controlla con `toBe` che il valore sia `'burro'`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 5 test, 4 verdi. Il test nuovo, «caricaDopo passa «burro» alla callback dopo 100 millisecondi», ha preso il posto del quarto test, «resolves senza await davanti a expect». Passa e impiega 111 ms. Il test del `forEach` resta rosso, con `expected number of assertions to be 2, but got 1`.
- Cosa ho concluso: avvolgere `caricaDopo` in `new Promise`, con `resolve` come callback, fa aspettare il test fino alla chiamata: il valore ricevuto è `'burro'`.
- Poi ho tolto il test del `forEach`.

Seconda prova: scrivo un test che chiama `caricaDopo` con una callback che controlla `expect(dato).toBe('altro')`, senza avvolgerla in una promessa e senza `async`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 5 test, tutti verdi («Tests 5 passed»), in due run. Il test «caricaDopo chiama una callback che controlla «altro», senza promessa» passa in 0 ms nella prima run e in 1 ms nella seconda. Nessun messaggio di errore compare per il `toBe('altro')`, anche se `caricaDopo` passa `'burro'`.
- Cosa ho concluso: il test passa anche con un controllo sbagliato: il `toBe('altro')` dentro la callback non fa fallire il test.
- Poi tolgo questo test.

### Passo 9: il timeout

- Scrivo in `ingredienti.js` la funzione `attendi(ms)`, che restituisce una promessa che si risolve dopo `ms` millisecondi (con `setTimeout`). Scrivo un test `async` che fa `await attendi(6000)`. Voglio vedere quanto dura e cosa dice Vitest.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 5 test, 4 verdi e 1 fallito: «attendi(6000) dura più del timeout di default», dopo 5025 ms. Il messaggio dice `TestTimeoutError: Test timed out in 5000ms.`, e aggiunge: «If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout"». Il fallimento è alla posizione `asincrono.test.js:22:1`, sulla riga di `test(`. La run in tutto ha impiegato 5,31 s.
- Cosa ho concluso: il test dura più dei 5 secondi di default e Vitest lo ferma con un errore di timeout.

Seconda prova: passo `10_000` come terzo argomento di `test`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 5 test, tutti verdi («Tests 5 passed»). Il test «attendi(6000) dura più del timeout di default» passa in 6002 ms. La run in tutto ha impiegato 6,29 s.
- Cosa ho concluso: con `10_000` come terzo argomento il test ha tempo di finire, e passa.
- Poi tolgo questo test, perché rallenta le prove.

### Passo 10: una promessa rifiutata e non gestita (rosso, di proposito)

- Scrivo un test (senza `async`) che contiene solo `Promise.reject(new Error('oops'))`, senza `await` e senza `catch`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 5 test, tutti passati («Tests 5 passed»), tra cui «una promessa rifiutata senza catch viene segnalata». In più compare «Errors 1 error». Il messaggio dice `Vitest caught 1 unhandled error during the test run. This might cause false positive tests.`, sotto il titolo «Unhandled Rejection»: `Error: oops`, alla riga 23, colonna 20 (`asincrono.test.js:23:20`), su `Promise.reject(new Error('oops'))`.
- Il codice di uscita di `pnpm exec vitest run` è `1` (controllato con `$LASTEXITCODE`), anche se i cinque test sono verdi.
- Cosa ho concluso: il test non fallisce, ma la run segnala l'errore della promessa rifiutata senza `catch`, come dice la pagina, e la run esce con codice `1`.
- Poi ho tolto il test. Con `pnpm test` (che esegue `vitest run`): 4 test, tutti verdi («Tests 4 passed»), senza errori; `$LASTEXITCODE` è `0`.

## Dopo l'esercizio

### Cosa ho fatto

- Comandi usati (descritti nel [diario](comandi.md)): `mkdir`, `pnpm init`, `pnpm add -D vitest`, `git status --short -uall`, `pnpm exec vitest run`, `pnpm test`, `Remove-Item -Recurse -Force`, `$LASTEXITCODE`, `Get-Content`, `Test-Path`.

### Cosa ho visto

- Senza `await`, la variabile contiene la promessa e `ingrediente.nome` è `undefined` (passo 3).
- Senza `return` in `ingredienti.js`, la funzione restituisce `undefined` (passo 2).
- Il messaggio `expected undefined to be 'farina'` è comparso due volte, con cause diverse: funzione senza `return` (passo 2) e promessa non aspettata (passo 3).
- Con `resolves` e un valore sbagliato, il messaggio mostra `Expected` e `Received` (passo 4).
- Con `rejects.toThrow` e una stringa che non è nel messaggio, il test fallisce; il messaggio scrive `[Function]`, anche se non c'è nessuna funzione intorno (passo 5).
- Senza `await` davanti a `expect(...).resolves`, il test fallisce con «was not awaited» (passo 6).
- Con `expect.assertions(2)` e zero controlli il test fallisce; con un controllo fuori dal `forEach` il messaggio dice «got 1» (passo 7).
- Il test con `caricaDopo` e `new Promise` riceve `'burro'`; il test con `toBe('altro')` dentro la callback passa (passo 8).
- Un test di 6000 ms fallisce con `TestTimeoutError` a 5000 ms, e passa con `10_000` come terzo argomento (passo 9).
- Una promessa rifiutata senza `catch` non fa fallire il test, ma la run mostra «Errors 1 error» ed esce con codice `1` (passo 10).
- Un test può essere verde senza controllare niente: il `forEach` su un array vuoto passava in 0 ms, senza nessun controllo eseguito (passo 7).

### Cosa ho verificato

- Con `pnpm test`, dopo aver tolto il test del passo 10: 4 test verdi e codice di uscita `0`.
- Con `pnpm exec vitest run`, il codice di uscita `1` compare con un errore non gestito anche quando i test sono verdi (passo 10).

### Cosa ho dedotto e non ancora verificato

- Il controllo sbagliato dentro la callback parte 100 millisecondi dopo, quando il test è già finito: è un'ipotesi finché non la verifico.

### Domande aperte

- Cosa succede all'errore di quel `expect` quando la callback viene chiamata dopo la fine del test, e dove finisce?
- Perché `rejects.toThrow` scrive `[Function]` nel messaggio, anche se non c'è nessuna funzione intorno?

### Applicazione in Orarium

- **Visto:** nel repo pubblico, `frontend/src/IngredientList.test.jsx` ha 10 test `async` (righe 30, 43, 68, 77, 103, 114, 128, 142, 161, 182). Aspettano la schermata con `await screen.findBy...` e i gesti con `await userEvent.type` (riga 81) e `await utente.click`/`await utente.type`. Non usano `resolves` né `rejects`.
- **Visto:** `fetchIngredients` (`frontend/src/api/ingredients.js`, riga 25) è `async`, con `await fetch(url)` alla riga 32. In `frontend/src/api` c'è solo `ingredients.js`: nessun test suo. Oggi la funzione è provata solo attraverso il componente: alla riga 21 `IngredientList.test.jsx` sostituisce `fetch` con `vi.fn()`, e alla riga 69 `fetch.mockRejectedValue(new Error('rete'))` fa fallire la richiesta; il test alla riga 68 aspetta l'avviso.
- **Visto:** `Componenti.test.jsx` (6 test `async`) esiste solo sul mio computer, quindi non lo conto.

Non nasce nessuna PR da questo esercizio: è una scelta. Il candidato è un test diretto di `fetchIngredients`, che ha bisogno di un `fetch` finto: lo decido dopo l'esercizio 05 sui mock.

## Fonti

- [Testing Async Code](https://vitest.dev/guide/learn/async)
- [expect](https://vitest.dev/api/expect)
