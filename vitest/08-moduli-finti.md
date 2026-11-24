# 08 - Moduli finti

## Teoria

### L'idea in due righe

Finora ho finto una funzione (`vi.fn`), un metodo di un oggetto (`vi.spyOn`), una variabile globale (`vi.stubGlobal`) e una variabile d'ambiente (`vi.stubEnv`). Qui fingo un intero file: `vi.mock` dice a Vitest di sostituire un modulo con un altro, così il codice che lo importa trova quello finto.

### Sostituire un modulo

`vi.mock('./percorso.js', () => ({ nome: vi.fn() }))` sostituisce il modulo che sta a quel percorso. La funzione che passo come secondo argomento si chiama factory (fabbrica): restituisce un oggetto con le cose che il modulo esporta, e tutti gli `import` di quel modulo ricevono quell'oggetto. Se il modulo ha un'esportazione che non metto nella factory, il codice non la trova.

### Il trabocchetto dello spostamento in alto

Una chiamata a `vi.mock` viene spostata in cima al file, prima di tutti gli `import`, qualunque sia la riga in cui l'ho scritta. Per questo la factory non può usare variabili definite fuori da lei: quando gira, quelle variabili non esistono ancora. Per condividere un valore con la factory c'è `vi.hoisted`, che esegue una funzione in cima al file e restituisce il suo risultato.

### Un modulo finto a metà

`vi.importActual('./percorso.js')` importa il modulo vero, senza farsi sostituire. Dentro una factory serve a fare un mock parziale: prendo tutte le esportazioni vere e ne cambio solo alcune.

### In breve

| | Cosa fa |
|---|---|
| `vi.mock('./file.js', factory)` | sostituisce il modulo: gli `import` ricevono quello che restituisce la factory |
| spostamento in alto | `vi.mock` gira prima degli `import`, qualunque sia la riga |
| variabili fuori dalla factory | non si possono usare; per condividerle c'è `vi.hoisted` |
| `vi.hoisted(() => ...)` | esegue la funzione in cima al file e restituisce il risultato |
| `vi.importActual('./file.js')` | importa il modulo vero, per fare un mock parziale |

## Dalla documentazione (parole originali)

