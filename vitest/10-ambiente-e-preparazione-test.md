# 10 - Ambiente e preparazione dei test

Citazioni dalla documentazione di Vitest v5.1.1. Non ho confrontato la versione 5.0.5 usata in Orarium.

## Teoria

### L'idea in due righe

Il codice di un test gira dentro un ambiente: l'insieme di cose che trova già pronte, come le API di un browser. Vitest ne offre più di uno, e uno è quello di partenza.
In questo esercizio guardo come si sceglie l'ambiente, come si prepara qualcosa che serve prima di ogni file di test e cosa significa che ogni file gira isolato.

### Scegliere l'ambiente

L'ambiente di partenza è `node`. `jsdom` e `happy-dom` fingono il browser mettendo a disposizione le sue API. Se imposto `environment` nel file di configurazione, vale per tutti i file di test del progetto. Per un ambiente diverso solo in un file, scrivo in cima a quel file un commento che inizia con `@vitest-environment`, seguito dal nome dell'ambiente.

### Il file di preparazione

I `setupFiles` sono file che Vitest esegue prima di ogni file di test, nello stesso processo dei test. Vitest ignora quello che questi file esportano. Servono per le cose da preparare sempre, senza ripeterle in ogni file di test.

### Isolare ogni file

Di norma Vitest esegue ogni file di test in un ambiente isolato, e come dipende dal `pool`: con `forks` ogni file gira in un processo figlio separato, con `threads` in un `Worker` separato, con `vmThreads` in un contesto VM separato. Il pool di partenza è `forks`.
Isolare costa tempo. Se i test non dipendono da effetti che restano in giro e puliscono il loro stato, la pagina dice che con `isolate: false` vanno più veloci. In quel caso i file che stanno nello stesso worker condividono l'ambiente e lo stato dei moduli. Con il pool `vmThreads` l'isolamento non si può disattivare.

**Analogia (mia, non della documentazione): la teglia per ogni fornata.**

Ogni file di test è una fornata. L'isolamento è usare una teglia pulita per ogni fornata: ci vuole più tempo, ma niente resta attaccato da quella prima. Con `isolate: false` uso la stessa teglia per più fornate: è più veloce, ma se una fornata lascia dei residui, la successiva li trova.
Dove l'analogia si ferma: una teglia sporca la vedo e la lavo a mano; in un test lo stato rimasto non si vede, e non so ancora cosa, oltre all'ambiente e allo stato dei moduli, due file nello stesso worker condividano davvero.

### In breve

| | Cosa fa |
|---|---|
| `environment` | dice in quale ambiente gira il codice dei test; di partenza `node` |
| `jsdom` | finge il browser con le sue API |
| `// @vitest-environment jsdom` | sceglie l'ambiente per un solo file |
| `setupFiles` | file eseguiti prima di ogni file di test, nello stesso processo |
| `pool` | decide come sono separati i file: `forks` (di partenza), `threads`, `vmThreads`, `vmForks` |
| `isolate` | dice se ogni file ha un ambiente isolato; di partenza `true`; non ha effetto su `vmThreads` e `vmForks` |

## Dalla documentazione (parole originali)

