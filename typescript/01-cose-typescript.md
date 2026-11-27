# 01 - Cos'è TypeScript

## Teoria

### In due righe

TypeScript è una «variante» di JavaScript (sezione d'apertura). La pagina dice che il rapporto tra i due è piuttosto particolare tra i linguaggi moderni.

### JavaScript e le sue stranezze (sezione *What is JavaScript? A Brief History*)

JavaScript è nato come un semplice linguaggio per i browser, pensato per pezzetti di codice dentro una pagina web. Poi è cresciuto fino a servire applicazioni molto grandi, e si usa anche fuori dal browser, per esempio con node.js.
Ogni linguaggio ha le sue stranezze, e JavaScript ne ha molte per com'è nato. La pagina ne porta tre esempi:

- `"" == 0` è vero, perché l'operatore `==` converte i valori prima di confrontarli.
- `1 < x < 3` è vero per qualunque valore di `x`.
- Se leggi una proprietà che non esiste, JavaScript non dà errore. Con `const obj = { width: 10, height: 15 };`, il calcolo `obj.width * obj.heigth` (con un refuso) dà `NaN`.

La pagina dice che la maggior parte dei linguaggi darebbe errore in questi casi, alcuni già prima di far partire il programma.

### Il controllo statico (sezione *TypeScript: A Static Type Checker*)

Trovare errori nel codice senza eseguirlo si chiama *static checking*. Decidere cosa è un errore guardando che *tipo* di valori si stanno usando si chiama *static type checking*.
TypeScript controlla il programma prima che giri, guardando i tipi dei valori. Per il refuso `obj.heigth` segnala: `Property 'heigth' does not exist on type '{ width: number; height: number; }'. Did you mean 'height'?`

### Un'aggiunta a JavaScript (sezione *A Typed Superset of JavaScript*)

**Sintassi.** TypeScript è un *superset* di JavaScript: la sintassi di JavaScript è valida anche in TypeScript. Quindi puoi mettere codice JavaScript che funziona in un file TypeScript. Gli errori di sintassi restano errori: `let a = (4`, a cui manca una `)`, dà `')' expected.`
**Tipi.** TypeScript è un superset *tipato*: aggiunge regole su come si possono usare i valori. Il refuso `obj.heigth` non è un errore di sintassi, è un uso sbagliato di un valore.
**Un secondo esempio.** `console.log(4 / [])` in JavaScript funziona e stampa `Infinity`. TypeScript dà errore: dividere un numero per un array non ha senso. La pagina dice che potresti anche volerlo fare, ma quasi sempre è un errore. Aggiunge che, spostando codice da JavaScript a TypeScript, a volte compaiono errori di tipo: possono essere problemi veri, oppure TypeScript troppo prudente (*overly conservative*).
**Comportamento a runtime.** TypeScript non cambia mai il comportamento di JavaScript quando il programma gira. Il codice spostato da JavaScript a TypeScript gira nello stesso modo, anche se TypeScript segnala errori di tipo.
**Tipi cancellati.** Dopo il controllo, il compilatore cancella i tipi e produce il codice compilato: JavaScript semplice, senza informazioni sui tipi. TypeScript non aggiunge librerie al programma.

### JavaScript e TypeScript (sezione *Learning JavaScript and TypeScript*)

Non si può imparare TypeScript senza imparare JavaScript: la sintassi e il comportamento a runtime sono gli stessi. La pagina riassume: «TypeScript is JavaScript’s runtime with a compile-time type checker.»

### In breve

| | Cosa dice la pagina |
|---|---|
| Controllo statico | trova errori senza eseguire il codice |
| Controllo statico dei tipi | decide cosa è un errore dal tipo dei valori |
| Superset | il JavaScript valido è anche TypeScript valido |
| Errore di sintassi | resta un errore anche in TypeScript |
| Runtime | TypeScript non lo cambia mai |
| Tipi cancellati | il `.js` compilato non ha informazioni sui tipi |

**Analogia (mia, non della documentazione): il correttore di bozze.**

Il correttore di bozze legge un testo prima che vada in stampa e segna i refusi. Non cambia quello che dice il libro: il libro stampato non contiene i segni del correttore. Con TypeScript è lo stesso: segna gli errori di tipo prima che il programma giri, e il `.js` compilato non ha più i tipi.
Dove l'analogia non regge: un correttore segna i refusi nel testo, mentre TypeScript guarda come usi i valori. E la pagina dice che a volte TypeScript segnala come errore qualcosa che potevi volere (*overly conservative*).

## Dalla documentazione (parole originali)

Le frasi sono dalla pagina [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html) del TypeScript Handbook.

- Sezione *TypeScript: A Static Type Checker*: "Detecting errors in code without running it is referred to as static checking."; "Determining what’s an error and what’s not based on the kinds of values being operated on is known as static type checking."
- Sezione *Syntax*: "TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS."
- Sezione *Types*: "TypeScript is a typed superset, meaning that it adds rules about how different kinds of values can be used."
- Sezione *Runtime Behavior*: "As a principle, TypeScript never changes the runtime behavior of JavaScript code."; "This means that if you move code from JavaScript to TypeScript, it is guaranteed to run the same way, even if TypeScript thinks that the code has type errors."
- Sezione *Erased Types*: "This means that once your code is compiled, the resulting plain JS code has no type information."
- Sezione *Learning JavaScript and TypeScript*: "TypeScript is JavaScript’s runtime with a compile-time type checker."

## Con parole mie

### 1. Controllo statico

> Cosa vuol dire controllare un programma «senza eseguirlo», e cosa aggiunge la parola «type» in *static type checking*?

**Risposta:** Vuol dire controllare il codice prima di farlo girare. Il programma non parte, e il controllo cerca gli errori da solo. La parola «type» dice in base a cosa si decide se c'è un errore: si guarda che tipo di valore stai usando, per esempio un numero, un testo o un array. Dividere un numero per un array, per esempio, è un errore di tipo.

- **Dalla pagina:** (sezione *TypeScript: A Static Type Checker*) «Determining what’s an error and what’s not based on the kinds of values being operated on is known as static type checking.»

### 2. Il refuso `obj.heigth`

> Cosa succede in JavaScript con `obj.width * obj.heigth`, e cosa succede in TypeScript?

**Risposta:** In JavaScript non succede niente di visibile come errore, e il programma va avanti. In TypeScript, invece, `tsc` segnala `heigth` e suggerisce `height`, prima che il programma giri.

- **Dalla pagina:** (sezione *TypeScript: A Static Type Checker*) il messaggio di TypeScript è: «Property 'heigth' does not exist on type '{ width: number; height: number; }'. Did you mean 'height'?»
- **Dedotto:** `obj.heigth` vale `undefined`, quindi `10 * undefined` dà `NaN`.

### 3. Superset

> Cosa vuol dire che TypeScript è un «superset» di JavaScript? Un errore di sintassi come `let a = (4` è un errore anche in TypeScript?

**Risposta:** Vuol dire che TypeScript contiene tutto JavaScript. Il codice JavaScript corretto è anche codice TypeScript corretto. Un errore di sintassi, come `let a = (4` senza la `)`, resta un errore anche in TypeScript. Sbagliare la sintassi non dipende da quale dei due linguaggi usi.

- **Dalla pagina:** (sezione *Syntax*) «TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS.»
- **Visto:** l'errore `')' expected.` compare anche in TypeScript, al passo 5.

