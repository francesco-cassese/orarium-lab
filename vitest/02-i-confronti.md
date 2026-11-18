# 02 - I confronti
 
## Teoria
 
### L'idea in due righe
 
Un confronto (in inglese «matcher») è il metodo che attacco a `expect(...)` per dire cosa mi aspetto dal valore: `.toBe(5)`, `.toEqual({ ... })`, `.toThrow()`.
Scegliere il confronto giusto decide cosa il test controlla davvero: con quello sbagliato il test può passare, o fallire, per un motivo che non è quello che mi interessa.
 
### `toBe`: lo stesso valore, o lo stesso oggetto
 
Con numeri, stringhe e booleani `toBe` confronta il valore: `expect(2 + 2).toBe(4)`.
Con gli oggetti confronta l'identità, cioè se sono lo stesso oggetto in memoria, non se hanno lo stesso contenuto. Due oggetti scritti separatamente, anche identici, per `toBe` sono diversi.
La pagina di `expect` dice che `toBe` equivale a `Object.is`. Nell'errore dell'esercizio 01 compariva la scritta «Object.is equality»: il legame tra le due cose lo controllo nell'esercizio, non lo do per scontato.
 
### `toEqual`: la stessa struttura
 
`toEqual` confronta campo per campo, anche dentro oggetti e array, e ignora l'identità. Due oggetti `{ nome: 'Alice' }` scritti separatamente sono diversi per `toBe` e uguali per `toEqual`.
 
### `toStrictEqual`: `toEqual` più severo
 
`toStrictEqual` è più severo di `toEqual` in tre modi, tutti dalla documentazione:
 
- i campi con valore `undefined` contano: `{ a: 1 }` e `{ a: 1, b: undefined }` per lui sono diversi;
- i tipi contano: un'istanza di una classe e un oggetto letterale con gli stessi campi sono diversi;
- i «buchi» negli array contano: `[, 1]` e `[undefined, 1]` sono diversi.

### `.not`: il contrario
 
Inserito prima del confronto, `.not` lo nega: `expect(1 + 2).not.toBe(0)` passa quando il valore non è 0.
Se il valore è quello che il `.not` esclude, la verifica lancia un errore e il test fallisce.
 
### `toThrow`: controllare che venga lanciato un errore
 