- Da [Vi, vi.mock](https://vitest.dev/api/vi): "Substitutes all imported modules from provided path with another module."; "The call to `vi.mock` is hoisted, so it doesn't matter where you call it."; "It will always be executed before all imports."; "If the factory function is defined, all imports will return its result."; "`vi.mock` is hoisted (in other words, moved) to top of the file."; "This also means that you cannot use any variables inside the factory that are defined outside the factory."; "If you need to reference some variables outside of its scope, you can define them inside `vi.hoisted` and reference them inside `vi.mock`."
- Da [Vi, vi.hoisted](https://vitest.dev/api/vi): "All static import statements in ES modules are hoisted to the top of the file, so any code that is defined before the imports will actually be executed after imports are evaluated."; "This method returns the value that was returned from the factory."
- Da [Vi, vi.importActual](https://vitest.dev/api/vi): "Imports module, bypassing all checks if it should be mocked."; "Can be useful if you want to mock module partially."
- Da [Vi, vi.doMock](https://vitest.dev/api/vi): "It works the same way but isn't hoisted."; "Beware that it only mocks subsequent imports."
- Da [Vi, vi.mock](https://vitest.dev/api/vi): "If you are mocking a module with default export, you will need to provide a default key within the returned factory function object."

## Con parole mie

### 1. Sostituire un modulo

> Cosa fa `vi.mock` e cosa ricevono gli `import` di quel modulo?

**Risposta:** `vi.mock` sostituisce il modulo che sta al percorso che gli scrivo. Gli `import` di quel modulo ricevono quello che restituisce la factory.

- **Visto:** nel passo 2, con la funzione finta di `prezzoAlChilo`, `costoOrdine('farina', 3)` vale `30`: il codice riceve il valore della factory.
- **Dalla pagina:** «Substitutes all imported modules from provided path with another module.»; «If the factory function is defined, all imports will return its result.»

### 2. La factory

> Cosa deve restituire la factory? Cosa succede a un'esportazione che non ci metto?

**Risposta:** La factory restituisce un oggetto con le esportazioni che il modulo finto deve avere. Se un'esportazione non la metto nella factory, il codice che la importa non la trova.

- **Visto:** nel passo 2, con `prezzoAlChilo` tolto dalla factory, il test riceve un errore: `No "prezzoAlChilo" export is defined on the "./prezzi.js" mock`. Non riceve `undefined`.

### 3. Spostamento in alto

> Cosa significa che `vi.mock` è spostato in cima al file? Importa la riga in cui lo scrivo?

**Risposta:** Vuol dire che `vi.mock` viene eseguito in cima al file, prima di tutti gli `import`. No: la riga in cui lo scrivo non conta.

- **Visto:** nel passo 3, con `vi.mock` scritto in fondo al file, dopo il test e gli import, il test passa: `costoOrdine('farina', 3)` vale `30`.
- **Dalla pagina:** «`vi.mock` is hoisted (in other words, moved) to top of the file.»; «The call to `vi.mock` is hoisted, so it doesn't matter where you call it.»

### 4. Variabili fuori dalla factory

> Perché la factory non può usare una variabile definita fuori da lei? Come condivido un valore con la factory?

**Risposta:** La factory non può usare variabili definite fuori da lei, perché `vi.mock` viene spostato in cima al file. Per condividere un valore lo definisco dentro `vi.hoisted`, che restituisce il valore, e lo uso dentro `vi.mock`.

- **Visto:** nel passo 4 il messaggio di Vitest dice che la factory gira prima che `const prezzoFinto = vi.fn()` sia eseguita: «Cannot access 'prezzoFinto' before initialization», alla riga 7, colonna 20. Il messaggio dice anche che la chiamata a `vi.mock` è spostata in cima al file. Nel passo 5, con `vi.hoisted`, la factory usa il valore condiviso e il test passa.
- **Dalla pagina:** «This also means that you cannot use any variables inside the factory that are defined outside the factory.»; «If you need to reference some variables outside of its scope, you can define them inside `vi.hoisted` and reference them inside `vi.mock`.»

### 5. Un mock parziale

> Come faccio a fingere solo una funzione di un modulo e tenere vere le altre?

**Risposta:** Dentro la factory importo il modulo vero con `vi.importActual`, poi prendo tutte le sue esportazioni e ne sostituisco solo una.

- **Visto:** nel passo 6, con `sconto` mancante il test è rosso; con `vi.importActual` nella factory il test passa, e `costoScontato('farina', 3, 50)` vale `15`.
- **Dalla pagina:** «Imports module, bypassing all checks if it should be mocked.»; «Can be useful if you want to mock module partially.»; nell'esempio della pagina: `const originalModule = await vi.importActual('./example.js')` e `return { ...originalModule, get: vi.fn() }`.

## Esercizio: la traccia

Lavoro in `vitest/08-moduli-finti`, dentro il lab. Tutti i file di codice li scrivo io, da capo.
Non tocco la cartella `orarium`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un test rosso di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio ho usato `pnpm exec vitest run`.

### Passo 1: preparare la cartella

- Comando: `mkdir vitest\08-moduli-finti`, poi `Set-Location vitest\08-moduli-finti`, poi `pnpm init`, poi `pnpm add -D vitest`.
- Cosa ho visto: `mkdir` ha creato la cartella `08-moduli-finti` in `vitest` (output `d-----`). `pnpm init` ha scritto `package.json` con nome `08-moduli-finti`, `"type": "module"` e lo script `test` con `echo "Error: no test specified" && exit 1`. `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.1` in `devDependencies`, in 1,9 secondi. Il banner di pnpm dice «Update available! 11.29.0 → 12.23.0»: non aggiorno pnpm durante l'esercizio.
- Dopo `pnpm init` ho impostato lo script `test` a `vitest run` nel `package.json`. Controllo con `Select-String -Path package.json -Pattern '"test"|vitest'`: riga 7 `"test": "vitest run"` e riga 21 `"vitest": "^5.1.1"`.
- Cosa ho concluso: la cartella è pronta, con Vitest 5.1.1 e lo script `test` impostato a `vitest run`.

### Passo 2: sostituire un modulo con vi.mock

- Scrivo `prezzi.js` e `ordine.js`. Controllo con `Get-Content prezzi.js, ordine.js`: mostra `prezzoAlChilo(nome)`, che restituisce `2` per la farina e `5` per gli altri, e `costoOrdine(nome, chili)`, che moltiplica `prezzoAlChilo(nome)` per i chili.
- Scrivo `ordine.test.js`, con un test «un modulo sostituito risponde quello che decido io»: il test importa `prezzoAlChilo` da `./prezzi.js`, chiama `prezzoAlChilo.mockReturnValue(10)` e controlla che `costoOrdine('farina', 3)` valga `30`. Il file ha tre versioni, in quest'ordine.
- Prima versione (run 1): senza `vi.mock`.
- Run 1. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, fallito: «un modulo sostituito risponde quello che decido io». Il messaggio dice `TypeError: prezzoAlChilo.mockReturnValue is not a function`, alla riga 6, colonna 19.
  - Cosa ho concluso: non c'era ancora nessun `vi.mock`, quindi `prezzoAlChilo` era la funzione vera, senza `mockReturnValue`.
- Seconda versione (run 2): aggiungo `vi.mock('./prezzi.js', () => ({ prezzoAlChilo: vi.fn() }))`, senza importare `vi` da `vitest`.
- Run 2, errore mio (rosso accidentale). Comando: `pnpm exec vitest run`
  - Cosa ho visto: 0 test, suite fallita: `ReferenceError: vi is not defined`, alla riga 5, colonna 1, sulla riga di `vi.mock`. Il risultato finale è «Test Files 1 failed (1)», «Tests no tests».
  - Cosa ho concluso: in questa run `vi` non era importato in `ordine.test.js`. L'errore è sulla riga di `vi.mock`, non nel test.
- Terza versione (run 3): importo `vi` da `vitest` nella prima riga di `ordine.test.js`.
- Run 3. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, verde («Tests 1 passed»): `ordine.test.js (1 test)` e «un modulo sostituito risponde quello che decido io».
  - Cosa ho concluso: con `prezzoAlChilo` sostituito, `costoOrdine('farina', 3)` vale `30`: `ordine.js` riceve la funzione finta, non quella vera.
- Run 4, controllo fatto apposta: ho cambiato l'atteso in `toBe(6)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, fallito, alla riga 11, colonna 38. Il messaggio dice `AssertionError: expected 30 to be 6 // Object.is equality`, con `- 6` (il valore che ho scritto) e `+ 30` (il valore ricevuto). Il risultato finale è «Tests 1 failed (1)».
  - Cosa ho concluso: la funzione finta risponde `10`, e `costoOrdine` lo moltiplica per `3`: il risultato è `30`.
- Run 5. Riporto l'atteso a `toBe(30)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, verde («Tests 1 passed»).
  - Cosa ho concluso: con `toBe(30)` il test torna verde.
- Run 6, controllo fatto apposta: ho tolto `prezzoAlChilo` dalla factory di `vi.mock`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, fallito, alla riga 8, colonna 5, su `prezzoAlChilo.mockReturnValue(10)`. Il messaggio dice `Error: [vitest] No "prezzoAlChilo" export is defined on the "./prezzi.js" mock. Did you forget to return it from "vi.mock"?`. Il risultato finale è «Tests 1 failed (1)».
  - Cosa ho concluso: se un'esportazione manca nella factory, il test riceve un errore, non `undefined`.
- Run 7. Rimetto `prezzoAlChilo` nella factory. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, verde («Tests 1 passed»).
  - Cosa ho concluso: con `prezzoAlChilo` di nuovo nella factory, il test torna verde.

### Passo 3: la riga di vi.mock non conta

- Run 8. Sposto `vi.mock` in fondo al file, dopo il test e gli import. Il resto del file non cambia. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, verde («Tests 1 passed»): `ordine.test.js (1 test)` e «un modulo sostituito risponde quello che decido io».
  - Cosa ho concluso: la riga di `vi.mock` non conta: anche in fondo al file il mock funziona, come dice la pagina.
- Run 9, controllo fatto apposta: ho cambiato `vi.mock` in `vi.doMock` in fondo al file, e ho rilanciato `pnpm exec vitest run`. Il risultato è 1 test, fallito, alla riga 6, colonna 19. Il messaggio dice `TypeError: prezzoAlChilo.mockReturnValue is not a function`.
  - Cosa ho concluso: con `vi.doMock` in fondo al file, `prezzoAlChilo` è rimasto la funzione vera: il test si comporta come se non ci fosse nessun mock. Con `vi.mock` nello stesso punto, invece, il test era verde (run 8).
  - Dalla pagina: «It works the same way but isn't hoisted.»; «Beware that it only mocks subsequent imports.»
  - Dedotto: lo spostamento in alto spiega la differenza tra `vi.mock` e `vi.doMock`. È una mia deduzione dalla pagina, non l'ho ancora verificato a parte.

### Passo 4: una variabile fuori dalla factory

- Scrivo `ordine.test.js` con `const prezzoFinto = vi.fn()` fuori dalla factory, e `vi.mock('./prezzi.js', () => ({ prezzoAlChilo: prezzoFinto }))`. Il test «una variabile fuori dalla factory» chiama `prezzoFinto.mockReturnValue(10)` e controlla che `costoOrdine('farina', 3)` valga `30`.
- Run 10, controllo fatto apposta. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 0 test, suite fallita. Il messaggio dice `Error: [vitest] There was an error when mocking a module. If you are using "vi.mock" factory, make sure there are no top level variables inside, since this call is hoisted to top of the file.`. Poi `ReferenceError: Cannot access 'prezzoFinto' before initialization`, alla riga 7, colonna 20, dentro la factory, sulla riga `prezzoAlChilo: prezzoFinto`. Il risultato finale è «Test Files 1 failed (1)», «Tests no tests».
  - Cosa ho concluso: il messaggio di Vitest dice che la chiamata a `vi.mock` è spostata in cima al file, quindi la factory gira prima che `const prezzoFinto = vi.fn()` sia eseguita.

### Passo 5: condividere un valore con vi.hoisted

- Scrivo `ordine.test.js` con `const mocks = vi.hoisted(() => ({ prezzoAlChilo: vi.fn() }))` in cima, e `vi.mock('./prezzi.js', () => ({ prezzoAlChilo: mocks.prezzoAlChilo }))`. Il test «un valore condiviso con vi.hoisted» chiama `mocks.prezzoAlChilo.mockReturnValue(10)` e controlla che `costoOrdine('farina', 3)` valga `30`.
- Run 11. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 1 test, verde («Tests 1 passed»): `ordine.test.js (1 test)` e «un valore condiviso con vi.hoisted».
  - Cosa ho concluso: con `vi.hoisted` l'oggetto `mocks` esiste già quando gira la factory, e la factory lo usa senza errore.

### Passo 6: un mock parziale con vi.importActual

- Aggiungo in `prezzi.js` la funzione `sconto(prezzo, percento)`, che restituisce `prezzo - (prezzo * percento) / 100`, ed esporta anche `sconto`. Aggiungo in `ordine.js` la funzione `costoScontato(nome, chili, percento)`, che restituisce `sconto(prezzoAlChilo(nome) * chili, percento)`, e importo `sconto` da `prezzi.js`.
- Aggiungo a `ordine.test.js` un secondo test, «un mock parziale: solo il prezzo è finto», che chiama `mocks.prezzoAlChilo.mockReturnValue(10)` e controlla che `costoScontato('farina', 3, 50)` valga `15`. La factory di `vi.mock` restituisce solo `prezzoAlChilo`.
- Run 12. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, 1 fallito. Il primo, «un valore condiviso con vi.hoisted», è verde. Il secondo, «un mock parziale: solo il prezzo è finto», è fallito. Il messaggio dice `Error: [vitest] No "sconto" export is defined on the "./prezzi.js" mock. Did you forget to return it from "vi.mock"?`, con il suggerimento di usare `importOriginal` nella factory. L'errore parte da `ordine.js`, riga 8, colonna 12, dentro `costoScontato`, sulla riga `sconto(...)`, ed è chiamato da `ordine.test.js`, riga 19, colonna 12.
  - Cosa ho concluso: l'esportazione mancante non è stata chiesta dal test, ma dal codice che il test sta provando: `costoScontato` chiama `sconto`, e la factory non la restituisce.
- Run 13. Correzione: nella factory di `vi.mock` importo il modulo vero con `vi.importActual('./prezzi.js')`, e restituisco `...originale` con `prezzoAlChilo: mocks.prezzoAlChilo`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, verdi («Tests 2 passed»): `ordine.test.js (2 tests)`, «un valore condiviso con vi.hoisted» e «un mock parziale: solo il prezzo è finto».
  - Cosa ho concluso: con `vi.importActual` nella factory, `sconto` arriva a `costoScontato`, e `costoScontato('farina', 3, 50)` vale `15`.
- Run 14, controllo fatto apposta: ho cambiato l'atteso in `toBe(30)`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: 2 test, 1 fallito: «un mock parziale: solo il prezzo è finto», alla riga 23, colonna 44. Il messaggio dice `AssertionError: expected 15 to be 30 // Object.is equality`, con `- 30` (il valore che ho scritto) e `+ 15` (il valore ricevuto). Il risultato finale è «Tests 1 failed | 1 passed (2)».
  - Cosa ho concluso: `costoScontato` restituisce `15`: con il prezzo finto `10`, tre chili fanno `30`, e lo sconto del 50% lo porta a `15`.
- Run 15, finale. Comando: `pnpm test`, poi `$LASTEXITCODE`
  - Cosa ho visto: `Test Files 1 passed (1)`, `Tests 2 passed (2)`, codice di uscita 0.
  - Cosa ho concluso: l'esercizio è verde con lo script `test`, sul file `ordine.test.js`, con entrambi i test.

## Dopo l'esercizio

### Cosa ho fatto

- Ho preparato la cartella `08-moduli-finti` con Vitest 5.1.1 e lo script `test` (passo 1).
- Ho scritto `prezzi.js`, `ordine.js` e `ordine.test.js`, e ho provato `vi.mock`, `vi.doMock`, `vi.hoisted` e la factory con una variabile esterna.
- Al passo 6 ho aggiunto `sconto` in `prezzi.js`, `costoScontato` in `ordine.js` e un secondo test: la run 12 è rossa. Con la correzione con `vi.importActual` nella factory, la run 13 è verde, e la run finale con `pnpm test` è verde.
- Comandi usati, già nel diario [comandi.md](comandi.md): `mkdir`, `Set-Location`, `pnpm init`, `pnpm add -D vitest`, `Select-String`, `Get-Content`, `pnpm exec vitest run`, `pnpm test`, `$LASTEXITCODE`. Il comando `git grep` è nuovo nel diario: la riga è del 2026-11-23, e l'ho usato per cercare nel mio `orarium`.

### Cosa ho visto

- `vi.mock` sostituisce il modulo: `costoOrdine` riceve la funzione finta (passo 2).
- Se la factory non restituisce un'esportazione, il test riceve un errore, non `undefined` (passo 2).
- `vi.mock` in fondo al file funziona; `vi.doMock` in fondo al file no (passo 3).
- Una variabile fuori dalla factory dà errore, e il messaggio di Vitest spiega che la chiamata è spostata in cima al file (passo 4).
- `vi.hoisted` permette alla factory di usare il valore condiviso (passo 5).
- Nel passo 6, un'esportazione mancante usata dal codice dà errore dentro `ordine.js`.
- Con `vi.importActual` nella factory, le esportazioni vere arrivano al codice e solo `prezzoAlChilo` è finto (passo 6).

### Cosa ho verificato

Conteggi run per run, in ordine. Le run rosse sono indicate come errori o come controlli fatti apposta.

- Run 1 (passo 2): 1 test, rosso (`TypeError`, riga 6).
- Run 2 (passo 2): 0 test, rosso accidentale (`vi is not defined`).
- Run 3 (passo 2): 1 test, verde.
- Run 4 (passo 2): controllo con `toBe(6)`, 1 test, rosso (riga 11).
- Run 5 (passo 2): ritorno a `toBe(30)`, 1 test, verde.
- Run 6 (passo 2): controllo senza `prezzoAlChilo` nella factory, 1 test, rosso (riga 8).
- Run 7 (passo 2): factory ripristinata, 1 test, verde.
- Run 8 (passo 3): `vi.mock` in fondo, 1 test, verde.
- Run 9 (passo 3): controllo con `vi.doMock` in fondo, 1 test, rosso (riga 6).
- Run 10 (passo 4): controllo con la variabile fuori dalla factory, 0 test, rosso (riga 7).
- Run 11 (passo 5): 1 test, verde.
- Run 12 (passo 6): 2 test, 1 rosso (`sconto` mancante, riga 8 di `ordine.js`).
- Run 13 (passo 6): dopo la correzione con `vi.importActual`, 2 test, verdi.
- Run 14 (passo 6): controllo con `toBe(30)`, 2 test, 1 rosso (riga 23, `expected 15 to be 30`).
- Run 15 (finale): `pnpm test`, 1 file, 2 test verdi, codice di uscita 0.

### Cosa ho dedotto e non ancora verificato

- Perché `vi.doMock` in fondo al file non sostituisce il modulo (passo 3): la pagina dice che non è spostato in cima e che vale solo per gli `import` successivi, ma la spiegazione completa è mia.

### Domande aperte

- `importOriginal` e `vi.importActual` sono la stessa cosa?
- Con `vi.doMock` scritto prima degli `import`, il mock funziona?
- La factory viene richiamata a ogni test o una volta sola?

### Applicazione in Orarium

Ho cercato nel mio `orarium` locale, in `frontend/src`, in sola lettura, con `git grep`: `vi.mock`, `vi.hoisted`, `importActual`, `vi.doMock`, `fetchIngredients` ed `export default`. Ho confrontato le righe con il repo pubblico al commit `b582ce6`: coincidono.

- **Visto:** in `frontend/src` non compaiono `vi.mock`, `vi.hoisted`, `importActual` né `vi.doMock`.
- **Visto:** `frontend/src/App.test.jsx`, riga 9, usa `vi.fn(() => new Promise(() => {}))`, e `frontend/src/IngredientList.test.jsx`, riga 21, usa `vi.stubGlobal('fetch', vi.fn())`. Sono `vi.fn` e `vi.stubGlobal`, non mock di moduli.
- **Visto:** con una ricerca nei file locali (non con `git grep`), `Componenti.test.jsx` e `Esercizi.test.js` risultano usare `vi.fn`. Sono file locali non tracciati: non li conto come lavoro di Orarium.
- **Visto:** `frontend/src/IngredientList.jsx`, riga 2, importa `fetchIngredients` da `./api/ingredients.js` come import di default, e la riga 20 lo chiama. `frontend/src/api/ingredients.js`, riga 25, definisce `fetchIngredients`, e la riga 43 lo esporta con `export default`.
- **Dalla pagina:** «If you are mocking a module with default export, you will need to provide a default key within the returned factory function object.»
- **Dedotto:** un test diretto di `fetchIngredients` con `vi.stubGlobal`, e non con `vi.mock`, sarebbe il candidato naturale. Non l'ho ancora scritto.

Nessuna PR per ora, è una scelta.

## Fonti

- [Vi (vi.mock, vi.doMock, vi.hoisted, vi.importActual)](https://vitest.dev/api/vi)
- [Repo Orarium, commit b582ce6](https://github.com/francesco-cassese/orarium/commit/b582ce6)
