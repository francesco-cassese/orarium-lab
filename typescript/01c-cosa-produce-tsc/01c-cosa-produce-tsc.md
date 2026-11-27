# Appunti: Cosa produce tsc

**Modulo:** TypeScript
**Parte:** 01c
**Titolo:** Cosa produce tsc e cosa non cambia
**Data:** 27/11/2026
**Fonte:** [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook

Come leggere questi appunti: ogni affermazione ha un'etichetta. **Visto** è quello che ho osservato in un output. **Dalla fonte** è quello che dice la pagina. **Spiegazione mia** e **Dedotto** sono cose mie. **Non provato** è quello che non ho verificato.

**Indice rapido**

1. [Cosa voglio capire](#1-cosa-voglio-capire)
2. [Passi](#2-passi)
   - 2.1 [Preparazione: TypeScript nella cartella esercizi](#21-preparazione-typescript-nella-cartella-esercizi)
   - 2.2 [Passo 5: il file .js che tsc scrive](#22-passo-5-il-file-js-che-tsc-scrive)
   - 2.3 [Passo 6: il programma gira come in JavaScript](#23-passo-6-il-programma-gira-come-in-javascript)
   - 2.4 [Senza esercizio: superset e sintassi](#24-senza-esercizio-superset-e-sintassi)
3. [Key Takeaways](#3-key-takeaways)
4. [Glossario](#4-glossario)
5. [Con parole mie](#5-con-parole-mie)
6. [Da verificare](#6-da-verificare)
7. [Fonti](#7-fonti)

## 1. Cosa voglio capire

Cosa produce `tsc` dopo il controllo e cosa TypeScript non cambia del programma.

## 2. Passi

### 2.1 Preparazione: TypeScript nella cartella esercizi

- **Obiettivo:** avere TypeScript installato nella cartella `esercizi` di 01c.
- **Cosa ho fatto:** nella cartella `esercizi` ho eseguito `pnpm init`, `pnpm add -D typescript` e `pnpm exec tsc --version`. Nella stessa cartella c'è un `tsconfig.json` con `{}`.
- **Cosa ho visto:**
  - `package.json` con `"name": "esercizi"` (preso dal nome della cartella) e `"type": "module"`.
  - Nell'output di `pnpm add -D typescript`: `+ typescript 7.0.2` sotto `devDependencies`.
  - `tsc --version` ha stampato `Version 7.0.2`.
  - `tsconfig.json` con `{}` (3 byte, con l'a capo).
- **Cosa significa:** **Visto:** TypeScript 7.0.2 è installato in `esercizi` tra le dipendenze di sviluppo. **Dalla fonte:** la pagina non spiega come si installa TypeScript.
- **Parola nuova:** `devDependencies`, le dipendenze che servono solo mentre sviluppo.

### 2.2 Passo 5: il file .js che tsc scrive

- **Obiettivo:** vedere quali file crea `tsc` e cosa c'è dentro.
- **Cosa ho fatto:** ho creato [ciao.ts](esercizi/ciao.ts) con un commento di obiettivo, la costante `saluto` con il testo «ciao, mondo» e `console.log(saluto)`. Poi `pnpm exec tsc --ignoreConfig ciao.ts`, `Get-ChildItem`, `node ciao.js`, `Get-Content ciao.js -Encoding UTF8`. Ho usato `--ignoreConfig` perché c'è il `tsconfig.json`, come nel Passo 4.
- **Cosa ho visto:**
  - **Visto:** `tsc --ignoreConfig ciao.ts` non ha stampato nulla.
  - **Visto:** è comparso `ciao.js` (139 byte), accanto a `ciao.ts` (125 byte).
  - **Visto:** `node ciao.js` ha stampato `ciao, mondo`.
  - **Visto:** il `ciao.js` ha `"use strict";` alla riga 1, poi il commento, `const saluto = "ciao, mondo";` e `console.log(saluto);`.
  - **Visto:** dopo aver cambiato il commento di `ciao.ts` (ora 146 byte, delle 20:03), `ciao.js` è rimasto quello dell'ultimo `tsc` delle 20:02 (139 byte). Il `.js` non si aggiorna da solo: resta quello dell'ultimo `tsc` finché non lo rilancio.
  - **Visto:** ho rilanciato `pnpm exec tsc --ignoreConfig ciao.ts`. Il nuovo `ciao.js` è delle 20:07 e pesa 160 byte.
- **Cosa significa:**
  - **Dalla fonte:** quando ha finito di controllare, TypeScript cancella i tipi e produce il codice compilato, che è JavaScript normale senza tipi.
  - **Visto:** `tsc` ha scritto il `.js` senza errori, e il `.js` gira con `node`.
  - **Spiegazione mia:** `ciao.ts` non ha annotazioni di tipo, quindi in questo file non c'era nessun tipo da togliere. Il `.js` è quasi uguale al `.ts`.
  - **Visto:** il `"use strict";` in cima al `.js`; la pagina non ne parla.
- **Parola nuova:** erased types, i tipi cancellati.

### 2.3 Passo 6: il programma gira come in JavaScript

- **Obiettivo:** vedere che il `.js` prodotto da `tsc` si comporta come il JavaScript scritto a mano.
- **Cosa ho fatto:** ho creato [divisione.ts](esercizi/divisione.ts) con un commento di obiettivo e `console.log(4 / [])`. Poi `pnpm exec tsc --ignoreConfig divisione.ts`, `Get-ChildItem` e `node divisione.js`. Poi ho creato [divisione-corretto.ts](esercizi/divisione-corretto.ts) con un commento di obiettivo e `console.log(4 / 2)`, e ho eseguito `pnpm exec tsc --ignoreConfig divisione-corretto.ts`, poi `pnpm exec tsc --ignoreConfig ciao.ts`, poi `Remove-Item divisione.ts, divisione.js` e `Get-ChildItem`.
- **Cosa ho visto:**
  - **Visto:** `tsc --ignoreConfig divisione.ts` ha stampato questo messaggio, in inglese:

    ```
    divisione.ts:2:17 - error TS2363: The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.

    2 console.log(4 / []);
                      ~~

    Found 1 error in divisione.ts:2
    ```

  - **Visto:** è comparso `divisione.js` (132 byte), accanto a `divisione.ts` (118 byte). Quindi `tsc` ha scritto il `.js` anche con l'errore.
  - **Visto:** `tsc --ignoreConfig divisione-corretto.ts` non ha stampato nulla. Sono comparsi `divisione-corretto.js` (119 byte) accanto a `divisione-corretto.ts` (105 byte).
  - **Visto:** `node divisione-corretto.js` ha stampato `2`.
  - **Visto:** `node divisione.js` ha stampato `Infinity`.
- **Cosa significa:**
  - **Dalla fonte:** «As a principle, TypeScript never changes the runtime behavior of JavaScript code.»
  - **Visto:** con un errore di tipo segnalato da `tsc`, il `.js` è stato scritto e ha stampato `Infinity`. Nel Passo 2 di 01a, `4 / []` aveva dato lo stesso `Infinity`.
- **Parola nuova:** runtime behavior, come si comporta il programma mentre gira (spiegazione mia).

### 2.4 Senza esercizio: superset e sintassi

- **Obiettivo:** capire cosa vuol dire che TypeScript è un superset di JavaScript.
- **Cosa ho fatto:** (non provato)
- **Cosa significa:**
  - **Dalla fonte:** «TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS.»
  - **Dalla fonte:** un errore di sintassi resta un errore anche in TypeScript; l'esempio è `let a = (4`, e TypeScript segnala `')' expected.`.
  - **Dalla fonte:** l'errore su `heigth` e quello su `4 / []` sono errori di tipo, non di sintassi.
- **Parola nuova:** superset; syntax, il modo in cui si scrive il codice per formare un programma.

## 3. Key Takeaways

- `tsc` produce un `.js` senza tipi, e lo scrive anche quando ci sono errori.
- TypeScript non cambia il comportamento del programma.
- Tutta la sintassi di JavaScript è valida anche in TypeScript.
- Non si impara TypeScript senza imparare JavaScript.

## 4. Glossario

| Termine | Definizione dalla fonte | In parole semplici |
|---|---|---|
| Erased types | Non definito. La fonte dice che il compilatore, finito il controllo, «erases the types to produce the resulting “compiled” code». | Dopo il controllo i tipi vengono tolti: il `.js` non li contiene. |
| Runtime behavior | Non definito. La fonte lo mostra con la divisione per zero, che dà `Infinity` senza errore. | Come si comporta il programma mentre gira. |
| Superset | Non definito. La fonte dice: «TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS.» | TypeScript accetta tutta la sintassi di JavaScript e ci aggiunge regole sui tipi. |
| Syntax | «Syntax refers to the way we write text to form a program.» | Le regole su come si scrive il codice. |

## 5. Con parole mie

### Domanda 1: Il comportamento a runtime

> Se TypeScript segnala un errore di tipo, il programma gira lo stesso? Come gira rispetto al JavaScript?

**Risposta:** Sì, il programma gira lo stesso. Quando `tsc` segnala un errore di tipo, scrive comunque il `.js`, e `node` lo esegue.

Nel Passo 6 è successo questo:

- `tsc --ignoreConfig divisione.ts` ha segnalato `TS2363`.
- `divisione.js` è stato scritto lo stesso.
- `node divisione.js` ha stampato `Infinity`.

Quindi il programma gira come il JavaScript scritto a mano. Nel Passo 2 di 01a, `4 / []` aveva dato `Infinity` senza nessun errore.

- **Visto:** con l'errore di `tsc`, il `.js` è stato scritto e ha stampato `Infinity`.
- **Dalla fonte:** «As a principle, TypeScript never changes the runtime behavior of JavaScript code.»
- **Spiegazione mia:** l'errore dice che `tsc` non accetta l'operazione con quei tipi. `tsc` non esegue il programma: segnala l'errore e scrive il `.js`; lo fa partire `node`.
- **Non provato:** se succede lo stesso con altri errori di tipo. Ho visto un solo esempio.

## 6. Da verificare

- Il `"use strict";` che `tsc` aggiunge: non è nella fonte. Perché lo aggiunge: **non provato.**
- Se esiste un'opzione per non scrivere il `.js` quando ci sono errori: **non provato.** È proprio quello che vedremo nel modulo successivo.
- L'esempio `let a = (4` con `tsc`: l'avevo visto nella versione precedente del modulo, codice `TS1005`. Nei passi nuovi non l'ho rifatto. **Non provato.**

## 7. Fonti

- [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook (ultimo aggiornamento indicato: 25 novembre 2026).