### 4. Il comportamento a runtime

> Se TypeScript segnala un errore di tipo, il programma gira lo stesso? Come gira rispetto al JavaScript?

**Risposta:** Sì, il programma gira lo stesso. L'errore di tipo viene segnalato prima, ma non cambia come il codice si comporta quando parte. Il codice gira allo stesso modo di come girerebbe in JavaScript. Quindi un errore di tipo non fa partire il programma in modo diverso: segnala solo un possibile problema.

- **Dalla pagina:** (sezione *Runtime Behavior*) «As a principle, TypeScript never changes the runtime behavior of JavaScript code.» «This means that if you move code from JavaScript to TypeScript, it is guaranteed to run the same way, even if TypeScript thinks that the code has type errors.»
- **Visto:** al passo 6, `node 03-refuso.js` stampa `NaN`, come la riga dell'area nel passo 2.

### 5. Un'applicazione: un refuso in Orarium

> Prendi un componente del frontend di Orarium che legge una proprietà di un oggetto (per esempio `ingredient.price_cents`). Cosa succederebbe oggi, in JavaScript, se scrivessi la proprietà con un refuso? E cosa dice la pagina che farebbe TypeScript? Segna cosa hai provato e cosa no.

**Risposta:** Nel componente `IngredientList.jsx` il prezzo si mostra con `formatPrice(ingredient.price_cents)`. Se scrivessi `ingredient.price_cent`, senza la `s`, in JavaScript non comparirebbe nessun errore. La proprietà non esiste, quindi vale `undefined`. `formatPrice` divide per 100 e il risultato è `NaN`. Nella tabella comparirebbe «NaN €» al posto del prezzo, e il programma andrebbe avanti.

