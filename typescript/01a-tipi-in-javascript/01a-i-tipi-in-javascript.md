# Appunti: I tipi in JavaScript

**Modulo:** TypeScript
**Parte:** 01a
**Titolo:** I tipi in JavaScript e le sue stranezze
**Data:** 27/11/2026
**Fonte:** [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook

Come leggere questi appunti: ogni affermazione ha un'etichetta. **Visto** è quello che ho osservato in un output. **Dalla fonte** è quello che dice la pagina. **Spiegazione mia** e **Dedotto** sono cose mie. **Non provato** è quello che non ho verificato.

**Indice rapido**

1. [Cosa voglio capire](#1-cosa-voglio-capire)
2. [Passi](#2-passi)
   - 2.1 [Passo 1: ogni valore ha un tipo](#21-passo-1-ogni-valore-ha-un-tipo)
   - 2.2 [Passo 2: operazioni senza senso](#22-passo-2-operazioni-senza-senso)
3. [Key Takeaways](#3-key-takeaways)
4. [Glossario](#4-glossario)
5. [Con parole mie](#5-con-parole-mie)
6. [Da verificare](#6-da-verificare)
7. [Fonti](#7-fonti)

## 1. Cosa voglio capire

Cosa vuol dire che un valore ha un tipo, e cosa fa JavaScript quando uso un valore in un modo che non ha senso.

## 2. Passi

### 2.1 Passo 1: ogni valore ha un tipo

- **Obiettivo:** vedere che JavaScript assegna un tipo a ogni valore, e come chiederglielo.
- **Cosa ho fatto:** ho aperto `node` da solo. Poi ho scritto `typeof` seguito da sette valori: `'ciao'`, `2`, `[]`, `{}`, `true`, `undefined`, `null`.
- **Cosa ho visto:**

  | Valore | `typeof` |
  |---|---|
  | `'ciao'` | `'string'` |
  | `2` | `'number'` |
  | `[]` | `'object'` |
  | `{}` | `'object'` |
  | `true` | `'boolean'` |
  | `undefined` | `'undefined'` |
  | `null` | `'object'` |

  In più ho visto un fatto che la fonte non dice: scrivere `exit` senza il punto dà `ReferenceError: exit is not defined`. Scrivere `.exit` invece chiude `node`. **Visto** da me, **non è nella fonte**.

- **Cosa significa:**
  - **Visto:** su sette valori, `typeof` ha sempre risposto con il nome di un tipo. Tre valori hanno risposto `'object'`: `[]`, `{}` e `null`.
  - **Dalla fonte:** la pagina dice «some kind of value (a type)» e non definisce il tipo oltre.
  - **Spiegazione mia:** il tipo è la categoria di un valore. `[]` è un array, ma `typeof` lo chiama `'object'`.
  - **Non provato:** perché `typeof null`, `typeof []` e `typeof {}` danno `'object'`. Non l'ho letto nella fonte.
- **Parola nuova:** tipo, la categoria di un valore; `typeof`, l'operatore che mi dice il tipo.

### 2.2 Passo 2: operazioni senza senso

- **Obiettivo:** vedere se `node` segnala un errore quando uso i valori in modo senza senso.
- **Cosa ho fatto:** ho eseguito `node operazioni-senza-senso.js` dalla cartella [esercizi](esercizi/), con il file [operazioni-senza-senso.js](esercizi/operazioni-senza-senso.js). Il file ha un oggetto `{ width: 10, height: 15 }`, l'area calcolata con `obj.heigth` scritto male, la stampa di `4 / []` e quella di `"" == 0`.
- **Cosa ho visto:**

  ```
  NaN
  Infinity
  true
  ```

  Node.js v24.16.0

  Nessun messaggio di errore.
- **Cosa significa:**
  - **Visto:** `node` ha eseguito tutte e tre le righe senza segnalare errori.
  - **Dalla fonte:** JavaScript non dà errore su queste righe. La fonte le chiama stranezze (*quirks*). Non spiega perché escono quei risultati.
  - **Dedotto:** `obj.heigth` non esiste e vale `undefined`, e `10 * undefined` dà `NaN`.
- **Parola nuova:** quirks, stranezze; coercion, la conversione automatica di un valore in un altro tipo (spiegazione mia).

## 3. Key Takeaways

- Ogni valore ha un tipo.
- `typeof` dice il tipo di un valore.
- JavaScript lascia passare operazioni senza senso e produce valori strani (`NaN`, `Infinity`, `true`).
- La fonte chiama queste cose stranezze e non spiega perché succedono.

## 4. Glossario

| Termine | Definizione dalla fonte | In parole semplici |
|---|---|---|
| Tipo | «some kind of value (a type)». Non è definito oltre. | La categoria di un valore, per esempio numero o array. |
| Quirks | «oddities and surprises» | Stranezze: comportamenti inattesi di un linguaggio. |
| Coercion | Non definito. La fonte dice che `==` «coerces its operands, leading to unexpected behavior». | (spiegazione mia) La conversione automatica di un valore in un altro tipo prima di confrontarlo. |

## 5. Con parole mie

### Domanda 1: Il refuso `obj.heigth`

> Cosa succede in JavaScript con `obj.width * obj.heigth`?

**Risposta:** JavaScript non dà errore. Il calcolo va avanti e il risultato è `NaN`.

- **Visto:** nel file `operazioni-senza-senso.js` la riga con `obj.width * obj.heigth` ha stampato `NaN`. Nessun messaggio di errore.
- **Dedotto:** `obj` non ha una proprietà `heigth`. Il nome giusto è `height`, quindi `obj.heigth` vale `undefined`. Poi `10 * undefined` dà `NaN`.
- **Spiegazione mia:** `NaN` vuol dire «non è un numero». JavaScript lo usa quando un calcolo non ha un risultato numerico sensato.
- **Dalla fonte:** la pagina dice che JavaScript lascia passare queste cose senza errore e le chiama stranezze. Non spiega il perché.

## 6. Da verificare

- Perché `"" == 0` è vero, perché `1 < x < 3` è sempre vero e perché `obj.heigth` dà `NaN`: la fonte non lo spiega. **Non provato.**
- Perché `typeof null` dà `'object'` e `typeof []` dà `'object'`: la fonte non lo dice. **Non provato.**

## 7. Fonti

- [TypeScript for the New Programmer](https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html), TypeScript Handbook (ultimo aggiornamento indicato: 25 novembre 2026).
