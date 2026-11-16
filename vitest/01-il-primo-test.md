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
 
**Risposta:** Un test è un controllo automatico: scrivo del codice che usa la parte che voglio provare e dice cosa mi aspetto da lei. Ha due pezzi. Il nome, che in una frase dice cosa sto controllando; e la funzione, dentro cui metto una o più `expect`. In `somma.test.js` il nome è «controlla la somma di due numeri» e dentro c'è `expect(somma(2, 3)).toBe(5)`.

- **Visto:** in `somma.test.js` ci sono il nome e l'`expect` (aperto il file).
- **Dalla pagina:** un test ha un nome e una funzione con una o più verifiche (Writing Tests).
 
### 2. Cosa fa `expect`
 
> Cosa fa `expect`? Cosa succede al test se una verifica non è soddisfatta?
 
**Risposta:** `expect` prende un valore, per esempio il risultato di `somma(2, 3)`, e crea una verifica su quel valore: con `.toBe(5)` dico che mi aspetto esattamente 5. Se la verifica non è soddisfatta, `expect` lancia un errore e il test fallisce. Se tutte le verifiche sono soddisfatte, il test passa.

- **Visto:** `AssertionError` nei passi 4 e 6.
- **Dalla pagina:** `expect` crea le verifiche; se non è soddisfatta, lancia un errore (pagina expect).
 
### 3. `test` e `it`
 
> Che differenza c'è tra `test` e `it`?
 
**Risposta:** Vitest li tratta allo stesso modo: cambia solo come suona il nome. In `IngredientList.test.jsx` di Orarium uso `it`, per esempio con `it('shows the ingredients in a table', ...)`, che si legge come una frase: «it shows the ingredients in a table». Lo preferisco perché il nome descrive il comportamento, e chi legge capisce cosa succede senza aprire il test.

- **Visto:** in `IngredientList.test.jsx` i test usano `it` (aperto il file).
- **Dalla pagina:** «They behave identically.» (su `test` e `it`).
- **Dedotto:** `it` mi sembra più leggibile: è un mio gusto.
 
### 4. Come Vitest trova i test
 
> Se creo un file `somma.js` con dentro un test, Vitest lo esegue? Perché?
 
**Risposta:** No. Vitest cerca solo i file che hanno `.test.` o `.spec.` nel nome, come `somma.test.js`. Un file chiamato `somma.js` non viene letto, anche se dentro c'è un test: il test c'è, ma Vitest non lo vede.

- **Visto:** passo 8: con `somma-prova.js` compare «No test files found».
- **Dalla pagina:** Vitest cerca i file con `.test.` o `.spec.` nel nome (Getting Started).
 
### 5. `vitest` e `vitest run`
 
> Che differenza c'è tra `vitest` e `vitest run`? In quale caso li useresti?
 
**Risposta:** `vitest run` esegue i test una volta sola e poi si ferma. `vitest` da solo, in un terminale normale, resta acceso e rilancia i test ogni volta che salvo un file (è il modo watch). Userei `vitest` mentre scrivo il codice, perché vedo subito se ho rotto qualcosa, e `vitest run` quando voglio un risultato definitivo, per esempio prima di fare un commit o nella CI.

- **Visto:** passi 5 e 7: `run` si ferma, il watch resta acceso con «RERUN».
- **Dalla pagina:** il watch è il comportamento in sviluppo; `run` è quello in CI (pagina CLI).
- **Dedotto:** quando usare l'uno o l'altro, come scrivo sopra.
 
### 6. Perché si parte dal rosso
 
> Perché si scrive prima un test che fallisce, e solo dopo il codice che lo fa passare?
 
**Risposta:** Se scrivo prima il test e lo vedo fallire, so che il test può davvero fallire, cioè che controlla qualcosa. Se invece il test passa subito, non so se sta verificando la cosa giusta. Poi scrivo il codice che lo fa diventare verde, e so che quel codice fa esattamente quello che il test chiede.

- **Visto:** passi 3–6: rosso, rosso con i valori, verde, di nuovo rosso con 6.
- **Dedotto:** il codice «fa esattamente quello che il test chiede»: è il mio ragionamento, non una fonte.
 
## Esercizio: la traccia
 
Lavoro in `vitest/01-primo-test`, dentro il lab. Tutti i file di codice li scrivo io, da capo.
Non tocco la cartella `orarium`.
 
### Passo 1: controllare la versione di Node

- Comando: `node -v`
- Cosa ho visto: `v24.16.0`
- Cosa ho concluso: la versione è più recente del minimo richiesto da Vitest (Node 22.12.0), quindi posso andare avanti.

### Passo 2: preparare la cartella e installare Vitest