- **Visto:** `formatPrice` è in `frontend/src/utils/formatPrice.js`: divide i centesimi per 100 e formatta il risultato in euro. Con Node, la stessa formattazione dà «1,20 €» con `price_cents`, e «NaN €» con `price_cent`.
- **Non provato:** non ho provato nel browser né nel componente.
- **Dedotto:** TypeScript segnalerebbe il refuso prima che il programma giri, come `heigth` nella domanda 2. Questo vale solo se il tipo di `ingredient` è noto. Oggi nel repo c'è solo la descrizione JSDoc di `Ingredient` in `api/ingredients.js`, non TypeScript. Quindi non l'ho ancora provato su Orarium.

## Esercizio: la traccia

Lavoro in `typescript/01-cose-typescript`, dentro il lab. Non tocco la cartella `orarium`.
Ogni passo ha un suo file, con un nome che dice cosa prova.
I file `03-refuso.js`, `04-divisione.js` e `05-sintassi.js` li ha scritti `tsc`, mentre `02-javascript.js` l'ho scritto io.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.

### Passo 1: preparare la cartella

- Comando: `mkdir typescript`, `mkdir 01-cose-typescript`, poi dentro: `pnpm init`, `pnpm add -D typescript`, `pnpm exec tsc --version`
- Cosa guardare: la versione di TypeScript installata.
- Cosa ho visto: `mkdir 01-cose-typescript` ha creato la cartella dentro `typescript/`. Il primo `pnpm init` e `pnpm add` li avevo lanciati da `typescript/`, invece che da dentro la cartella: ho cancellato `package.json`, `pnpm-lock.yaml` e `node_modules` da `typescript/`, poi ho rifatto i comandi dentro `01-cose-typescript/`. `pnpm init` ha scritto `package.json` con nome `01-cose-typescript` e `"type": "module"`. `pnpm add -D typescript` ha aggiunto `typescript 7.0.2`, in 831 ms, con pnpm v11.29.0. `pnpm exec tsc --version` stampa `Version 7.0.2`.
- Cosa ho concluso: la cartella è pronta. Dentro `01-cose-typescript/` ci sono `package.json`, `pnpm-lock.yaml` e `node_modules`, e la versione installata è la 7.0.2.

### Passo 2: JavaScript non dà errore (`02-javascript.js`)

- Scrivo: l'esempio con `obj` e il refuso `obj.heigth` (sezione *What is JavaScript?*), con un `console.log` dell'area; poi `console.log(4 / [])` e `console.log("" == 0)`.
- Comando: `node 02-javascript.js`
- Cosa guardare: cosa stampa ogni riga, e se `node` segnala un errore.
- Cosa ho visto: tre cose, in quest'ordine.
  1. `node` non trovava il file, perché ero nella cartella sopra.
  2. Poi `ReferenceError: obj is not defined` alla riga 1, perché nel file c'era `obj = …` senza `const`.
  3. Poi, con `const`, `node 02-javascript.js` stampa, nell'ordine, `NaN`, `Infinity` e `true`, senza errori.
- Domanda aperta: perché `obj = …` senza `const` dà errore qui? Il `"type": "module"` di `package.json` è un'ipotesi mia, non della pagina.
- Cosa ho concluso: JavaScript non segnala il refuso. Stampa `NaN` e va avanti. Anche `4 / []` stampa `Infinity` e `"" == 0` stampa `true`, senza errori.

### Passo 3: TypeScript segnala il refuso (`03-refuso.ts`)

- Scrivo: le due righe dell'esempio `obj` con il refuso (sezione *TypeScript: A Static Type Checker*), con un `console.log` dell'area.
- Comando: `pnpm exec tsc 03-refuso.ts; Get-ChildItem`
- Cosa guardare: il messaggio di errore (codice, riga, suggerimento) e se nella cartella nasce un `03-refuso.js`.
- Cosa ho visto: `tsc` segnala un errore alla riga 3, colonna 29: `Property 'heigth' does not exist on type '{ width: number; height: number; }'. Did you mean 'height'?` (codice `TS2551`). Sotto, indica dove è dichiarato `height`, alla riga 1. Nella cartella è comparso `03-refuso.js`, anche se c'è un errore.
  - Dedotto: forse perché non ho usato `--noEmitOnError`. Non l'ho provato qui.
- Cosa ho concluso: TypeScript trova il refuso prima che il programma giri, e propone `height`. Ma scrive lo stesso il `.js`. Il `.js` lo guardo al passo 6.

### Passo 4: dividere un numero per un array (`04-divisione.ts`)

- Scrivo: `console.log(4 / []);` (sezione *Types*).
- Comando: `pnpm exec tsc 04-divisione.ts`
- Cosa guardare: il messaggio di errore e il codice.
- Cosa ho visto: `tsc` segnala un errore alla riga 1, colonna 17, sul `[]`: `The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.` (codice `TS2363`). Nella cartella è comparso `04-divisione.js`, anche se c'è un errore.
- Cosa ho concluso: TypeScript segnala la divisione per un array prima che il programma giri. Il `.js` è stato scritto lo stesso, come nel passo 3.