- Da [Test Environment](https://vitest.dev/guide/environment): "Vitest provides `environment` option to run code inside a specific environment."; "`node` is default environment"; "`jsdom` emulates browser environment by providing Browser API"; "`happy-dom` emulates browser environment by providing Browser API"; "When setting `environment` option in your config, it will apply to all the test files in your project."
- Da [Test Environment, Environments for Specific Files](https://vitest.dev/guide/environment): "To have more fine-grained control, you can use control comments to specify environment for specific files."; "Control comments are comments that start with `@vitest-environment` and are followed by the environment name:"
- Da [setupFiles](https://main.vitest.dev/config/setupfiles): "Paths to setup files resolved relative to the root."; "They will run before each test file in the same process."; "Vitest will ignore any exports from these files."; "If isolation is disabled, imported modules are cached, but the setup file itself is executed again before each test file, meaning that you are accessing the same global object before each test file."
- Da [Improving Performance](https://vitest.dev/guide/improving-performance): "By default Vitest runs every test file in an isolated environment based on the pool:"; "`threads` pool runs every test file in a separate `Worker`"; "`forks` pool runs every test file in a separate forked child process"; "`vmThreads` pool runs every test file in a separate VM context, but it uses workers for parallelism"; "By default Vitest runs tests in `pool: 'forks'`."
- Da [Improving Performance, disattivare l'isolamento](https://vitest.dev/guide/improving-performance): "This greatly increases test times, which might not be desirable for projects that don't rely on side effects and properly cleanup their state"; "In this case disabling isolation will improve the speed of your tests."; "To do that, you can provide `--no-isolate` flag to the CLI or set `test.isolate` property in the config to `false`."; "If you are using `vmThreads` pool, you cannot disable isolation."
- Da [isolate](https://main.vitest.dev/config/isolate): "Run tests in an isolated environment. This option has no effect on `vmThreads` and `vmForks` pools."
- Da [pool](https://vitest.dev/config/pool): "Pool used to run tests in."
- Da [Test Environments](https://vitest.dev/guide/environment), tabella dei pool: "none - files in the same worker share the environment and module state"

## Con parole mie

### 1. Cos'è l'ambiente

> Cos'è l'ambiente di un test e qual è quello di partenza di Vitest?

**Risposta:** L'ambiente è ciò che il codice del test trova già pronto quando parte: oggetti globali, API del browser e così via. Di partenza Vitest usa `node`. Penso che `node` non abbia né `window` né `document`: lo verifico nel passo 2.

- **Visto:** Run 1: `typeof window` e `typeof document` valgono `'undefined'`.
- **Dalla pagina:** «`node` is default environment».

### 2. node e jsdom

> In cosa è diverso `jsdom` da `node`? Come dico a Vitest di usare `jsdom` per tutti i file, e come per un file solo?

**Risposta:** `jsdom` simula un browser dentro Node: mette a disposizione `window`, `document` e le altre API del browser, così posso testare codice che le usa. Per tutto il progetto scrivo `environment: 'jsdom'` nel file di configurazione. Per un solo file scrivo in cima al file `// @vitest-environment jsdom`. Serve installare il pacchetto `jsdom`: lo vedo nel passo 3.

- **Visto:** Run 2: senza `jsdom` installato, con il commento, il worker non parte. Run 3: con `jsdom` installato e il commento, `typeof window` vale `'object'`. Run 4: con `environment: 'jsdom'` in configurazione il test passa senza il commento.
- **Dalla pagina:** «`jsdom` emulates browser environment by providing Browser API».

### 3. I file di preparazione

> A cosa servono i `setupFiles` e quando vengono eseguiti?

**Risposta:** I `setupFiles` sono file che Vitest esegue prima di ogni file di test, nello stesso processo. Servono per le cose da preparare sempre, come la pulizia dopo ogni test (la pagina usa questo esempio), così non le ripeto in ogni file. Vitest ignora quello che questi file esportano.

- **Visto:** Run 5: il setup gira prima di ogni file, e ogni file vede `conteggioSetup = 1`.
- **Dalla pagina:** «They will run before each test file in the same process.»; «Vitest will ignore any exports from these files.»

### 4. Isolare

> Cosa significa che Vitest esegue ogni file di test in un ambiente isolato? Cosa cambia con `isolate: false`?

**Risposta:** Vitest esegue ogni file di test in un ambiente separato. Con `forks` ogni file ha un processo suo, con `threads` un `Worker` suo, con `vmThreads` un contesto VM suo. Credo che così i file non si influenzino a vicenda: lo verifico nel passo 6. L'avvio però costa tempo.

Con `isolate: false` più file dello stesso worker condividono ambiente e moduli. È più veloce, ma se un file lascia qualcosa in giro, il file dopo lo trova. La pagina parla di oggetto globale condiviso; un mock non ripristinato o un timer attivo sono mie ipotesi. Con `vmThreads` l'isolamento non si può disattivare.

- **Visto:** Run 6 e 7, senza `--no-isolate`: pid diversi e `valore = 1`. Run 8, con `--no-isolate` e `--no-file-parallelism`: stesso pid, il contatore arriva a 2. Run 9, con `--no-isolate` da solo: pid diversi e `valore = 1`.
- **Dalla pagina:** «To do that, you can provide `--no-isolate` flag to the CLI or set `test.isolate` property in the config to `false`.»; «In this case disabling isolation will improve the speed of your tests.»
- **Dedotto:** che un mock non ripristinato o un timer attivo restino in giro con `isolate: false`: è una mia ipotesi, la pagina non lo dice.
- **Non provato:** quali altri oggetti condividano due file oltre a moduli e `globalThis`.

### 5. Un caso concreto

> In Orarium il file `src/test/setup.js` fa `cleanup()` dopo ogni test. Con `isolate: false` cosa potrebbe andare storto in un test di React, e cosa non cambierebbe?

**Risposta:** Se `setup.js` chiama `cleanup()` dopo ogni test, React smonta i componenti resi dal test precedente. Con `isolate: false` può succedere che un file lasci qualcosa che `cleanup()` non tocca: un modulo con stato interno, uno store condiviso, una modifica a `window`, un mock non ripristinato. Il file successivo parte con quello stato e può fallire in modo che sembra casuale.

Il file di preparazione viene rieseguito prima di ogni file, ma i moduli importati restano in cache. Sono mie ipotesi: la pagina parla solo di oggetto globale condiviso e di cache dei moduli. Non cambierebbero la pulizia del DOM dentro ogni test e il codice dei test. Non ho ancora controllato quali moduli di Orarium tengono stato condiviso: è un'ipotesi da verificare.

- **Dalla pagina:** «If isolation is disabled, imported modules are cached, but the setup file itself is executed again before each test file, meaning that you are accessing the same global object before each test file.»
- **Non provato:** quali moduli di Orarium tengono stato condiviso.

## Esercizio: la traccia

Lavoro in `vitest/10-ambiente-e-setup`, dentro il lab.
Non tocco la cartella `orarium`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un errore di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio uso `pnpm exec vitest run`.

### Passo 1: preparare la cartella

- Comando: `mkdir vitest\10-ambiente-e-setup`, poi `Set-Location vitest\10-ambiente-e-setup`, poi `pnpm init`, poi `pnpm add -D vitest`.
- Cosa ho visto: `mkdir` ha creato la cartella `10-ambiente-e-setup` in `vitest`. `pnpm init` ha scritto `package.json` con nome `10-ambiente-e-setup`, `"type": "module"` e lo script `test` con `echo "Error: no test specified" && exit 1`. `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.1` in `devDependencies`, in 1,1 secondi, con pnpm v11.29.0.
- Cosa ho concluso: la cartella è pronta, con Vitest 5.1.1. Ho cambiato lo script `test` nel `package.json` da `echo "Error: no test specified" && exit 1` a `vitest run`.
- Alla fine, `pnpm test`: stampa `$ vitest run` ed esegue i 4 file, 4 test verdi.

### Passo 2: typeof window nell'ambiente di partenza

- Scrivo `ambiente.test.js` con un test che controlla `typeof window` e `typeof document`, senza nessuna configurazione.
- Run 1. Comando: `pnpm exec vitest run`
- Cosa ho visto: 1 test, verde (`Tests 1 passed (1)`): `ambiente.test.js (1 test)` e «nell ambiente di partenza window e document non ci sono». Tempi: `Duration 167ms (transform 46%, import 36%, worker 13%, tests 6%)`, senza la voce `environment`.
- Cosa ho concluso: nell'ambiente di partenza `typeof window` e `typeof document` valgono `'undefined'`.

### Passo 3: il commento @vitest-environment jsdom, prima e dopo l'installazione di jsdom

- Run 2. Metto `// @vitest-environment jsdom` in cima a `ambiente.test.js`, senza `jsdom` installato. Comando: `pnpm exec vitest run`
  - Cosa ho visto: nessun test eseguito. Il riepilogo dice `Test Files no tests`, `Tests no tests`, `Errors 1 error`. L'output, con i percorsi accorciati (ho tolto la parte con il nome utente del mio computer):

    ```
    Error: [vitest-pool]: Failed to start forks worker for test files …/vitest/10-ambiente-e-setup/ambiente.test.js.
     ❯ node_modules/.pnpm/vitest@5.1.1_vite@8.3.8/node_modules/vitest/dist/chunks/index.ER9afepi.js:6037:94
     ❯ process.processTicksAndRejections node:internal/process/task_queues:104:5
     ❯ Pool.schedule node_modules/.pnpm/vitest@5.1.1_vite@8.3.8/node_modules/vitest/dist/chunks/index.ER9afepi.js:6037:5

    Caused by: Error: Cannot find package 'jsdom' imported from …\vitest\10-ambiente-e-setup\node_modules\.pnpm\vitest@5.1.1_vite@8.3.8\node_modules\vitest\dist\chunks\index.C7Nn66Gy.js
     ❯ Object.getPackageJSONURL node:internal/modules/package_json_reader:301:9
     ❯ packageResolve node:internal/modules/esm/resolve:768:81
     ❯ moduleResolve node:internal/modules/esm/resolve:859:18
     ❯ defaultResolve node:internal/modules/esm/resolve:992:11
     ❯ #cachedDefaultResolve node:internal/modules/esm/loader:691:20
     ❯ #resolveAndMaybeBlockOnLoaderThread node:internal/modules/esm/loader:708:38
     ❯ ModuleLoader.resolveSync node:internal/modules/esm/loader:740:52
     ❯ #resolve node:internal/modules/esm/loader:673:17
     ❯ ModuleLoader.getOrCreateModuleJob node:internal/modules/esm/loader:593:35
     ❯ node:internal/modules/esm/loader:622:32

    Serialized Error: { code: 'ERR_MODULE_NOT_FOUND' }
    ```

  - Cosa ho concluso: con il commento e senza il pacchetto `jsdom` installato, il worker non parte e il test non viene eseguito. Il messaggio dice che manca il pacchetto `jsdom`.
- Run 3. Installo `jsdom`. Comando: `pnpm add -D jsdom`, poi `pnpm exec vitest run`
  - Cosa ho visto (installazione): `pnpm add -D jsdom` ha aggiunto 29 pacchetti e ne ha rimosso 1 (`Packages: +29 -1`), e ha scritto `jsdom 31.0.1` in `devDependencies`, in 2,4 secondi. Non so ancora quale pacchetto è stato rimosso.
  - Cosa ho visto (run): 1 test, rosso: «nell ambiente di partenza window e document non ci sono», alla riga 6, colonna 25, su `expect(typeof window).toBe('undefined')`. Il messaggio dice `AssertionError: expected 'object' to be 'undefined' // Object.is equality`, con `Expected: "undefined"` e `Received: "object"`. Il riepilogo dice `Test Files 1 failed (1)`, `Tests 1 failed (1)`. Tempi: `Duration 715ms (environment 93%, transform 3%, import 2%, tests 1%, worker 1%)`.
  - Cosa ho concluso: con il commento e `jsdom` installato, `typeof window` vale `'object'` in questo file. Il test non è cambiato, quindi il suo titolo («ambiente di partenza») non descrive più l'ambiente del file.

### Passo 4: environment nel file di configurazione

- Tolgo il commento `@vitest-environment jsdom` da `ambiente.test.js`, cambio le due asserzioni in `.not.toBe('undefined')` e il nome del test in «con jsdom window e document ci sono».
- Scrivo `vitest.config.js` con `defineConfig` da `vitest/config` e `test: { environment: 'jsdom' }`, per tutti i file.
- Run 4. Comando: `pnpm exec vitest run`.
  - Cosa ho visto: `✓ ambiente.test.js (1 test)`, con il test «con jsdom window e document ci sono», `Tests 1 passed (1)`. Tempo: `764 ms`, con `environment 95%`. Non c'è la voce `setup`, che compare solo dal passo 5.
  - Cosa ho concluso: con `environment: 'jsdom'` in configurazione e senza `setupFiles`, il test di `ambiente.test.js` passa senza il commento nel file.

### Passo 5: un setupFiles che conta le esecuzioni

- Scrivo `setup.js`, che fa `globalThis.conteggioSetup = (globalThis.conteggioSetup ?? 0) + 1` e stampa il valore con `console.log`.
- Scrivo `setup.test.js`, con un test che stampa `globalThis.conteggioSetup` e controlla solo con `toBeDefined()`.
- Run 5. Aggiungo `setupFiles: ['./setup.js']` accanto a `environment: 'jsdom'` in `vitest.config.js`. Comando: `pnpm exec vitest run`
  - Cosa ho visto: `Test Files 2 passed (2)`, `Tests 2 passed (2)`. In `ambiente.test.js` il setup stampa `setup.js eseguito, conteggioSetup = 1`; in `setup.test.js` stampa lo stesso `conteggioSetup = 1`, e il test stampa `conteggioSetup = 1`.
  - Cosa ho concluso: il setup gira prima di ogni file, e ogni file vede 1.

### Passo 6: stato condiviso, con isolamento e con --no-isolate

- Scrivo `contatore.js`, con una variabile di modulo che parte da 0 e la funzione `incrementa()`, che la aumenta di 1 e la restituisce.
- Scrivo `primo.test.js` e `secondo.test.js`: ognuno chiama `incrementa()` una volta, stampa il valore e `process.pid` con `console.log`, e controlla solo che il valore sia un numero.
- Faccio quattro esecuzioni, nell'ordine:
  - Run 6, di partenza. Comando: `pnpm exec vitest run`
    - Cosa ho visto: 4 file, verdi (`Tests 4 passed (4)`). `primo.test.js valore = 1 pid = 24260`; `secondo.test.js valore = 1 pid = 6576`. Il setup stampa `conteggioSetup = 1` in ogni file.
    - Cosa ho concluso: i due file hanno pid diversi e ognuno vede `valore = 1`: il contatore non è condiviso.
  - Run 7, un solo worker, isolamento attivo. Comando: `pnpm exec vitest run --no-file-parallelism`
    - Cosa ho visto: 4 file, verdi (`Tests 4 passed (4)`). `primo.test.js valore = 1 pid = 27892`; `secondo.test.js valore = 1 pid = 2136`. Il setup stampa `conteggioSetup = 1` in ogni file. In fondo Vitest scrive «Environment jsdom was created 4 times» e propone `pool: 'vmThreads'` o `isolate: false`.
    - Cosa ho concluso: con `--no-file-parallelism` i due file hanno pid diversi e `valore = 1`: in questa esecuzione il contatore non è condiviso.
  - Run 8, un solo worker, senza isolamento. Comando: `pnpm exec vitest run --no-file-parallelism --no-isolate`
    - Cosa ho visto: 4 file, verdi (`Tests 4 passed (4)`). Il setup stampa `conteggioSetup` 1, 2, 3, 4 nell'ordine `primo`, `ambiente`, `setup`, `secondo`. `primo.test.js valore = 1 pid = 25256`; `secondo.test.js valore = 2 pid = 25256`.
    - Cosa ho concluso: stesso pid, e nel secondo file il contatore è a 2: il modulo è condiviso. Il setup rigira prima di ogni file e conta 4 esecuzioni.
  - Run 9, `--no-isolate` da solo. Comando: `pnpm exec vitest run --no-isolate`
    - Cosa ho visto: 4 file, verdi (`Tests 4 passed (4)`). `primo.test.js valore = 1 pid = 8984`; `secondo.test.js valore = 1 pid = 15460`. Il setup stampa `conteggioSetup = 1` in ogni file.
    - Cosa ho concluso: in questa esecuzione, senza `--no-file-parallelism`, i pid erano diversi e nessun file ha trovato lo stato dell'altro.

## Dopo l'esercizio

### Cosa ho fatto

- Ho preparato `vitest/10-ambiente-e-setup` con Vitest 5.1.1 (passo 1).
- Ho creato `ambiente.test.js` (passo 2), poi installato `jsdom` 31.0.1 (passo 3).
- Ho messo `environment: 'jsdom'` e `setupFiles: ['./setup.js']` in `vitest.config.js` (passi 4–5).
- Ho creato `setup.js` e `setup.test.js` (passo 5), e `contatore.js`, `primo.test.js` e `secondo.test.js` (passo 6).
- Comandi usati, già nel diario [comandi.md](comandi.md): `mkdir`, `Set-Location`, `pnpm init`, `pnpm add -D vitest`, `pnpm add -D jsdom`, `pnpm exec vitest run`, `pnpm exec vitest run --no-file-parallelism`, `pnpm exec vitest run --no-isolate`, `pnpm test`.

### Cosa ho visto

- Con il commento `@vitest-environment jsdom` e senza `jsdom` installato, il worker non parte: «Cannot find package 'jsdom'».
- Con `jsdom` installato e il commento, `typeof window` vale `'object'` nel file.
- Con `environment: 'jsdom'` in configurazione, il test di `ambiente.test.js` è verde senza commento.
- Il setup gira prima di ogni file. Nei run 5, 6, 7 e 9 ogni file vede `conteggioSetup = 1`; nel run 8 i file vedono 1, 2, 3, 4.
- Nei run 6, 7 e 9 i due file hanno pid diversi e stampano `valore = 1`.
- Nel run 8 i due file hanno lo stesso pid, e il secondo trova il contatore a 2.
- Nel run 7 Vitest scrive «Environment jsdom was created 4 times» e propone `pool: 'vmThreads'` o `isolate: false`.

### Cosa ho verificato

Le run sono numerate come nella traccia. Le run 2 e 3 sono fallimenti voluti: servono a vedere il messaggio di errore e il rosso con `jsdom`.

- Run 1 (passo 2): 1 test, verde. `window` e `document` valgono `'undefined'`.
- Run 2 (passo 3): errore, nessun test eseguito: manca `jsdom`.
- Run 3 (passo 3): 1 test, rosso: con `jsdom` installato `typeof window` vale `'object'`.
- Run 4 (passo 4): 1 test, verde, senza il commento nel file. Tempo: 764 ms, `environment 95%`.
- Run 5 (passo 5): 2 file, verdi. Il setup stampa `conteggioSetup = 1` in ogni file.
- Run 6 (passo 6): 4 file, verdi. Pid diversi, `valore = 1` in entrambi i file.
- Run 7 (passo 6): con `--no-file-parallelism`, 4 file verdi. Pid diversi, `valore = 1` in entrambi.
- Run 8 (passo 6): con `--no-file-parallelism --no-isolate`, 4 file verdi. Stesso pid, contatore a 2 nel secondo file.
- Run 9 (passo 6): con `--no-isolate`, 4 file verdi. Pid diversi, `valore = 1` in entrambi.
- Ipotesi delle risposte 1, 2 e 4: la risposta 1 (`window` e `document` assenti in `node`) è verificata dal passo 2. La risposta 2 (serve il pacchetto `jsdom`) è verificata dal passo 3. La risposta 4 è verificata solo in parte: nel run 8 il contatore del modulo è condiviso; nei run 6 e 7 i due file non condividono né il contatore del modulo né `conteggioSetup`. Non dice nulla su «i file non si influenzano» in generale; mock e timer non li ho provati.
- La forma di `vitest.config.js` coincide con l'esempio della sezione Test Environments di Improving Performance: stesso `import { defineConfig } from 'vitest/config'` e `environment: 'jsdom'`. L'esempio della pagina ha anche `pool: 'vmThreads'`, che il mio file non ha.

### Cosa ho dedotto e non ancora verificato

- Con più file che girano in un worker, la condivisione comparirebbe anche senza `--no-file-parallelism`: non l'ho provato.
- Che cosa condividano gli altri oggetti oltre a moduli e `globalThis` (mock, timer): non l'ho provato.
- Quale pacchetto abbia rimosso `pnpm add -D jsdom` (`-1`): non l'ho controllato.

### Domande aperte

- Quale pacchetto ha rimosso `pnpm add -D jsdom`?

### Applicazione in Orarium

Ho misurato il tempo di `vitest run` su Orarium, con i flag da riga di comando e senza cambiare la configurazione, per capire se ha senso cambiare ambiente o isolamento. Ho usato i tre file del repo (`App.test.jsx`, `IngredientList.test.jsx`, `api/ingredients.test.js`, 22 test in tutto), scelti con un filtro sul nome. Nella mia cartella ci sono altri due file (`Esercizi.test.js` e `Componenti.test.jsx`, 16 test), che tengo fuori da Git con `.git/info/exclude`: con tutti e cinque i file i test sono 38.

Versioni: Vitest 5.0.5, jsdom ^30.1.3, Node 24.16.0, pnpm 11.29.0, PowerShell 5.1. Condizioni del computer: non dichiarate.

Metodo: per ogni variante ho fatto un riscaldamento, scartato, e cinque esecuzioni. Ordine: partenza, `--no-isolate`, `--pool=vmThreads`, `--no-isolate --no-file-parallelism`, partenza di controllo.

- **Visto:** i due blocchi di partenza hanno mediane di 3,23 s e 3,27 s: le condizioni sono rimaste stabili.
- **Visto:** `--no-isolate` da solo e `--pool=vmThreads` non mostrano differenze visibili rispetto alla partenza; con `vmThreads` compare la voce `worker` al 3%.
- **Visto:** con `--no-isolate --no-file-parallelism` la quota `environment` scende al 21–22% (invece di 44–46%), `tests` sale al 68–69%, e la durata è 3,06 s (2,98–3,15): circa 0,2 s in meno, con intervalli che non si sovrappongono.
- **Visto:** in tutte le varianti 22 test su 22 sono passati.
- **Visto:** `IngredientList.test.jsx` da solo ha impiegato circa 2 s nelle due esecuzioni intere che ho visto (tre test da circa mezzo secondo).
- **Visto:** il messaggio di Vitest su jsdom creato più volte e il suggerimento su `vmThreads` e `isolate: false` non sono comparsi in nessuna esecuzione di oggi.
- **Dalla copia pubblica di orarium:** `src/test/setup.js` importa i matcher di `@testing-library/jest-dom/vitest` e fa `cleanup()` in `afterEach`.
- **Visto:** riscaldamento con tutti e cinque i file: `environment` al 56%, 38 test, 4,21 s.
- **Dalla pagina:** (Improving Performance, sezione Profile First) «The percentages are relative to the sum of all tracked phases, not to the wall-clock time: phases run in parallel workers, so their sum is usually larger than the run itself.» (serve a leggere le percentuali).
- **Dalla pagina:** (Improving Performance, sezione Test Environments, tabella, riga `isolate: false`): «tests must not depend on a clean window or module state; run vitest doctor to check».
- **Dalla pagina:** (Improving Performance, sezione Test Environments, tabella, riga `pool: 'vmThreads'`): «test code runs in a VM realm: cross-realm instanceof edge cases with externalized packages, and memory is not reclaimed as reliably (see vmMemoryLimit)».
- **Dalla pagina:** (Improving Performance, sezione Profile First, fase `tests`) «A run dominated by this phase has little to gain from configuration changes.»
- **Dalla pagina:** (pagina Pool, sezione `vmThreads`) «This makes tests run faster, but the VM module is unstable when running ESM code.»
- **Dedotto:** la quota `environment` che si dimezza con i due flag insieme dipende dal fatto che `jsdom` viene creato una volta sola invece di tre. È coerente con le misure e con la tabella, ma non l'ho visto direttamente, perché non ho stampato i pid.
- **Dedotto:** per me il guadagno di circa 0,2 s non vale il compromesso, perché con tre file e con `IngredientList` che occupa circa 2 s di timer veri il risparmio è piccolo.
- **Non provato:** quanti worker abbiano usato i tre file nei blocchi in parallelo.
- **Non provato:** se `vitest doctor` esiste nella 5.0.5.
- **Non provato:** se i test futuri restano indipendenti senza isolamento, e quali moduli di Orarium tengono stato condiviso.
- **Non provato:** da dove venisse il 60% di `environment` annotato prima.

Nessuna PR per ora, è una scelta.

## Fonti

- [Test Environment](https://vitest.dev/guide/environment)
- [setupFiles](https://main.vitest.dev/config/setupfiles)
- [Improving Performance](https://vitest.dev/guide/improving-performance)
- [isolate](https://main.vitest.dev/config/isolate)
- [pool](https://vitest.dev/config/pool)