- Comando: `pnpm init`, poi `pnpm add -D vitest`, dentro `vitest/01-primo-test`
- Cosa ho visto: `pnpm init` ha creato `package.json` con nome `01-primo-test` e `"type": "module"`. `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.0` in `devDependencies`; in tutto ci ha messo circa 9 secondi.
- Cosa ho concluso: Vitest è installato come dipendenza di sviluppo. L'output di `pnpm add` non dice se Vite è arrivato insieme a lui: l'ho controllato dopo con `pnpm why vite`, che mostra `vite@8.3.8` sotto `vitest@5.1.0` e «Found 1 version of vite». Quindi Vite è arrivato con Vitest e non l'ho installato io.

### Passo 3: un test per una funzione che non esiste (rosso)

- Scrivo `somma.test.js`: un test che importa `somma` da `./somma.js` e si aspetta che `somma(2, 3)` sia `5`. Il file `somma.js` non c'è ancora.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: il file `somma.test.js` non è partito: «0 test», «Failed Suites 1», e l'errore `Cannot find module './somma.js'` sulla riga dell'import. Il test non è mai arrivato alla verifica.
- Cosa ho concluso: è rosso, ma non per un risultato sbagliato di `somma`: il test fallisce prima, perché il file `somma.js` non c'è, e non arriva mai alla verifica. Quindi questo rosso non dice ancora niente sul valore che `somma` restituisce.

### Passo 4: una funzione sbagliata (ancora rosso)

- Creo `somma.js` con una funzione `somma` che restituisce un risultato sbagliato di proposito.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: alla prima esecuzione il test è partito ma si è fermato con `TypeError: somma is not a function`, sulla riga 6 del test, senza nessun confronto tra valori (`Tests 1 failed (1)`). In `somma.js` avevo scritto `export default somma;`, mentre il test importa con le graffe, `import { somma } from './somma.js'`. Ho cambiato l'ultima riga in `export { somma };` e rilanciato `pnpm exec vitest run`: il test arriva all'`expect` e fallisce con `AssertionError: expected 6 to be 5 // Object.is equality`. Il messaggio mostra `- Expected: 5` e `+ Received: 6`, e la freccia punta a `somma.test.js:6`, sulla riga di `expect(somma(2, 3))`. Risultato: «1 test | 1 failed».
- Cosa ho concluso: Il `TypeError` dipendeva dall'esportazione: cambiando solo quella è sparito. Questo è il rosso che volevo. Il file esiste, il test lo esegue, e la verifica dice che il valore è 6 invece di 5. Ora so che il test controlla davvero il risultato, e non solo che il file esista.

### Passo 5: la funzione giusta (verde)

- Correggo `somma.js`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: `✓ somma.test.js (1 test)` e `✓ controlla la somma di due numeri`. Risultato: «Test Files 1 passed», «Tests 1 passed».
- Cosa ho concluso: il test è verde. La funzione corretta restituisce 5 e la verifica è soddisfatta. Il ciclo rosso → verde è completo: prima ho visto il test fallire sul valore sbagliato, poi l'ho visto passare con quello giusto.

### Passo 6: il test deve poter fallire

- Cambio il valore atteso nel test, da `5` a `6`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: il test fallisce con `AssertionError: expected 5 to be 6 // Object.is equality`. Il messaggio mostra `- Expected: 6` e `+ Received: 5`, e la freccia punta alla riga 6, su `expect(somma(2, 3))`. Risultato: «1 failed».
- Cosa ho concluso: il test può fallire. Se il valore atteso è sbagliato, il test lo segnala, anche se la funzione è corretta. Quindi un test verde vuol dire qualcosa solo se in precedenza l'ho visto poter diventare rosso.

### Passo 7: il modo watch

- Rimetto `5`. Comando: `pnpm exec vitest` (senza `run`). Con il comando acceso, cambio un valore nel test, salvo, guardo il terminale; poi lo rimetto a posto e salvo. Esco con `Ctrl+C`.
- Cosa ho visto:
  - Avvio con `pnpm exec vitest` (modalità `DEV`): il test è verde, «1 passed», poi «Waiting for file changes».
  - Dopo aver cambiato il valore atteso da `5` a `6` e salvato, Vitest ha rilanciato il test da solo («RERUN somma.test.js x1») e l'ha segnato rosso: `expected 5 to be 6`, con la riga 6 evidenziata.
  - Rimesso `5` e salvato: Vitest ha rilanciato il test («RERUN somma.test.js x2») e il test è di nuovo verde, «1 passed», con «Waiting for file changes».
  - Per sbaglio avevo rinominato il file mentre il watch era acceso: Vitest ha scritto `Test removed... [ somma.test.js ]`. Ho chiuso il watch con `Ctrl+C`: ha scritto `Cancelling test run. Press CTRL+c again to exit forcefully.` ed è tornato il prompt.
- Cosa ho concluso: il modo watch rilancia il test a ogni salvataggio, senza che io lo lanci di nuovo, e mostra subito il risultato. Non lo ferma nemmeno quando il test fallisce. Si accorge anche quando il file viene rinominato: ha scritto `Test removed... [ somma.test.js ]`.
- Uscita: `Ctrl+C` ha chiuso il modo watch, come previsto dal passo.

