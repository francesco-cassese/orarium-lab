# Appunti: Quando si scopre un errore

**Modulo:** TypeScript
**Parte:** 01b
**Titolo:** Quando si scopre un errore: a runtime o prima
**Data:** 27/11/2026
**Fonte:** [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook

Come leggere questi appunti: ogni affermazione ha un'etichetta. **Visto** è quello che ho osservato in un output. **Dalla fonte** è quello che dice la pagina. **Spiegazione mia** e **Dedotto** sono cose mie. **Non provato** è quello che non ho verificato.

**Indice rapido**

1. [Cosa voglio capire](#1-cosa-voglio-capire)
2. [Passi](#2-passi)
   - 2.1 [Preparazione: la cartella e TypeScript](#21-preparazione-la-cartella-e-typescript)
   - 2.2 [Passo 3: un errore che compare solo quando la riga gira](#22-passo-3-un-errore-che-compare-solo-quando-la-riga-gira)
   - 2.3 [Passo 4: tsc segnala l'errore prima](#23-passo-4-tsc-segnala-lerrore-prima)
3. [Key Takeaways](#3-key-takeaways)
4. [Glossario](#4-glossario)
5. [Con parole mie](#5-con-parole-mie)
6. [Da verificare](#6-da-verificare)
7. [Fonti](#7-fonti)

## 1. Cosa voglio capire

Quando si scopre un errore in un programma: mentre gira o prima che giri. E cosa fa TypeScript.

## 2. Passi

### 2.1 Preparazione: la cartella e TypeScript

- **Obiettivo:** avere TypeScript installato in una cartella di esercizi.
- **Cosa ho fatto:** nella cartella `esercizi` ho eseguito `pnpm init`, `pnpm add -D typescript` e `pnpm exec tsc --version`.
- **Cosa ho visto:**
  - `package.json` con `"name": "esercizi"` (preso dal nome della cartella), `"version": "1.0.0"` e `"type": "module"`.
  - Nell'output di `pnpm add -D typescript`: `+ typescript 7.0.2` sotto `devDependencies`, con pnpm v11.29.0.
  - `tsc --version` ha stampato `Version 7.0.2`.
- **Cosa significa:** **Visto:** TypeScript 7.0.2 è installato in `esercizi` tra le dipendenze di sviluppo. **Dalla fonte:** la pagina non spiega come si installa TypeScript.
- **Parola nuova:** `devDependencies`, le dipendenze che servono solo mentre sviluppo.

### 2.2 Passo 3: un errore che compare solo quando la riga gira

- **Obiettivo:** vedere un errore che `node` segnala solo quando la riga viene eseguita.
- **Cosa ho fatto:** ho eseguito `node errore-a-runtime.js` dalla cartella [esercizi](esercizi/), con il file [errore-a-runtime.js](esercizi/errore-a-runtime.js). Ho eseguito questo passo prima di creare il `package.json` della Preparazione: il suo output non è stato ottenuto con `"type": "module"`.
- **Cosa ho visto:**

  ```
  Inizio
  …\esercizi\errore-a-runtime.js:4
  console.log(costante.nome);
                       ^

  TypeError: Cannot read properties of undefined (reading 'nome')
      at Object.<anonymous> (…\esercizi\errore-a-runtime.js:4:22)
      righe at … omesse

  Node.js v24.16.0
  ```

  Il percorso completo della cartella è stato accorciato con `…`.

- **Cosa significa:**
  - **Visto:** `node` ha stampato `Inizio` ed è arrivato alla riga 4. Lì si è fermato con l'errore, e `Fine` non è comparso.
  - **Visto:** l'errore è comparso solo quando `node` ha raggiunto quella riga. Le righe prima avevano già girato.
  - **Visto, confronto con 01a:** in 01a leggere `obj.heigth` non ha dato errore. Qui leggere `.nome` di un valore `undefined` sì.
  - **Dalla fonte:** alcuni linguaggi segnalano gli errori già prima di eseguire il codice (detto per i casi di 01a).
- **Parola nuova:** errore a runtime, un errore che compare mentre il programma gira (spiegazione mia, non è nella fonte); `TypeError`, il nome dell'errore stampato da `node` (visto, non l'ho letto in una pagina).

### 2.3 Passo 4: tsc segnala l'errore prima

- **Obiettivo:** vedere cosa segnala `tsc` su una proprietà scritta male e se il `.js` viene scritto lo stesso.
- **Cosa ho fatto:**
  - [refuso.ts](esercizi/refuso.ts) con `heigth` scritto male, nello stesso oggetto e stesso calcolo del Passo 2. Poi `pnpm exec tsc refuso.ts`, `Get-ChildItem` e `node refuso.js`. Poi `tsconfig.json` con `{}` nella cartella `esercizi`, e di nuovo `pnpm exec tsc refuso.ts`.
  - `pnpm exec tsc --ignoreConfig refuso.ts`.
  - [refuso-corretto.ts](esercizi/refuso-corretto.ts) con `height` scritto bene, poi `pnpm exec tsc --ignoreConfig refuso-corretto.ts`, poi `Remove-Item refuso.ts, refuso.js` e `Get-ChildItem`.
- **Cosa ho visto:**
  - **Visto:** con `pnpm exec tsc refuso.ts`, prima del `tsconfig.json`, ho ottenuto `TS2551` alla riga 4, colonna 30, con `height` dichiarato alla riga 3 e `Found 1 error`. `refuso.js` è stato scritto (215 byte), nonostante l'errore. Poi `node refuso.js` ha stampato `NaN`.
  - **Visto:** prima del `tsconfig.json`, [refuso.ts](esercizi/refuso.ts) aveva `TS2451` su `obj` e `area`. Il pannello indicava `height` dichiarato in `operazioni-senza-senso.js`, che è nella cartella di 01a.
  - **Visto:** dopo aver creato `tsconfig.json` con `{}` in `esercizi` e ricaricato la finestra, resta solo `TS2551`.
  - **Non provato:** che sia stato il `tsconfig.json` a risolvere. Ho cambiato due cose insieme, il file e il ricaricamento. Per isolarlo bisognerebbe toglierlo e vedere se il rosso torna. Non serve ora.
  - **Visto con la 7.0.2:** con `tsconfig.json` presente, `pnpm exec tsc refuso.ts` si ferma con `error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.` Questo differisce dalla pagina delle opzioni di `tsc`: la pagina non nomina nessun errore per questo caso. Vale quello osservato con la 7.0.2.
  - **Dalla fonte:** la pagina delle opzioni di `tsc` dice che con file sulla riga di comando i `tsconfig.json` vengono ignorati.
  - **Visto con la 7.0.2:** con `--ignoreConfig`, `tsc` controlla il file, segnala `TS2551` alla riga 4, colonna 30, e riscrive `refuso.js`.
  - **Regola per questi esercizi:** uso `pnpm exec tsc --ignoreConfig <file>`.
  - **Visto:** il comando `tsc --ignoreConfig refuso-corretto.ts` non ha stampato nulla. Ha scritto [refuso-corretto.js](esercizi/refuso-corretto.js) (184 byte).
  - **Visto:** dopo l'eliminazione, la cartella `esercizi` contiene [refuso-corretto.ts](esercizi/refuso-corretto.ts), `refuso-corretto.js`, `errore-a-runtime.js`, `package.json`, `pnpm-lock.yaml`, `tsconfig.json` e `node_modules`.
  - **Visto:** ho eseguito `cat refuso-corretto.js` e ho ottenuto:

    ```js
    "use strict";
    //Obiettivo: correggere il refuso e vedere se tsc segnala ancora qualcosa.
    const obj = { width: 10, height: 15 };
    const area = obj.width * obj.height;
    console.log(area);
    ```

    `"use strict";` è la prima riga, e nel `.ts` questa riga non c'è.
- **Cosa significa:**
  - **Dalla fonte:** TypeScript segnala questo errore prima che il programma giri; il testo del messaggio è lo stesso che ho visto.
  - **Visto:** `tsc` ha trovato il refuso che `node` non aveva segnalato.
  - **Dedotto:** il conflitto `TS2451` compare perché in VS Code i file senza `import` né `export` condividono lo scope globale. Non l'ho verificato.
- **Parola nuova:** static checking, il controllo che trova gli errori senza far girare il codice.

## 3. Key Takeaways

- TypeScript controlla il programma prima che giri, guardando il tipo dei valori.
- `tsc` ha segnalato con codice, riga e colonna il refuso che JavaScript non aveva segnalato.
- Il messaggio di `tsc` suggerisce anche la correzione (`Did you mean 'height'?`).

## 4. Glossario

| Termine | Definizione dalla fonte | In parole semplici |
|---|---|---|
| Static checking | «Detecting errors in code without running it is referred to as static checking.» | Trovare gli errori senza far girare il codice. |
| Static type checking | «Determining what’s an error and what’s not based on the kinds of values being operated on is known as static type checking.» | Decidere cosa è un errore guardando il tipo dei valori. |
| Static type checker | «TypeScript checks a program for errors before execution, and does so based on the kinds of values, making it a static type checker.» | Lo strumento che fa questo controllo. TypeScript è uno di questi. |

## 5. Con parole mie

### Domanda 1: Controllo statico

> Cosa vuol dire controllare un programma «senza eseguirlo», e cosa aggiunge la parola «type» in *static type checking*?

**Risposta:** «Senza eseguirlo» vuol dire che il controllo avviene senza far girare il programma. Lo strumento legge il codice e cerca gli errori. Il programma però può girare comunque: nel Passo 4 `tsc` ha scritto il `.js` e `node` lo ha eseguito.

Nel Passo 4 è successo questo:

- `tsc` ha trovato `heigth` scritto male. Non ha fatto partire il programma.
- `node` ha eseguito il file e ha stampato `NaN`. Non ha segnalato nessun errore.

La parola «type» vuol dire che `tsc` guarda il tipo dei valori. Per esempio, sa che l'oggetto `obj` ha solo `width` e `height`. Quindi si accorge che `heigth` non c'è.

- **Visto:** `tsc` ha segnalato `TS2551` alla riga 4 di `refuso.ts`.
- **Dalla fonte:** TypeScript controlla il programma prima che giri, in base al tipo dei valori.

## 6. Da verificare

- Cosa resta nella cartella `typescript\01-controllo-dei-tipi` che VS Code mostrava nel pannello Problemi: probabilmente residui. **Non provato.**
- La causa di `TS2451` nell'editor. **Non provato.**
- Cosa fa esattamente un `tsconfig.json` vuoto: lo vedremo nel modulo dedicato. **Non provato.**
- Perché `tsc` ha aggiunto `"use strict";` nel `.js` di `refuso-corretto.ts`. **Non provato.**
- Perché con `"type": "module"` un `obj = …` senza `const` dava `ReferenceError`: mia deduzione, i moduli ES sono in modalità strict. **Non provato.**

## 7. Fonti

- [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook (ultimo aggiornamento indicato: 25 novembre 2026).
- [Opzioni di `tsc` (Compiler Options)](https://www.typescriptlang.org/docs/handbook/compiler-options.html), TypeScript Handbook: la parte su `tsconfig.json` e i file sulla riga di comando.
