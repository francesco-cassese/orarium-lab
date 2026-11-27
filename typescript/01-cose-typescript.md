# Appunti: Cos'è TypeScript

**Modulo:** TypeScript
**Titolo:** Cos'è TypeScript e in cosa si differenzia da JavaScript
**Data:** 27/11/2026
**Fonte:** [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook

Come leggere questi appunti: tutto quello che non ha un'indicazione viene dalla fonte. Le spiegazioni mie sono segnate con «spiegazione mia» o «deduzione mia».

**Indice rapido**

1. [Argomenti](#1-argomenti)
   - 1.1 [TypeScript e JavaScript](#11-typescript-e-javascript)
   - 1.2 [Com'è nato JavaScript e perché ha delle stranezze](#12-comè-nato-javascript-e-perché-ha-delle-stranezze)
   - 1.3 [Il controllo statico dei tipi](#13-il-controllo-statico-dei-tipi)
   - 1.4 [Cosa aggiunge TypeScript a JavaScript](#14-cosa-aggiunge-typescript-a-javascript)
   - 1.5 [Imparare JavaScript e TypeScript](#15-imparare-javascript-e-typescript)
2. [Cosa la fonte non spiega](#2-cosa-la-fonte-non-spiega)
3. [Key Takeaways](#3-key-takeaways)
4. [Glossario](#4-glossario)
5. [Con parole mie](#5-con-parole-mie)
6. [Fonti](#6-fonti)

## 1. Argomenti

### 1.1 TypeScript e JavaScript

TypeScript è una «variante» di JavaScript. Il rapporto tra i due è piuttosto speciale tra i linguaggi di programmazione moderni. Per capire TypeScript bisogna capire cosa aggiunge a JavaScript. Lo vediamo in questi appunti.

Abbreviazioni: TypeScript si scrive TS, JavaScript si scrive JS.

### 1.2 Com'è nato JavaScript e perché ha delle stranezze

**Le origini.** JavaScript (si chiama anche ECMAScript) è nato come un linguaggio semplice per i browser. Il browser è il programma con cui si naviga sul web (spiegazione mia). All'inizio serviva per pezzi di codice molto brevi dentro una pagina web. Scrivere più di qualche dozzina di righe era insolito. I primi browser eseguivano questo codice lentamente.

**La crescita.** Col tempo JavaScript è diventato popolare. Gli sviluppatori web lo hanno usato per creare pagine interattive. I browser sono stati migliorati: hanno cominciato a eseguire il codice più in fretta (la fonte lo chiama *dynamic compilation*) e a permettere più cose (la fonte parla di *API*). Così gli sviluppatori lo hanno usato ancora di più. Oggi un sito moderno può eseguire applicazioni da centinaia di migliaia di righe di codice. Il web è passato da semplici pagine statiche ad applicazioni complete.

**Fuori dal browser.** JavaScript si usa anche fuori dal browser, per esempio per creare server con node.js. Un server è un programma che risponde alle richieste di altri programmi (spiegazione mia). JavaScript funziona su molti sistemi diversi, e per questo è comodo per sviluppare per più piattaforme. Molti sviluppatori usano solo JavaScript per tutta la loro applicazione.

**Le stranezze.** JavaScript è nato per usi rapidi, ma oggi si usa per programmi da milioni di righe. Ogni linguaggio ha delle stranezze, cioè comportamenti inattesi (in inglese *quirks*). JavaScript ne ha molte, perché è nato in modo molto semplice.

**Esempio 1: due confronti strani** (codice della fonte)

```js
if ("" == 0) {
  // It is! But why??
}
if (1 < x < 3) {
  // True for *any* value of x!
}
```

- `"" == 0`: confronta un testo vuoto con il numero zero. In JavaScript il risultato è vero. L'operatore `==` cambia i valori prima di confrontarli, e questo dà risultati inattesi.
- `1 < x < 3`: il commento dice che è vero per qualunque valore di `x`.
- La fonte non spiega perché questi due confronti diano questi risultati.

**Esempio 2: una proprietà scritta male** (codice della fonte)

```js
const obj = { width: 10, height: 15 };
// Why is this NaN? Spelling is hard!
const area = obj.width * obj.heigth;
```

- Riga 1: crea un oggetto con due proprietà: `width` (larghezza) vale 10 e `height` (altezza) vale 15.
- Riga 3: calcola l'area moltiplicando larghezza e altezza, ma scrive `heigth` invece di `height`. La proprietà `heigth` non esiste.
- JavaScript non dà errore. Il risultato è `NaN`, cioè «Not a Number» (non è un numero).
- La fonte non spiega perché il risultato è `NaN`. Deduzione mia: `obj.heigth` non esiste e vale `undefined`, e `10 * undefined` dà `NaN`.

**Perché è un problema.** La maggior parte dei linguaggi darebbe errore in casi come questi. Alcuni lo darebbero già prima di eseguire il codice. Nei programmi piccoli le stranezze sono fastidiose ma si gestiscono. Nei programmi con centinaia o migliaia di righe diventano un problema serio.

### 1.3 Il controllo statico dei tipi

Alcuni linguaggi non permettono nemmeno di eseguire un programma con errori. Questo controllo ha due nomi:

- **Controllo statico** (*static checking*): trovare errori nel codice senza eseguirlo.
- **Controllo statico dei tipi** (*static type checking*): decidere cosa è un errore e cosa no guardando il tipo dei valori che si usano.

Il tipo è la categoria di un valore, per esempio numero o array (spiegazione mia).

TypeScript fa il controllo statico dei tipi: controlla il programma prima che giri.

**Esempio: lo stesso refuso** (codice della fonte)

```ts
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

TypeScript segnala questo errore:

`Property 'heigth' does not exist on type '{ width: number; height: number; }'. Did you mean 'height'?`

In italiano: la proprietà `heigth` non esiste nel tipo `{ width: number; height: number; }`. Intendevi `height`?

- Il tipo di `obj` ha due proprietà: `width` e `height`, entrambe numeri. `heigth` non c'è.
- JavaScript lascia passare l'errore e dà `NaN`. TypeScript lo segnala prima che il programma giri e suggerisce la correzione.

**Analogia mia: il correttore di bozze.** Legge il testo prima che vada in stampa e segna i refusi. Non è identico: un correttore guarda le parole, TypeScript guarda come usi i valori in base al loro tipo. E a volte TypeScript segnala qualcosa che poteva andare bene (vedi 1.4).

### 1.4 Cosa aggiunge TypeScript a JavaScript

TypeScript è un *superset* di JavaScript: tutta la sintassi di JavaScript è valida anche in TypeScript, e TypeScript ci aggiunge delle cose. Vediamo quattro punti: sintassi, tipi, comportamento a runtime, tipi cancellati.

**Sintassi.** La sintassi è il modo in cui si scrive il codice per formare un programma. Tutta la sintassi di JavaScript è valida in TypeScript. Quindi puoi prendere codice JavaScript che funziona e metterlo in un file TypeScript, senza preoccuparti di come è scritto.

Un errore di sintassi resta un errore anche in TypeScript. Esempio della fonte: manca una parentesi chiusa.

```ts
let a = (4
```

TypeScript segnala `')' expected.`, cioè «era attesa una `)`».

Attenzione: questa regola vale per la sintassi. Gli errori di tipo (vedi sotto) possono comparire lo stesso.

**Tipi.** TypeScript aggiunge regole su come si possono usare i valori in base al loro tipo. L'errore su `heigth` non era un errore di sintassi: era un uso sbagliato di un tipo di valore.

Secondo esempio della fonte. In JavaScript questo codice funziona e stampa `Infinity`:

```js
console.log(4 / []);
```

TypeScript considera senza senso dividere un numero per un array e segnala:

`The right-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type.`

In italiano: il lato destro di un'operazione aritmetica deve essere di tipo `any`, `number`, `bigint` o un tipo enum.

Una cosa importante: potresti voler davvero dividere un numero per un array, magari solo per vedere cosa succede. Ma quasi sempre è un errore di programmazione. TypeScript è fatto per far passare i programmi corretti e trovare più errori comuni possibile.

Se sposti codice da JavaScript a TypeScript possono comparire errori di tipo. A volte sono problemi veri del codice. A volte TypeScript è troppo prudente. La fonte dice che più avanti mostrerà come aggiungere sintassi di TypeScript per eliminare questi errori. Dice anche che si può decidere quanto severo debba essere il controllo, ma non dice come.

**Comportamento a runtime.** Il comportamento a runtime è come si comporta il programma mentre gira (spiegazione mia). TypeScript conserva quello di JavaScript. Esempio: dividere per zero in JavaScript dà `Infinity` e non un errore. Il principio è questo: **TypeScript non cambia mai il comportamento a runtime del codice JavaScript.**

Ne segue che, se sposti codice da JavaScript a TypeScript, gira nello stesso modo, anche se TypeScript segnala errori di tipo. È una promessa fondamentale: puoi passare da un linguaggio all'altro senza il timore che il programma smetta di funzionare per differenze nascoste.

**Tipi cancellati.** Quando TypeScript ha finito di controllare il codice, cancella i tipi e produce il codice compilato. Il codice compilato è JavaScript normale, senza informazioni sui tipi. Due conseguenze:

- TypeScript non cambia il comportamento del programma in base ai tipi. Puoi vedere errori di tipo mentre compili, ma i tipi non influenzano come il programma gira.
- TypeScript non aggiunge librerie. I programmi usano le stesse librerie di JavaScript, quindi non c'è un framework di TypeScript da imparare in più.

Il `"use strict";` che `tsc` aggiunge in cima al `.js` non è nella fonte. I tipi veri e propri, scritti nel codice, li vediamo nel modulo 02.

### 1.5 Imparare JavaScript e TypeScript

Domanda frequente: devo imparare JavaScript o TypeScript? La risposta della fonte: non si può imparare TypeScript senza imparare JavaScript. I due hanno la stessa sintassi e lo stesso comportamento a runtime, quindi quello che impari su JavaScript serve anche per TypeScript.

Ci sono molte risorse su JavaScript e vanno usate. Su StackOverflow ci sono circa 20 volte più domande con il tag `javascript` che con il tag `typescript`, ma tutte le domande su JavaScript valgono anche per TypeScript.

**Da ricordare:** se cerchi «come ordinare una lista in TypeScript», si fa come in JavaScript. La fonte lo riassume così: TypeScript è il runtime di JavaScript con un controllo dei tipi in fase di compilazione. Una risorsa scritta per TypeScript va bene. Ma per le domande di tutti i giorni su come far funzionare il codice non serve cercare risposte solo per TypeScript.

## 2. Cosa la fonte non spiega

- Perché `"" == 0` è vero, perché `1 < x < 3` è sempre vero e perché `obj.heigth` dà `NaN`.
- Cosa significano *scripting language*, *dynamic compilation*, API, node.js e *coercion*.
- Come si installa TypeScript, e quali comandi si usano.
- Come si lancia il controllo da riga di comando (non nomina `tsc`) e se il compilatore scrive il file JavaScript quando ci sono errori di tipo.
- Quali sono le impostazioni che rendono il controllo più o meno severo.
- Quali sono i tipi di base di TypeScript. Nomina `any`, `number`, `bigint` ed enum solo dentro un messaggio di errore.

## 3. Key Takeaways

*I punti da portare con sé.*

- **Superset:** tutta la sintassi di JavaScript è valida anche in TypeScript, e TypeScript ci aggiunge regole sui tipi.
- **Controllo prima dell'esecuzione:** TypeScript controlla il programma prima che giri, guardando il tipo dei valori.
- **Segnala, non cambia:** TypeScript non cambia mai il comportamento del programma, anche quando segnala errori.
- **I tipi spariscono:** il codice compilato è JavaScript senza tipi, e TypeScript non aggiunge librerie.
- **JavaScript prima di tutto:** non si impara TypeScript senza imparare JavaScript.

## 4. Glossario

| Termine | Definizione dalla fonte | In parole semplici |
|---|---|---|
| Static checking | «Detecting errors in code without running it is referred to as static checking.» | Trovare gli errori senza far girare il codice. |
| Static type checking | «Determining what’s an error and what’s not based on the kinds of values being operated on is known as static type checking.» | Decidere cosa è un errore guardando il tipo dei valori. |
| Static type checker | «TypeScript checks a program for errors before execution, and does so based on the kinds of values, making it a static type checker.» | Lo strumento che fa questo controllo. TypeScript è uno di questi. |
| Tipo | «some kind of value (a type)». Non è definito oltre. | La categoria di un valore, per esempio numero o array. |
| Syntax | «Syntax refers to the way we write text to form a program.» | Le regole su come si scrive il codice. |
| Superset | Non definito. La fonte dice: «TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS.» | TypeScript accetta tutta la sintassi di JavaScript e ci aggiunge regole sui tipi. |
| Quirks | «oddities and surprises» | Stranezze: comportamenti inattesi di un linguaggio. |
| Runtime behavior | Non definito. La fonte lo mostra con la divisione per zero, che dà `Infinity` senza errore. | Come si comporta il programma mentre gira. |
| Erased types | Non definito. La fonte dice che il compilatore, finito il controllo, «erases the types to produce the resulting “compiled” code». | Dopo il controllo i tipi vengono tolti: il `.js` non li contiene. |
| Coercion | Non definito. La fonte dice che `==` «coerces its operands, leading to unexpected behavior». | (spiegazione mia) La conversione automatica di un valore in un altro tipo prima di confrontarlo. |

## 5. Con parole mie

### Domanda 1: Controllo statico

> Cosa vuol dire controllare un programma «senza eseguirlo», e cosa aggiunge la parola «type» in *static type checking*?

**Risposta:** Vuol dire controllare il codice prima di farlo girare. Il controllo cerca gli errori da solo. La parola «type» dice in base a cosa si decide se c'è un errore: si guarda che tipo di valore stai usando, per esempio un numero, un testo o un array. Dividere un numero per un array, per esempio, è un errore di tipo.

- **Dalla pagina:** (sezione *TypeScript: A Static Type Checker*) «Determining what’s an error and what’s not based on the kinds of values being operated on is known as static type checking.»

### Domanda 2: Il refuso `obj.heigth`

> Cosa succede in JavaScript con `obj.width * obj.heigth`, e cosa succede in TypeScript?

**Risposta:** In JavaScript non succede niente di visibile come errore, e il programma va avanti. In TypeScript, invece, `tsc` segnala `heigth` e suggerisce `height`, prima che il programma giri.

- **Dalla pagina:** (sezione *TypeScript: A Static Type Checker*) il messaggio di TypeScript è: «Property 'heigth' does not exist on type '{ width: number; height: number; }'. Did you mean 'height'?»
- **Dedotto:** `obj.heigth` vale `undefined`, quindi `10 * undefined` dà `NaN`.

### Domanda 3: Superset

> Cosa vuol dire che TypeScript è un «superset» di JavaScript? Un errore di sintassi come `let a = (4` è un errore anche in TypeScript?

**Risposta:** Vuol dire che la sintassi di JavaScript è valida anche in TypeScript: il codice JavaScript con la sintassi giusta si legge anche come TypeScript. Questo non vuol dire che il codice sia senza errori di tipo. Per esempio, `obj.heigth` non è un errore di sintassi, ma TypeScript lo segnala lo stesso. Un errore di sintassi, come `let a = (4` senza la `)`, resta un errore anche in TypeScript.

- **Dalla pagina:** (sezione *Syntax*) «TypeScript is a language that is a superset of JavaScript: JS syntax is therefore legal TS.»

### Domanda 4: Il comportamento a runtime

> Se TypeScript segnala un errore di tipo, il programma gira lo stesso? Come gira rispetto al JavaScript?

**Risposta:** Sì, il programma gira lo stesso. L'errore di tipo viene segnalato prima, ma non cambia come il codice si comporta quando parte. Il codice gira allo stesso modo di come girerebbe in JavaScript. Quindi un errore di tipo non fa partire il programma in modo diverso: segnala solo un possibile problema.

- **Dalla pagina:** (sezione *Runtime Behavior*) «As a principle, TypeScript never changes the runtime behavior of JavaScript code.» «This means that if you move code from JavaScript to TypeScript, it is guaranteed to run the same way, even if TypeScript thinks that the code has type errors.»

### Domanda 5: Un'applicazione: un refuso in Orarium

> Prendi un componente del frontend di Orarium che legge una proprietà di un oggetto (per esempio `ingredient.price_cents`). Cosa succederebbe oggi, in JavaScript, se scrivessi la proprietà con un refuso? E cosa dice la pagina che farebbe TypeScript? Segna cosa hai provato e cosa no.

**Risposta:** Nel componente `IngredientList.jsx` il prezzo si mostra con `formatPrice(ingredient.price_cents)`. Se scrivessi `ingredient.price_cent`, senza la `s`, in JavaScript non comparirebbe nessun errore. La proprietà non esiste, quindi vale `undefined`. `formatPrice` divide per 100 e il risultato è `NaN`. Nella tabella comparirebbe «NaN €» al posto del prezzo, e il programma andrebbe avanti.

- **Visto:** `formatPrice` è in `frontend/src/utils/formatPrice.js`: divide i centesimi per 100 e formatta il risultato in euro. Con Node, la stessa formattazione dà «1,20 €» con `price_cents`, e «NaN €» con `price_cent`.
- **Non provato:** non ho provato nel browser né nel componente.
- **Dedotto:** TypeScript segnalerebbe il refuso prima che il programma giri, come `heigth` nella domanda 2. Questo vale solo se il tipo di `ingredient` è noto. Oggi nel repo c'è solo la descrizione JSDoc di `Ingredient` in `api/ingredients.js`, non TypeScript. Quindi non l'ho ancora provato su Orarium.

## 6. Fonti

- [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook (ultimo aggiornamento indicato: 25 novembre 2026): fonte di questi appunti.