### Passo 8: un file senza `.test.` nel nome

- Rinomino `somma.test.js` in `somma-prova.js`. Comando: `pnpm exec vitest run`. Poi rimetto il nome giusto.
- Cosa ho visto: `pnpm exec vitest run` non trova nessun test: «No test files found, exiting with code 1». Nell'output c'è anche il criterio che Vitest usa: `include: **/*.{test,spec}.?(c|m)[jt]s?(x)`.
- Cosa ho concluso: con il nome `somma-prova.js` il file non viene letto, anche se il test è identico a prima. Il nome conta, non il contenuto. Il rename nel terminale è stato fatto con `Rename-Item`.
- Rimesso il nome `somma.test.js` con `Rename-Item` e rilanciato `pnpm exec vitest run`: il test torna a essere trovato e verde («1 passed»).

## Dopo l'esercizio
 
### Cosa ho fatto

- Comandi usati (descritti nel [diario](comandi.md)): `node -v`, `pnpm init`, `pnpm add -D vitest`, `pnpm why vite`, `pnpm exec vitest run`, `pnpm exec vitest`, `Rename-Item`.

### Cosa ho visto

- Il rosso si presenta in due forme: file mancante (passo 3) e valore sbagliato (passi 4 e 6). Solo la seconda dice qualcosa sul codice.
- Il `TypeError` del passo 4 dipendeva dall'esportazione: `export default` contro un import con le graffe.
- Il watch rilancia il test a ogni salvataggio, e resta acceso anche quando il test fallisce.
- Un file senza `.test.` nel nome non viene eseguito, anche con lo stesso contenuto.

### Cosa ho verificato

- Node `v24.16.0` soddisfa il minimo di Vitest (22.12.0).
- `pnpm add -D vitest` installa `vitest 5.1.0`, e Vite `8.3.8` arriva con lui (`pnpm why vite`).
- Il ciclo rosso → verde → di nuovo rosso con 6 → verde, con `pnpm exec vitest run` e con il watch.
- In `orarium/frontend/package.json`, riga 16, `test` è `vitest run`; riga 17, `test:watch` è `vitest watch`; riga 44, la dipendenza è `vitest ^5.0.5`.
- `pnpm test` passa con 4 file e 29 test (Vitest 5.0.5). Due di quei file sono esclusi in locale con `.git/info/exclude` e non sono nel repository.

### Cosa ho dedotto e non ancora verificato

- Non so se i test di Orarium restano verdi dopo le prossime modifiche: li ho visti passare una sola volta, oggi.
- Un solo caso, come `somma(2, 3)`, non basta a dire che la funzione è giusta: anche una funzione che restituisce sempre `5` passerebbe questo test. Non ho ancora provato con altri casi.
- `pnpm check` esegue lint, controllo del formato e test, ma non l'ho lanciato: so solo quello che c'è scritto nel file.

### Domande aperte

- Come sono configurati i test di Orarium (ambiente, `@testing-library/react`, `vi.stubGlobal`)? In `IngredientList.test.jsx` non è spiegato, e non ho ancora letto la configurazione.
- Perché in `IngredientList.test.jsx` alcuni test usano `userEvent.type` direttamente e altri `userEvent.setup()`?
- Cosa significa «Object.is equality» nel messaggio di errore?
- Cosa indicano `x1` e `x2` accanto a `RERUN` nel watch?
- Perché Vite compare sotto Vitest: è una dipendenza o un «peer»?

### Applicazione in Orarium

Orarium ha già `pnpm test` in `frontend/`, dove lo script è `vitest run`: esegue i test una volta e si ferma. `pnpm test:watch` è la versione con il watch. Non ho cambiato niente in Orarium e per ora non c'è nessuna PR da fare: è una scelta, perché questo esercizio spiega solo come si scrive e si esegue un test. L'applicazione vera sarà nell'esercizio 08. `IngredientList.test.jsx` mostra come si scrive un test nel progetto: `it` con il nome in inglese e un commento in italiano sopra.
 
## Fonti

- [Getting Started](https://vitest.dev/guide/)
- [Writing Tests](https://vitest.dev/guide/learn/writing-tests)
- [expect](https://vitest.dev/api/expect)
- [Command Line Interface](https://vitest.dev/guide/cli)
- [Node.js, opzioni da riga di comando](https://nodejs.org/api/cli.html)
- [pnpm init](https://pnpm.io/cli/init)
- [pnpm add](https://pnpm.io/cli/add)
- [pnpm exec](https://pnpm.io/cli/exec)
- [pnpm why](https://pnpm.io/cli/why)
- [git status](https://git-scm.com/docs/git-status)
- [Rename-Item](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/rename-item)