`toThrow` verifica che una funzione lanci un errore quando viene chiamata. La chiamata va scritta dentro un'altra funzione, `expect(() => dividi(1, 0)).toThrow()`: senza, l'errore parte prima che Vitest possa prenderlo.
Come argomento si può passare una stringa (il messaggio dell'errore la contiene) o un'espressione regolare (il messaggio la rispetta).
 
### Quale scegliere
 
La regola pratica della pagina: `toBe` per i valori semplici, `toEqual` per confrontare la struttura, `toStrictEqual` quando contano anche i tipi e i valori `undefined` scritti in modo esplicito.
 
**Analogia (mia, non della documentazione): le due torte.**
 
Due torte fatte con la stessa ricetta e gli stessi pesi sono uguali come ricetta (`toEqual`), ma non sono la stessa torta (`toBe`): la stessa torta è quella sul tavolo che indico due volte.
Dove l'analogia si ferma: due torte hanno ciascuna il suo peso e il suo posto, mentre due «5» sono lo stesso 5. Per i numeri `toBe` basta, perché non esistono «due 5 diversi».
 
### In breve
 
| | Cosa controlla |
|---|---|
| `toBe(x)` | valore uguale, o stesso oggetto in memoria |
| `toEqual(x)` | stessa struttura, anche in profondità |
| `toStrictEqual(x)` | come `toEqual`, ma contano `undefined`, tipi e buchi negli array |
| `.not` | nega il confronto che segue |
| `toThrow()` | la funzione lancia un errore (la chiamata va dentro una funzione) |
 
## Dalla documentazione (parole originali)
 
- Da [Using Matchers](https://vitest.dev/guide/learn/matchers): "Vitest uses `expect` with "matchers" to assert that values meet certain conditions."; "But when you're comparing objects, `toBe` checks *identity* (whether they're the exact same object in memory), not whether they have the same shape."; "It recursively compares every field of an object or element of an array, ignoring object identity:" (su `toEqual`).
- Da [Using Matchers](https://vitest.dev/guide/learn/matchers): "There's also `toStrictEqual`, which is stricter than `toEqual` in three ways"; "A good rule of thumb: use `toBe` for primitives (numbers, strings, booleans), `toEqual` for comparing structure, and `toStrictEqual` when you also care about types and explicit `undefined` values."
- Da [Using Matchers](https://vitest.dev/guide/learn/matchers): "You can also negate any matcher by inserting `.not` before it."; "To verify that a function throws an error, use `toThrow`."; "You need to wrap the call in another function so that Vitest can catch the error instead of letting it crash the test:"
- Da [expect, `toBe`](https://vitest.dev/api/expect): "`toBe` can be used to assert if primitives are equal or that objects share the same reference."; "It is equivalent of calling `expect(Object.is(3, 3)).toBe(true)`."
- Da [expect, `toEqual`](https://vitest.dev/api/expect): "`toEqual` asserts if actual value is equal to received one or has the same structure, if it is an object" e "(compares them recursively)."
- Da [expect, `toStrictEqual`](https://vitest.dev/api/expect): "Keys with `undefined` properties are checked."; "Array sparseness is checked."; "Object types are checked to be equal."
- Da [expect, `toThrow`](https://vitest.dev/api/expect): "`toThrow` asserts if a function throws an error when it is called."; "You must wrap the code in a function, otherwise the error will not be caught, and test will fail."
- Da [expect, `.not`](https://vitest.dev/api/expect): "Using `not` will negate the assertion."

## Con parole mie
 
### 1. `toBe` e `toEqual`
 
> Che differenza c'è tra `toBe` e `toEqual`? Fai un esempio con due oggetti.
 
**Risposta:** `toBe` controlla se è proprio lo stesso oggetto. `toEqual` controlla se dentro ci sono le stesse cose. Esempio: `const a = { nome: 'Alice' }` e `const b = { nome: 'Alice' }` sono due oggetti separati con gli stessi dati. `expect(a).toBe(b)` fallisce, perché sono due oggetti diversi. `expect(a).toEqual(b)` passa, perché i dati coincidono.

- **Visto:** passi 3 e 4: `toBe` dà rosso con due oggetti separati, `toEqual` passa con gli stessi.
- **Dalla pagina:** `toBe` controlla l'identità, cioè se sono lo stesso oggetto in memoria, non se hanno la stessa forma («Using Matchers»).
 
### 2. `toEqual` e `toStrictEqual`
 
> In quali casi `toEqual` passa e `toStrictEqual` no? Nomina almeno due casi.
 
**Risposta:** Ci sono tre casi in cui `toEqual` passa e `toStrictEqual` no. Il primo: un campo con valore `undefined`. `{ a: 1, b: undefined }` e `{ a: 1 }` per `toEqual` sono uguali, per `toStrictEqual` no, perché il primo ha una chiave in più. Il secondo: il tipo. Un oggetto creato da una classe e un oggetto normale con gli stessi campi sono uguali per `toEqual`, diversi per `toStrictEqual`. Il terzo sono gli array con i buchi.

- **Visto:** i tre casi. Con `undefined` e con la classe `Utente` nei test del passo 6; con gli array con i buchi (`[, 1]` e `[undefined, 1]`) nei due test del passo 10.
 
### 3. `.not`
 
> Cosa fa `.not`, e quando lo useresti?
 
**Risposta:** `.not` inverte il controllo che viene dopo. Con `expect(1 + 2).not.toBe(0)` il test passa, perché 3 non è 0. Se il valore fosse 0, il test fallirebbe. Lo userei quando voglio assicurarmi che una cosa non succeda. Nel progetto: in `IngredientList.test.jsx`, riga 54, c'è `expect(screen.queryByRole('cell', { name: 'pc' })).not.toBeInTheDocument()`: la cella con il codice `pc` non deve comparire, perché la lista lo mostra come `pz`.

- **Visto:** in `IngredientList.test.jsx` c'è proprio questa riga, alla riga 54: l'ho controllata con `Select-String` in PowerShell.
 
### 4. Controllare un errore
 
> Come si controlla che una funzione lanci un errore? Perché la chiamata va scritta dentro un'altra funzione?
 
**Risposta:** Si scrive `expect(() => dividi(1, 0)).toThrow()`: il test passa se la funzione lancia un errore. La chiamata va dentro un'altra funzione, la freccia `() => ...`, perché altrimenti `expect` non riesce a prendere l'errore e il test fallisce. Se voglio controllare anche il messaggio, posso scrivere un pezzo del messaggio tra parentesi, per esempio `toThrow('Non si divide per zero')`.
 
- **Visto:** passi 8 e 9: senza `() =>` il test fallisce con l'errore originale della funzione; con `toThrow('negativo')` il test fallisce, e il messaggio mostra «Expected: "negativo"» e «Received: "Non si divide per zero"».
 
### 5. Scegliere il confronto
 
> Una funzione restituisce il numero `5`; un'altra restituisce l'array `[1, 2, 3]`. Quale confronto useresti in ciascun caso, e perché?
 
**Risposta:** Per il numero `5` userei `toBe(5)`: un numero è un valore semplice, e `toBe` controlla proprio che sia 5. Per l'array `[1, 2, 3]` userei `toEqual([1, 2, 3])`, perché `toBe` guarderebbe se è lo stesso array in memoria, mentre a me interessa che i suoi elementi siano quelli giusti.

- **Visto:** passo 2, `expect(2 + 2).toBe(4)` passa. L'array non l'ho provato nell'esercizio.
- **Dalla pagina:** «use `toBe` for primitives (numbers, strings, booleans), `toEqual` for comparing structure».
- **Dedotto:** per l'array `toEqual`, perché mi interessano gli elementi, non l'identità. È il mio ragionamento.
 
### 6. Un errore che non torna
 
> Se `expect(a).toBe(b)` fallisce con due oggetti che, stampati, sembrano uguali, come capisci se il problema è l'identità o il contenuto?
 
**Risposta:** Se `toBe` fallisce ma i due oggetti sembrano uguali, il problema è quasi sempre l'identità: sono due oggetti diversi, anche se hanno gli stessi dati. Per controllarlo provo `expect(a).toEqual(b)`. Se questo passa, il contenuto è uguale e la differenza è solo che sono due oggetti separati. Se fallisce anche questo, allora i dati sono davvero diversi, e lo vedo nel messaggio dell'errore.

- **Visto:** passo 3, il messaggio dice «Compared values have no visual difference», cioè i valori stampati sono uguali. Passo 4: con `toEqual` gli stessi oggetti passano.
- **Dedotto:** «quasi sempre» l'identità: è un mio ragionamento.
 
## Esercizio: la traccia
 
Lavoro in `vitest/02-confronti`, dentro il lab. Tutti i file di codice li scrivo io, da capo.
Non tocco la cartella `orarium`.
Nella cartella dell'esercizio c'è l'ultima versione dei file di codice: le versioni intermedie (per esempio quelle con un test rosso di proposito) sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`; durante l'esercizio ho usato `pnpm exec vitest run`.
Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno.
 
### Passo 1: preparare la cartella
 
- Comando: `pnpm init`, poi `pnpm add -D vitest`, dentro `vitest/02-confronti`; poi `git status --short -uall`
- Cosa ho visto: ho creato la cartella `vitest/02-confronti` e ci ho lanciato `pnpm init`, che ha scritto `package.json` con nome `02-confronti` e `"type": "module"`. Poi `pnpm add -D vitest` ha aggiunto 35 pacchetti e ha scritto `vitest 5.1.0` in `devDependencies`; in tutto ha impiegato 1,3 secondi. Poi `git status --short -uall`, lanciato in `vitest/02-confronti`, ha dato: ` M ../README.md` (cioè `vitest/README.md`, modificato), `?? package.json`, `?? pnpm-lock.yaml` e `?? ../02-i-confronti.md` (cioè il file di questo esercizio, non ancora tracciato). `node_modules` non compare.
- Cosa ho concluso: Vitest è installato come dipendenza di sviluppo nella cartella `02-confronti`. Il `git status` mostra che `package.json` e `pnpm-lock.yaml` sono nuovi e non ancora tracciati.

### Passo 2: `toBe` con numeri e stringhe
 
- Scrivo `confronti.test.js` con due test: `expect(2 + 2).toBe(4)` e `expect('ciao').toBe('ciao')`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: `confronti.test.js` con 2 test, entrambi passati («Test Files 1 passed», «Tests 2 passed»). Il primo test si chiama «2 più 2 fa 4».
- Cosa ho concluso: `toBe` con numeri e stringhe passa. Il nome del primo test descrive quello che controlla.

### Passo 3: `toBe` con due oggetti (rosso, di proposito)
 
- Scrivo due oggetti con lo stesso contenuto, `const a = { nome: 'Alice' }` e `const b = { nome: 'Alice' }`, e il test `expect(a).toBe(b)`. Voglio vedere il messaggio di errore.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 3 test, 2 passati e 1 fallito: «confronta due oggetti». Il messaggio dice `AssertionError: expected { nome: 'Alice' } to be { nome: 'Alice' } // Object.is equality`, poi: «If it should pass with deep equality, replace "toBe" with "toStrictEqual"». Mostra `Expected: { nome: 'Alice' }` e `Received: serializes to the same string`, e dice «Compared values have no visual difference». Il fallimento è alla riga 14, su `expect(a).toBe(b)`.
- Cosa ho concluso: con `toBe`, due oggetti separati con lo stesso contenuto risultano diversi, anche se a vederli sono uguali.

### Passo 4: `toEqual` con gli stessi oggetti
 
- Cambio il test in `expect(a).toEqual(b)`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 3 test, tutti passati («Test Files 1 passed», «Tests 3 passed»). Il test «confronta due oggetti» è verde.
- Cosa ho concluso: con `toEqual`, due oggetti separati con lo stesso contenuto risultano uguali.

### Passo 5: `.not` e lo stesso oggetto
 
- Scrivo `expect(a).not.toBe(b)`. Poi `const c = a` e `expect(c).toBe(a)`. Divido il test in due, uno per ogni verifica.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 5 test, tutti passati («Test Files 1 passed», «Tests 5 passed»). I due nuovi sono «due oggetti con lo stesso contenuto non sono lo stesso oggetto» e «una variabile che punta allo stesso oggetto passa con toBe». Il test con `toEqual` ha il nome «due oggetti con lo stesso contenuto sono uguali per toEqual».
- Cosa ho concluso: `.not.toBe` passa con due oggetti separati, e `toBe` passa quando la variabile punta allo stesso oggetto.

### Passo 6: `toStrictEqual`
 
- Scrivo i confronti di sotto, ciascuno in un test suo:
  - `expect({ a: 1 }).toEqual({ a: 1, b: undefined })` e `expect({ a: 1 }).not.toStrictEqual({ a: 1, b: undefined })`;
  - una classe `Utente` con il campo `nome`: `expect(new Utente('Alice')).toEqual({ nome: 'Alice' })` e `expect(new Utente('Alice')).not.toStrictEqual({ nome: 'Alice' })`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 9 test, tutti verdi («Test Files 1 passed», «Tests 9 passed»). I quattro nuovi sono «un campo undefined: toEqual lo ignora», «un campo undefined: toStrictEqual non lo ignora», «un Utente è uguale per toEqual a un oggetto con gli stessi campi» e «un Utente non è uguale per toStrictEqual a un oggetto con gli stessi campi».
- Cosa ho concluso: le due differenze si confermano nei due casi provati: con `undefined` e con la classe `Utente`, `toEqual` passa e `toStrictEqual` no.

### Passo 7: `toThrow`
 
- Scrivo `dividi(a, b)` in `dividi.js`: se `b` è `0` lancia `new Error('Non si divide per zero')`, altrimenti restituisce `a / b`. Nel test scrivo tre verifiche: `expect(() => dividi(1, 0)).toThrow()`, poi con la stringa `'zero'`, poi con la regex `/zero/`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: prima 12 test, tutti verdi. I tre nuovi sono «dividi per zero lancia un errore», «dividi per zero lancia un errore con il messaggio che contiene «zero»» e «dividi per zero lancia un errore con il messaggio che rispetta /zero/». Poi ho aggiunto «dividi 6 per 3 dà 2», e i test sono diventati 13, tutti verdi («Test Files 1 passed», «Tests 13 passed»).
- Cosa ho concluso: `toThrow()` con la funzione dentro passa quando la funzione lancia un errore. Con la stringa `'zero'` e con la regex `/zero/` passa anche il messaggio: contiene «zero».

### Passo 8: `toThrow` senza la funzione intorno (rosso, di proposito)
 
- Scrivo `expect(dividi(1, 0)).toThrow()`, senza `() =>`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 13 test, 12 passati e 1 fallito: «dividi per zero lancia un errore». Il messaggio dice `Error: Non si divide per zero`, con la riga `throw new Error('Non si divide per zero');` di `dividi.js` alla riga 4, e il test che lo chiama alla riga 53 di `confronti.test.js`.
- Cosa ho concluso: senza `() =>`, il test fallisce con l'errore originale della funzione, non con un messaggio di `toThrow`. Gli altri 12 test restano verdi.
- **Dalla pagina:** il `toThrow` va dentro una funzione, perché altrimenti «the error will not be caught»: l'errore non viene preso dal test. La mia prova è coerente con questa frase, ma da sola non la dimostra.
- Poi rimetto la versione con `() =>`: 13 test, tutti verdi («Tests 13 passed»).

### Passo 9: `toThrow` con un messaggio che non c'è (rosso, di proposito)
 
- Scrivo `expect(() => dividi(1, 0)).toThrow('negativo')`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 13 test, 12 passati e 1 fallito: «dividi per zero lancia un errore con il messaggio che contiene «zero»». Il messaggio dice `AssertionError: expected [Function] to throw error including 'negativo' but got 'Non si divide per zero'`, con «Expected: "negativo"» e «Received: "Non si divide per zero"». Il fallimento è alla riga 57, su `toThrow('negativo')`.
- Cosa ho concluso: con una stringa che non è nel messaggio, `toThrow` fallisce e mi dice sia la stringa attesa sia il messaggio ricevuto.
- Poi rimetto `'zero'`: 13 test, tutti verdi («Tests 13 passed»).

### Passo 10: gli array con i buchi

- Scrivo due test: `expect([, 1]).toEqual([undefined, 1])` e `expect([, 1]).not.toStrictEqual([undefined, 1])`.
- Comando: `pnpm exec vitest run`
- Cosa ho visto: 15 test, tutti passati («Tests 15 passed»). I due nuovi sono «un array con un buco è uguale per toEqual a uno con undefined» e «un array con un buco non è uguale per toStrictEqual a uno con undefined».
- Cosa ho concluso: anche con gli array con i buchi, `toEqual` passa e `toStrictEqual` no.

## Dopo l'esercizio
 
### Cosa ho fatto
 
- Comandi usati (descritti nel [diario](comandi.md)): `mkdir`, `pnpm init`, `pnpm add -D vitest`, `git status --short -uall`, `pnpm exec vitest run`.

### Cosa ho visto
 
- Con `toBe`, due oggetti separati con lo stesso contenuto danno rosso, e il messaggio dice che i valori stampati sono uguali (passo 3).
- Con `toEqual` gli stessi due oggetti passano (passo 4).
- `.not.toBe` sui due oggetti passa, e `toBe` su una variabile che punta allo stesso oggetto passa (passo 5).
- Con `undefined` e con la classe `Utente`, `toEqual` passa e `toStrictEqual` no (passo 6); con gli array con i buchi succede lo stesso (passo 10).
- Senza `() =>` il test fallisce con l'errore originale di `dividi`; con la stringa sbagliata fallisce con un `AssertionError` che mostra `Expected` e `Received` (passi 8 e 9).
- Nel messaggio del passo 3 compare la scritta «Object.is equality».
- **Dalla pagina:** `toBe` equivale a `Object.is` («It is equivalent of calling `expect(Object.is(3, 3)).toBe(true)`»; pagina expect).

### Cosa ho verificato
 
- Con `pnpm exec vitest run`, `confronti.test.js` ha 15 test, tutti verdi (passo 10).
- `dividi(6, 3)` restituisce `2` (test «dividi 6 per 3 dà 2», passo 7).
- Con `toThrow` e una stringa che non è nel messaggio, il test fallisce e il messaggio mostra `Expected` e `Received` (passo 9).

### Cosa ho dedotto e non ancora verificato
 
- Che le stesse differenze valgano per altri oggetti e altri tipi di dati: ho provato solo gli esempi di questo file.
- Che il suggerimento di `toStrictEqual` nel messaggio sia sempre quello da seguire: non l'ho controllato.

### Domande aperte
 
- Perché il messaggio di errore suggerisce `toStrictEqual` invece di `toEqual`?
- La domanda dell'esercizio 01 su «Object.is equality» resta aperta: so che `toBe` equivale a `Object.is`, ma non so ancora cosa fa esattamente `Object.is`.

### Applicazione in Orarium
 
- **Visto:** nei file di test tracciati di `frontend/src` non compare nessun `toBe(`, `toEqual`, `toStrictEqual` o `toThrow`: il comando `git grep` ha dato output vuoto.
- **Visto:** `frontend/src/utils` contiene solo `formatPrice.js` e `formatUnit.js`. Nell'elenco dei file di `src` non c'è nessun file di test per loro: non hanno test loro.
- **Dedotto:** le due funzioni sono piccole e restituiscono valori semplici (`formatUnit` cambia `pc` in `pz` e lascia gli altri codici com'erano), quindi `toBe` sarebbe il confronto naturale. Non l'ho provato: è un'ipotesi per l'esercizio 08.

Non ho aperto una PR: è una scelta, perché qui ho imparato i confronti su esempi miei. L'applicazione vera è nell'esercizio 08.
 
## Fonti
 
- [Using Matchers](https://vitest.dev/guide/learn/matchers)
- [expect](https://vitest.dev/api/expect)