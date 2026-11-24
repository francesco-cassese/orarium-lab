# 09 - Timer finti

## Teoria

### L'idea in due righe

Finora ho finto funzioni, metodi, variabili globali, variabili d'ambiente e interi moduli. Qui fingo il tempo: con i timer finti il codice che aspetta (`setTimeout`, `setInterval`) non aspetta davvero, e sono io a dire di quanto passa il tempo.

### Accendere i timer finti

`vi.useFakeTimers()` sostituisce i timer veri (`setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `setImmediate`, `clearImmediate`) e anche `Date` con versioni finte. Da quel momento un `setTimeout` non parte da solo: resta in coda finché non faccio passare il tempo io.

### Far passare il tempo

`vi.advanceTimersByTime(ms)` fa passare quel numero di millisecondi e fa scattare tutti i timer che scadono in quell'intervallo. `vi.runOnlyPendingTimers()` fa scattare i timer che sono già in coda, una volta sola. `vi.runAllTimers()` continua finché la coda è vuota: se c'è un intervallo infinito, si ferma con un errore dopo 10 000 tentativi. `vi.getTimerCount()` dice quanti timer sono in attesa.

### La data finta

Con i timer finti anche `Date` è finta: `vi.setSystemTime(data)` decide che ora è, senza far scattare nessun timer. Quando il tempo passa con `advanceTimersByTime`, la data finta avanza insieme.

### Rimettere a posto

`vi.useRealTimers()` rimette i timer veri e scarta quelli ancora in coda. Se non lo chiamo, i timer finti restano accesi anche nei test dopo.

### In breve

| | Cosa fa |
|---|---|
| `vi.useFakeTimers()` | accende i timer finti (e `Date`) |
| `vi.advanceTimersByTime(ms)` | fa passare `ms` millisecondi e fa scattare i timer in scadenza |
| `vi.runOnlyPendingTimers()` | fa scattare i timer già in coda, una volta |
| `vi.runAllTimers()` | fa scattare tutto finché la coda è vuota (errore dopo 10 000 tentativi) |
| `vi.getTimerCount()` | numero di timer in attesa |
| `vi.setSystemTime(data)` | decide che ora è, senza far scattare timer |
| `vi.useRealTimers()` | rimette i timer veri e scarta quelli in coda |
| `vi.isFakeTimers()` | dice se i timer finti sono accesi |

## Dalla documentazione (parole originali)

- Da [Vi, vi.useFakeTimers](https://vitest.dev/api/vi): "To enable mocking timers, you need to call this method."; "It will wrap all further calls to timers (such as `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `setImmediate`, `clearImmediate`, and `Date`) until `vi.useRealTimers()` is called."; "`vi.useFakeTimers()` does not automatically mock `process.nextTick` and `queueMicrotask`."
- Da [Vi, vi.advanceTimersByTime](https://vitest.dev/api/vi): "This method will invoke every initiated timer until the specified number of milliseconds is passed or the queue is empty - whatever comes first."
- Da [Vi, vi.advanceTimersByTimeAsync](https://vitest.dev/api/vi): "This will include asynchronously set timers."
- Da [Vi, vi.runAllTimers](https://vitest.dev/api/vi): "This method will invoke every initiated timer until the timer queue is empty."; "If you have an infinite interval, it will throw after 10 000 tries (can be configured with `fakeTimers.loopLimit`)."
- Da [Vi, vi.runOnlyPendingTimers](https://vitest.dev/api/vi): "This method will call every timer that was initiated after `vi.useFakeTimers` call."; "It will not fire any timer that was initiated during its call."
- Da [Vi, vi.getTimerCount](https://vitest.dev/api/vi): "Get the number of waiting timers."
- Da [Vi, vi.setSystemTime](https://vitest.dev/api/vi): "If fake timers are enabled, this method simulates a user changing the system clock (will affect date related API like `hrtime`, `performance.now` or `new Date()`) - however, it will not fire any timers."
- Da [Vi, vi.useRealTimers](https://vitest.dev/api/vi): "When timers have run out, you may call this method to return mocked timers to its original implementations."; "All timers that were scheduled before will be discarded."
- Da [Vi, vi.isFakeTimers](https://vitest.dev/api/vi): "Returns `true` if fake timers are enabled."

## Con parole mie

### 1. Accendere i timer finti

> Cosa fa `vi.useFakeTimers` e quali timer finge? Cosa succede se chiamo `vi.advanceTimersByTime` senza averli accesi?

**Risposta:** `vi.useFakeTimers()` sostituisce i timer veri, tra cui `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `setImmediate` e `clearImmediate`, e anche `Date`. Senza averli accesi, `vi.advanceTimersByTime` genera un errore: non ci sono timer finti da far scattare.

- **Visto:** Run 1: con `vi.advanceTimersByTime(1000)` senza `vi.useFakeTimers()`, il messaggio dice `Error: A function to advance timers was called but the timers APIs are not mocked. Call vi.useFakeTimers() in the test file first.`
- **Dalla pagina:** «It will wrap all further calls to timers (such as `setTimeout`, `setInterval`, `clearTimeout`, `clearInterval`, `setImmediate`, `clearImmediate`, and `Date`) until `vi.useRealTimers()` is called.»; «`vi.useFakeTimers()` does not automatically mock `process.nextTick` and `queueMicrotask`.»

### 2. Far passare il tempo

> Che differenza c'è tra `vi.advanceTimersByTime`, `vi.runOnlyPendingTimers` e `vi.runAllTimers`? Quando conviene usare ciascuno?

**Risposta:** `vi.advanceTimersByTime` fa passare un numero preciso di millisecondi. `vi.runOnlyPendingTimers` fa scattare solo i timer che sono già in coda. `vi.runAllTimers` va avanti finché la coda è vuota. Quando conviene usare ciascuno, lo ricavo dalla differenza tra i tre.

- **Visto:** Run 5: con `vi.advanceTimersByTime(150)` e un intervallo di 50 ms, `f` è chiamata 3 volte. Run 9–10: con `vi.runOnlyPendingTimers()` su un intervallo di 50 ms, `f` è chiamata 1 volta. Run 11: con `vi.runAllTimers()` su un intervallo infinito, il messaggio dice `Error: Aborting after running 10000 timers, assuming an infinite loop!`. Run 12: con `vi.runAllTimers()` e un intervallo che si ferma da solo alla terza chiamata, `f` è chiamata 3 volte.
- **Dalla pagina:** (vi.advanceTimersByTime) «This method will invoke every initiated timer until the specified number of milliseconds is passed or the queue is empty - whatever comes first.»; (vi.runOnlyPendingTimers) «It will not fire any timer that was initiated during its call.»; (vi.runAllTimers) «If you have an infinite interval, it will throw after 10 000 tries (can be configured with `fakeTimers.loopLimit`).»
- **Dedotto:** quando conviene usare ciascuno è una mia scelta, non della pagina: `advanceTimersByTime` quando so quanto tempo far passare, `runOnlyPendingTimers` quando voglio scattare solo i timer che ci sono già, `runAllTimers` quando la coda deve finire da sola.

### 3. La data finta

> Cosa succede a `Date` con i timer finti? A cosa serve `vi.setSystemTime`?

**Risposta:** Con i timer finti anche `Date` è finta (vedi domanda 1). `vi.setSystemTime(data)` decide che ora è, senza far scattare nessun timer.

- **Visto:** Run 14: con `vi.setSystemTime(new Date(1998, 11, 19))`, `adesso()` restituisce la data impostata. Run 15–16: con `vi.advanceTimersByTime(1000)`, `adesso()` avanza di 1000 ms.
- **Dalla pagina:** «If fake timers are enabled, this method simulates a user changing the system clock (will affect date related API like `hrtime`, `performance.now` or `new Date()`) - however, it will not fire any timers.»
- **Non provato:** che `setSystemTime` non faccia scattare nessun timer: non l'ho ancora provato.

### 4. Rimettere a posto

> Perché serve `vi.useRealTimers` dopo ogni test? Cosa succede ai test successivi se non lo chiamo?

**Risposta:** `vi.useRealTimers()` rimette i timer veri e scarta quelli ancora in coda. Se non lo chiamo, i timer finti restano accesi finché non lo chiamo.

- **Visto:** Run 17: senza `vi.useRealTimers()`, nel secondo test `vi.isFakeTimers()` vale `true`. Run 18: con `afterEach(() => { vi.useRealTimers(); })`, nel secondo test `vi.isFakeTimers()` vale `false`.
- **Dalla pagina:** «When timers have run out, you may call this method to return mocked timers to its original implementations.»; «All timers that were scheduled before will be discarded.»; (vi.isFakeTimers) «Returns `true` if fake timers are enabled.»
- **Dedotto:** perché serve: se i timer finti restano accesi, un test dopo potrebbe trovare timer che non ha programmato lui, o aspettare un tempo che non passa da solo. È un mio ragionamento: la pagina non lo dice.
- **Non provato:** che `vi.useRealTimers()` scarti davvero i timer in coda: non l'ho ancora provato.

### 5. Un'applicazione: il debounce

> Un debounce aspetta un po' dopo l'ultima chiamata prima di eseguire la funzione. Come lo posso provare con i timer finti, senza aspettare davvero?

**Risposta:** Accendo i timer finti, chiamo la funzione più volte, faccio passare il tempo con `vi.advanceTimersByTime` e controllo con una `vi.fn()` quante volte è stata eseguita davvero.

- **Visto:** Run 19: con `clearTimeout`, `f` è chiamata una volta sola, con `'far'`, 300 ms dopo l'ultima chiamata. Run 20: senza `clearTimeout`, `f` è chiamata con `'f'` e poi con `'fa'`, mai con `'far'`. Run 21 e 22: con `clearTimeout` rimesso, il test torna verde.
- **Dedotto:** è il mio piano per provarlo. La pagina non parla di debounce.

## Esercizio: la traccia

Lavoro in `vitest/09-timer-finti`, dentro il lab. Tutti i file di codice li scrivo io, da capo.
Non tocco la cartella `orarium`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un test rosso di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio ho usato `pnpm exec vitest run`.

### Passo 1: preparare la cartella

- Comando: `mkdir vitest\09-timer-finti`, poi `Set-Location vitest\09-timer-finti`, poi `pnpm init`, poi `pnpm add -D vitest`.
- Cosa ho visto: `mkdir` ha creato la cartella `09-timer-finti` in `vitest` (output `d-----`). `pnpm init` ha scritto `package.json` con nome `09-timer-finti`, `"type": "module"` e lo script `test` con `echo "Error: no test specified" && exit 1`. `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.1` in `devDependencies`, in 1 secondo, con pnpm v11.29.0. Non ci sono avvisi di aggiornamento.
- Controllo con `Select-String -Path package.json -Pattern '"test"|vitest'`: riga 7 `"test": "vitest run"` e riga 21 `"vitest": "^5.1.1"`. La modifica dello script non è nel terminale: il controllo mostra solo il risultato.
- Cosa ho concluso: la cartella è pronta, con Vitest 5.1.1 e lo script `test` impostato a `vitest run`.

### Passo 2: far passare il tempo con advanceTimersByTime

- Scrivo `attesa.js`, con `chiamaDopo(callback, ms)` che fa `return setTimeout(callback, ms);`. La funzione restituisce l'id del timer.
- Scrivo `attesa.test.js` nella versione 1: importa `test`, `expect` e `vi` da `vitest`, e `chiamaDopo` da `./attesa.js`. Il test «un timer finto scatta quando passa il tempo» crea `const f = vi.fn();`, chiama `chiamaDopo(f, 1000);`, poi `vi.advanceTimersByTime(1000);`, e controlla `expect(f).toHaveBeenCalledTimes(1);`. In questa versione non c'è `vi.useFakeTimers()`.
- Controllo con `Get-Content attesa.js, attesa.test.js`: mostra `chiamaDopo` con `return setTimeout(callback, ms);` (con una riga vuota dopo `{`) e il test versione 1.
- Run 1, controllo fatto apposta: senza `vi.useFakeTimers()`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, fallito: «un timer finto scatta quando passa il tempo», alla riga 7, colonna 8, su `vi.advanceTimersByTime(1000)`. Il messaggio dice `Error: A function to advance timers was called but the timers APIs are not mocked. Call vi.useFakeTimers() in the test file first.`. Il risultato finale è «Tests 1 failed (1)».
  - Cosa ho concluso: senza `vi.useFakeTimers()`, `vi.advanceTimersByTime` non trova timer finti, e il messaggio lo dice.
- Run 2. Versione 2: aggiungo `vi.useFakeTimers();` in cima al test. Il titolo resta «un timer finto scatta quando passa il tempo». Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, verde («Tests 1 passed»): `attesa.test.js (1 test)` e «un timer finto scatta quando passa il tempo».
  - Cosa ho concluso: con `vi.useFakeTimers()` e `vi.advanceTimersByTime(1000)`, la funzione `f` viene chiamata una volta.
- Run 3. Versione 3: il titolo diventa «il timer scatta esattamente a 1000 ms», `vi.advanceTimersByTime` passa a `999`, e l'aspettativa `toHaveBeenCalledTimes(1)` è sbagliata apposta. Controllo fatto apposta. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, fallito: «il timer scatta esattamente a 1000 ms», alla riga 9, colonna 15. Il messaggio dice `AssertionError: expected "vi.fn()" to be called 1 times, but got 0 times`. Il risultato finale è «Tests 1 failed (1)».
  - Cosa ho concluso: dopo 999 ms la funzione `f` non è stata chiamata. Che scatti esattamente a 1000 ms non l'ho ancora visto in questa versione.
- Run 4. Versione 4: il file ha due test. Il primo è «un timer finto scatta quando passa il tempo», come nella versione 2: `vi.useFakeTimers()`, `chiamaDopo(f, 1000)`, `vi.advanceTimersByTime(1000)` e `toHaveBeenCalledTimes(1)`. Il secondo è «il timer scatta esattamente a 1000 ms»: dopo `vi.advanceTimersByTime(999)` controllo `expect(f).not.toHaveBeenCalled()`, poi faccio passare 1 ms con `vi.advanceTimersByTime(1)` e controllo `toHaveBeenCalledTimes(1)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, verdi («Tests 2 passed»): `attesa.test.js (2 tests)`, con «un timer finto scatta quando passa il tempo» e «il timer scatta esattamente a 1000 ms».
  - Cosa ho concluso: `f` non è chiamata dopo 999 ms, ed è chiamata una volta dopo il millisecondo che manca. Il timer scatta esattamente a 1000 ms.

### Passo 3: un intervallo, e tre modi di far scattare i timer

- Aggiungo in `attesa.js` la funzione `ripeti(callback, ms)`, che fa `return setInterval(callback, ms);`. In `attesa.test.js` aggiungo un terzo test, «un intervallo scatta a ogni scadenza»: `vi.useFakeTimers()`, `ripeti(f, 50)`, `vi.advanceTimersByTime(150)`, e `expect(f).toHaveBeenCalledTimes(2)`.
- Run 5, errore mio (rosso accidentale). Comando: `pnpm exec vitest run`
  - Cosa ho visto: 3 test, 1 fallito: «un intervallo scatta a ogni scadenza», alla riga 27, colonna 15. Il messaggio dice `AssertionError: expected "vi.fn()" to be called 2 times, but got 3 times`. Gli altri due test sono verdi. Il risultato finale è «Tests 1 failed | 2 passed (3)».
  - Cosa ho concluso: dopo 150 ms con un intervallo di 50 ms, `f` è stata chiamata tre volte, una per ogni scadenza.
- Run 6. Nel file l'aspettativa del terzo test diventa `toHaveBeenCalledTimes(3)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 3 test, verdi («Tests 3 passed»).
  - Cosa ho concluso: con l'atteso 3 il terzo test passa, e conferma il valore ricevuto nella Run 5.
- Run 7, controllo fatto apposta: aggiungo un quarto test, «il contatore conta il timer in attesa»: `vi.useFakeTimers()`, `const id = ripeti(vi.fn(), 50);`, e `expect(vi.getTimerCount()).toBe(0);`. L'atteso è 0, sbagliato apposta. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 4 test, 1 fallito: «il contatore conta il timer in attesa», alla riga 33, colonna 32. Il messaggio dice `AssertionError: expected 1 to be +0 // Object.is equality`, con `- 0` (il valore che ho scritto) e `+ 1` (il valore ricevuto). Gli altri tre test sono verdi. Il risultato finale è «Tests 1 failed | 3 passed (4)».
  - Cosa ho concluso: dopo `ripeti` c'è un timer in attesa, quindi `vi.getTimerCount()` vale 1.
- Run 8. Nel file l'atteso del quarto test diventa `toBe(1)`, poi c'è `clearInterval(id);` e `expect(vi.getTimerCount()).toBe(0);`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 4 test, verdi («Tests 4 passed»).
  - Cosa ho concluso: con `ripeti` c'è un timer in attesa, e `vi.getTimerCount()` lo conta. Dopo `clearInterval(id)` il contatore va a 0.
- Run 9, controllo fatto apposta: aggiungo un quinto test, «runOnlyPendingTimers fa scattare il timer in coda una volta sola»: `vi.useFakeTimers()`, `const f = vi.fn();`, `ripeti(f, 50);`, `vi.runOnlyPendingTimers();`, e `expect(f).toHaveBeenCalledTimes(3);`. L'atteso è 3, sbagliato apposta. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 5 test, 1 fallito: «runOnlyPendingTimers fa scattare il timer in coda una volta sola», alla riga 43, colonna 15. Il messaggio dice `AssertionError: expected "vi.fn()" to be called 3 times, but got 1 times`. Gli altri quattro test sono verdi. Il risultato finale è «Tests 1 failed | 4 passed (5)».
  - Cosa ho concluso: `vi.runOnlyPendingTimers()` fa scattare il timer in coda una volta sola: `f` viene chiamata una volta.
- Run 10. Nel file l'atteso del quinto test diventa `toHaveBeenCalledTimes(1)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 5 test, verdi («Tests 5 passed»).
  - Cosa ho concluso: `vi.runOnlyPendingTimers()` fa scattare il timer in coda una sola volta, e `f` è chiamata una volta.
  - Non provato: che l'intervallo resti in coda dopo `vi.runOnlyPendingTimers()`. Lo vedrei con `vi.getTimerCount()`, che questo test non controlla.
- Run 11, controllo fatto apposta: aggiungo un sesto test, «runAllTimers con un intervallo infinito si ferma con un errore»: `vi.useFakeTimers()`, `ripeti(vi.fn(), 50);`, `vi.runAllTimers();`, senza `expect`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 6 test, 1 fallito: «runAllTimers con un intervallo infinito si ferma con un errore», alla riga 49, colonna 8, su `vi.runAllTimers()`. Il messaggio dice `Error: Aborting after running 10000 timers, assuming an infinite loop!`. Gli altri cinque test sono verdi. Il risultato finale è «Tests 1 failed | 5 passed (6)».
  - Cosa ho concluso: `vi.runAllTimers()` con un intervallo che non si ferma mai si ferma dopo 10000 timer, con un errore. Il rosso viene dall'errore stesso.
- Run 12. Nel file il sesto test diventa «runAllTimers fa finire un intervallo che si ferma da solo»: `vi.useFakeTimers()`, un contatore `chiamate`, un intervallo che si ferma con `clearInterval(id)` alla terza chiamata, `vi.runAllTimers()` e `expect(chiamate).toBe(3)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 6 test, verdi («Tests 6 passed»).
  - Cosa ho concluso: `vi.runAllTimers()` fa scattare l'intervallo finché non si ferma da solo: il contatore arriva a 3.

### Passo 4: la data finta con setSystemTime

- Aggiungo `adesso()` in `attesa.js`, che restituisce `Date.now()`, e lo importo in `attesa.test.js`.
- Run 13, controllo fatto apposta: aggiungo un settimo test, «setSystemTime decide che ora è»: `vi.useFakeTimers()`, `vi.setSystemTime(new Date(1998, 11, 19));`, e `expect(adesso()).toBe(new Date(1998, 11, 20).valueOf());`. L'atteso è di un giorno dopo, sbagliato apposta. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 7 test, 1 fallito: «setSystemTime decide che ora è», alla riga 62, colonna 22. Il messaggio dice `AssertionError: expected 914022000000 to be 914108400000 // Object.is equality`, con `- 914108400000` (il valore che ho scritto) e `+ 914022000000` (il valore ricevuto). Gli altri sei test sono verdi. Il risultato finale è «Tests 1 failed | 6 passed (7)».
  - Cosa ho concluso: `adesso()` restituisce 914022000000 invece di 914108400000: la differenza è 86400000 ms, cioè un giorno.
- Run 14. Nel file l'atteso del settimo test diventa `new Date(1998, 11, 19).valueOf()`, cioè la stessa data impostata. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 7 test, verdi («Tests 7 passed»).
  - Cosa ho concluso: con `vi.setSystemTime` la data letta da `adesso()` è quella impostata.
- Run 15, controllo fatto apposta: aggiungo un ottavo test, «la data finta avanza con i timer finti»: `vi.useFakeTimers()`, `vi.setSystemTime(new Date(1998, 11, 19));`, `const prima = adesso();`, `vi.advanceTimersByTime(1000);`, e `expect(adesso() - prima).toBe(500);`. L'atteso è 500, sbagliato apposta. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 8 test, 1 fallito: «la data finta avanza con i timer finti», alla riga 70, colonna 30. Il messaggio dice `AssertionError: expected 1000 to be 500 // Object.is equality`, con `- 500` (il valore che ho scritto) e `+ 1000` (il valore ricevuto). Gli altri sette test sono verdi. Il risultato finale è «Tests 1 failed | 7 passed (8)».
  - Cosa ho concluso: con `vi.advanceTimersByTime(1000)` la data finta avanza di 1000 ms.
- Run 16. Nel file l'atteso dell'ottavo test diventa `toBe(1000)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 8 test, verdi («Tests 8 passed»).
  - Cosa ho concluso: con `vi.advanceTimersByTime(1000)` la data finta avanza di 1000 ms.

### Passo 5: rimettere a posto con useRealTimers

- Scrivo `pulizia.test.js`, senza `afterEach`: il primo test, «il primo test accende i timer finti», chiama `vi.useFakeTimers()` e controlla `vi.isFakeTimers()` uguale a `true`. Il secondo, «il secondo test trova i timer veri», controlla `vi.isFakeTimers()` uguale a `false`.
- Run 17, controllo fatto apposta: senza pulizia. Comando: `pnpm exec vitest run pulizia.test.js`
  - Cosa ho visto: 2 test, 1 fallito: «il secondo test trova i timer veri», alla riga 9, colonna 31. Il messaggio dice `AssertionError: expected true to be false // Object.is equality`, con `- false` (il valore che ho scritto) e `+ true` (il valore ricevuto). Il primo test è verde. Il risultato finale è «Tests 1 failed | 1 passed (2)».
  - Cosa ho concluso: senza `vi.useRealTimers()`, i timer finti restano accesi nel test dopo: `vi.isFakeTimers()` vale ancora `true`.
- Run 18. Nel file aggiungo `afterEach` all'import da `vitest` e, sopra i test, `afterEach(() => { vi.useRealTimers(); });`. Comando: `pnpm exec vitest run pulizia.test.js`
  - Cosa ho visto: 2 test, verdi («Tests 2 passed»): «il primo test accende i timer finti» e «il secondo test trova i timer veri».
  - Cosa ho concluso: con `vi.useRealTimers()` dopo ogni test, il secondo test trova `vi.isFakeTimers()` uguale a `false`.
  - Ho rilanciato lo stesso comando senza modifiche: non lo conto.

### Passo 6: un debounce con i timer finti

- Scrivo `debounce.js`, con `debounce(callback, ms)`: la funzione restituita cancella il timer precedente con `clearTimeout` e ne avvia uno nuovo con `setTimeout`. Quando il timer scatta, chiama `callback` con gli argomenti dell'ultima chiamata.
- Scrivo `debounce.test.js`, con `afterEach(() => { vi.useRealTimers(); })`. Il test «debounce chiama la funzione una sola volta, con l'ultimo argomento» crea `const f = vi.fn()` e `const cerca = debounce(f, 300)`, chiama `cerca('f')`, avanza di 100 ms, chiama `cerca('fa')`, avanza di 100 ms, chiama `cerca('far')`, avanza di 299 ms e controlla che `f` non sia chiamata. Poi avanza di 1 ms e controlla che `f` sia chiamata una volta sola, con `'far'`.
- Run 19. Comando: `pnpm exec vitest run debounce.test.js`
  - Cosa ho visto: 1 test, verde («Tests 1 passed»): `debounce.test.js (1 test)` e «debounce chiama la funzione una sola volta, con l'ultimo argomento».
  - Cosa ho concluso: a ogni chiamata il timer si sposta in avanti, e `f` viene chiamata una sola volta, 300 ms dopo l'ultima chiamata, con `'far'`.
- Run 20, controllo fatto apposta: in `debounce.js` ho commentato `clearTimeout(timer);`. Comando: `pnpm exec vitest run debounce.test.js`
  - Cosa ho visto: 1 test, fallito: «debounce chiama la funzione una sola volta, con l'ultimo argomento», alla riga 16, colonna 19. Il messaggio dice `AssertionError: expected "vi.fn()" to not be called at all, but actually been called 2 times`. Le chiamate registrate sono `"f"` e `"fa"`. Il risultato finale è «Tests 1 failed (1)».
  - Cosa ho concluso: `f` è stata chiamata con `'f'` e poi con `'fa'`, mai con `'far'`. Il test si ferma alla riga 16, sul primo `expect`: i due `expect` successivi non sono stati eseguiti.
- Run 21. Nel file `debounce.js` ho rimesso `clearTimeout(timer);`. Comando: `pnpm exec vitest run debounce.test.js`
  - Cosa ho visto: 1 test, verde («Tests 1 passed»): `debounce.test.js (1 test)` e «debounce chiama la funzione una sola volta, con l'ultimo argomento».
  - Cosa ho concluso: con `clearTimeout(timer)` il test passa di nuovo: `f` viene chiamata una sola volta, con `'far'`, dopo i 300 ms dall'ultima chiamata.
- Run 22, finale. Comando: `pnpm test; $LASTEXITCODE`, dalla cartella `09-timer-finti`.
  - Cosa ho visto: 3 file, 11 test verdi (`attesa.test.js` 8, `debounce.test.js` 1, `pulizia.test.js` 2), `$LASTEXITCODE` uguale a 0.
  - Cosa ho concluso: l'esercizio è verde con lo script `test`, su tutti e tre i file.

## Dopo l'esercizio

### Cosa ho fatto

- Ho preparato la cartella `09-timer-finti` con Vitest 5.1.1 e lo script `test` (passo 1).
- Ho scritto `attesa.js` con `chiamaDopo`, `ripeti` e `adesso`, e `attesa.test.js` con 8 test (passi 2–4).
- Ho scritto `pulizia.test.js` con 2 test e `afterEach(() => { vi.useRealTimers(); })` (passo 5).
- Ho scritto `debounce.js` e `debounce.test.js` con 1 test (passo 6).
- Comandi usati, già nel diario [comandi.md](comandi.md): `mkdir`, `Set-Location`, `pnpm init`, `pnpm add -D vitest`, `Select-String`, `Get-Content`, `pnpm exec vitest run`, `pnpm test`, `$LASTEXITCODE`.

### Cosa ho visto

- Senza `vi.useFakeTimers()`, `vi.advanceTimersByTime(1000)` genera l'errore «A function to advance timers was called but the timers APIs are not mocked».
- Con 999 ms la funzione non è chiamata.
- Con 1 ms in più la funzione è chiamata.
- `vi.runOnlyPendingTimers()` su un intervallo di 50 ms fa una sola chiamata.
- `vi.runAllTimers()` con un intervallo infinito si ferma con l'errore «Aborting after running 10000 timers, assuming an infinite loop!».
- Con `vi.setSystemTime` la data letta da `adesso()` è quella impostata.
- Senza `vi.useRealTimers()`, nel secondo test `vi.isFakeTimers()` vale `true`.
- Senza `clearTimeout`, `f` è chiamata con `'f'` e `'fa'`, mai con `'far'`.
- Con `clearTimeout`, `f` è chiamata una volta sola, con `'far'`.
- `vi.getTimerCount()` vale 1 dopo `ripeti` e 0 dopo `clearInterval`.
- Con `vi.advanceTimersByTime(1000)` la data finta avanza di 1000 ms.

### Cosa ho verificato

Le run sono numerate come nella traccia.

- Run 1–4 (passo 2): errore senza `vi.useFakeTimers()`, poi verde con 1 test, rosso con 999 ms, verde con 2 test.
- Run 5–12 (passo 3): intervallo, `getTimerCount`, `runOnlyPendingTimers`, `runAllTimers` con e senza fine.
- Run 13–16 (passo 4): `setSystemTime`, `Date` che avanza con `advanceTimersByTime`.
- Run 17–18 (passo 5): senza e con `afterEach(() => { vi.useRealTimers(); })`.
- Run 19–22 (passo 6): debounce con e senza `clearTimeout`, poi `pnpm test` con `$LASTEXITCODE` uguale a 0.

### Cosa ho dedotto e non ancora verificato

- Che i timer finti restino accesi anche tra file diversi: nei run ho visto il fenomeno solo tra test dello stesso file (`pulizia.test.js`). Tra file diversi non l'ho verificato.
- Perché due chiamate e non tre, dopo 499 ms (Run 20): senza `clearTimeout` i timer restano in coda. `'f'` scade a 300 ms, `'fa'` a 400 ms, `'far'` a 500 ms. È un mio calcolo dai numeri del test, non l'ho verificato: lo verificherei con `vi.getTimerCount()` prima dei 299 ms.
- Il valore 914022000000 (Run 13) corrisponde al 19 dicembre 1998 in ora locale: `new Date(1998, 11, 19)` usa l'ora locale, quindi il numero dipende dal fuso orario. È una mia deduzione, non verificata.
- La Run 22 non dice nulla sull'isolamento tra file: ogni file accende o rimette a posto i timer da solo.

### Domande aperte

- `setSystemTime` non fa scattare timer: lo verificherei con un test che fa passare il tempo dopo `setSystemTime` e conta le chiamate.
- `vi.useRealTimers()` scarta davvero i timer in coda? Non l'ho ancora provato.
- L'intervallo resta in coda dopo `vi.runOnlyPendingTimers()` (nota della Run 10): lo vedrei con `vi.getTimerCount()`.
- `vi.advanceTimersByTimeAsync` non l'ho usato.

### Applicazione in Orarium

In Orarium la PR #93, «perf(frontend): wait before searching while the user types», mette un debounce sulla ricerca degli ingredienti.

- **Visto:** con `clearTimeout` il debounce di questo esercizio passa (Run 19 e 21).
- **Visto:** senza `clearTimeout` la funzione viene chiamata due volte (Run 20).
- **Visto:** nella PR le richieste durante la digitazione passano da 6 a 1.
- **Visto:** dopo l'ultimo tasto la lista arriva circa 314 ms dopo (`keyMs` da 78,8 a 392,9 ms).
- **Visto:** con `userEvent.type` e i timer finti il test è andato in timeout a 5000 ms: è un blocco, non un test rosso.
- **Visto:** con `fireEvent.change` e `act(() => vi.advanceTimersByTime(...))` i test sono passati.
- **Dalla pagina:** la pagina di Vitest non parla di debounce.

PR #93, in `main` come `fd52c48`.

## Fonti

- [Vi (vi.useFakeTimers, vi.useRealTimers, vi.advanceTimersByTime, vi.advanceTimersByTimeAsync, vi.runAllTimers, vi.runOnlyPendingTimers, vi.getTimerCount, vi.setSystemTime, vi.isFakeTimers)](https://vitest.dev/api/vi)