### Passo 5: un errore di sintassi (`05-sintassi.ts`)

- Scrivo: `let a = (4` (sezione *Syntax*).
- Comando: `pnpm exec tsc 05-sintassi.ts`
- Cosa guardare: il messaggio di errore.
- Cosa ho visto: `tsc` segnala un errore alla riga 1, colonna 11, dopo `(4`: `')' expected.` (codice `TS1005`). Nella cartella è comparso `05-sintassi.js`, anche se c'è un errore.
- Cosa ho concluso: l'errore di sintassi viene segnalato anche in TypeScript, prima che il programma giri. Il `.js` è stato scritto lo stesso, come nei passi 3 e 4.

### Passo 6: il programma gira lo stesso (`03-refuso.js`)

- Comando: `node 03-refuso.js` (se il passo 3 ha scritto il file) e confronto con quello che stampa il passo 2.
- Cosa guardare: cosa stampa, rispetto al passo 2.
- Cosa ho visto: `node 03-refuso.js` stampa `NaN`, senza errori. Ho letto `03-refuso.js` con `Get-Content`: alla riga 1 c'è `"use strict";`, poi le due righe di `03-refuso.ts`. Nel passo 2, la riga dell'area stampava `NaN` allo stesso modo.
- Cosa ho concluso: il programma gira allo stesso modo anche dopo il controllo di TypeScript. Stampa lo stesso `NaN` del JavaScript.

## Dopo l'esercizio

### Cosa ho fatto

- Passo 1: `mkdir 01-cose-typescript`, poi `pnpm init`, `pnpm add -D typescript` e `pnpm exec tsc --version` dentro la cartella. La prima prova l'avevo fatta nella cartella sopra: l'ho cancellata e rifatta.
- Passo 2: `node 02-javascript.js`.
- Passo 3: `pnpm exec tsc 03-refuso.ts; Get-ChildItem`.
- Passo 4: `pnpm exec tsc 04-divisione.ts; Get-ChildItem`.
- Passo 5: `pnpm exec tsc 05-sintassi.ts; Get-ChildItem`.
- Passo 6: `node 03-refuso.js` e `Get-Content 03-refuso.js`.

### Cosa ho visto

- Passo 1: la cartella `01-cose-typescript/` contiene ora `package.json`, `pnpm-lock.yaml` e `node_modules`. TypeScript è la 7.0.2.
- Passo 2: prima `node` non trovava il file, perché ero nella cartella sopra. Poi `ReferenceError: obj is not defined` alla riga 1, perché mancava `const`. Con `const`, stampa `NaN`, `Infinity` e `true`, senza errori.
- Passo 3: `tsc` segnala `heigth` alla riga 3, con il suggerimento `height` (`TS2551`). Il `03-refuso.js` viene scritto lo stesso.
- Passo 4: `tsc` segnala la divisione per un array alla riga 1 (`TS2363`). Il `04-divisione.js` viene scritto lo stesso.
- Passo 5: `tsc` segnala `')' expected.` alla riga 1 (`TS1005`). Il `05-sintassi.js` viene scritto lo stesso.
- Passo 6: `node 03-refuso.js` stampa `NaN`, come la riga dell'area nel passo 2.

### Cosa ho verificato

- La pagina dice che TypeScript non cambia il comportamento a runtime. Al passo 6, il `.js` con il refuso stampa lo stesso `NaN` del JavaScript.
- La pagina dice che `let a = (4` dà `')' expected.` anche in TypeScript. Al passo 5 è comparso lo stesso errore.

### Cosa ho dedotto e non ancora verificato

- Il `.js` viene scritto con errori perché il comando non ha `--noEmitOnError`. Non l'ho provato con quell'opzione.

### Domande aperte

- Perché `obj = …` senza `const` dà errore qui? Il `"type": "module"` di `package.json` è un'ipotesi mia, non della pagina.
- Con `--noEmitOnError`, il `.js` con errori non viene scritto? Lo vedo se rifaccio il passo 3 con quell'opzione.

### Applicazione in Orarium

- **Visto:** `IngredientList.jsx` mostra il prezzo con `formatPrice(ingredient.price_cents)`. `formatPrice` è in `frontend/src/utils/formatPrice.js`.
- **Visto:** con Node, `price_cents` dà «1,20 €» e `price_cent` dà «NaN €».
- **Non provato:** nel browser e nel componente. Su Orarium non ho ancora provato TypeScript.

## Fonti

- [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook.
