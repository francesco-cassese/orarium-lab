# 01 - I punti di riferimento (landmark) e l'elemento `<nav>`

## Teoria

### L'idea in due righe

Una pagina web ha una struttura che chi la vede capisce subito dal disegno: l'intestazione in alto, il contenuto al centro, un menu di lato.
Chi usa uno screen reader (un programma che legge la pagina a voce) non vede il disegno, quindi quella struttura va scritta nel codice. I punti di riferimento, in inglese *landmark*, servono a questo.

### A cosa servono

Un landmark classifica e dà un'etichetta a una sezione della pagina. Così la struttura che per gli occhi sta nel disegno diventa leggibile anche dai programmi.
Gli screen reader li usano per far saltare l'utente da una sezione importante all'altra con la tastiera. Anche i *skip link* («salta al contenuto») e alcune estensioni del browser li usano come punti di arrivo.

**Analogia (mia, non della documentazione): i cartelli sulle porte del laboratorio.**

In un laboratorio di pasticceria le porte hanno un cartello: «Magazzino», «Laboratorio», «Spedizioni». Chi entra al buio con una torcia sa dove si trova leggendo il cartello e non deve aprire ogni porta.
I landmark sono i cartelli della pagina: chi non vede il disegno salta da un cartello all'altro.
Dove l'analogia si ferma: i cartelli delle porte li leggono tutti, i landmark li usa soprattutto chi non può vedere la disposizione della pagina. E il cartello di una porta si legge da solo, mentre lo screen reader legge insieme l'etichetta e il tipo del landmark: per questo l'etichetta non deve ripetere il tipo (vedi sotto).

### Alcuni elementi HTML creano già un landmark

Non serve aggiungere niente: certi elementi HTML hanno già il loro ruolo.

| Elemento HTML | Ruolo del landmark |
|---|---|
| `aside` | `complementary` |
| `footer`, se sta nel `body` | `contentinfo` |
| `header`, se sta nel `body` | `banner` |
| `main` | `main` |
| `nav` | `navigation` |
| `section`, se ha un nome (`aria-labelledby` o `aria-label`) | `region` |
| `search` | `search` |

### Il landmark di navigazione: `<nav>`

Il landmark `navigation` serve a indicare gruppi di collegamenti (*link*) per spostarsi nel sito o nel contenuto della pagina. Si crea con l'elemento `nav`; se non si usa `nav`, si può scrivere `role="navigation"`.

### Quando serve l'etichetta

- Se lo stesso tipo di landmark compare più di una volta nella pagina, ogni copia ha un'etichetta diversa dalle altre.
- Se compare una volta sola, l'etichetta può non servire.
- Se l'area comincia con un titolo (`h1`-`h6`), il titolo può fare da etichetta con `aria-labelledby`. Se non c'è un titolo, l'etichetta si scrive con `aria-label`.
- Nell'etichetta non si scrive il tipo del landmark: lo screen reader lo aggiunge da solo.
- Eccezione prevista dalla pagina: se due landmark `navigation` hanno lo stesso identico insieme di collegamenti, hanno anche la stessa etichetta.

### Una regola generale

Mettere tutto il contenuto percepibile dentro un landmark, con il ruolo giusto, è per la pagina uno dei modi più efficaci per non far perdere informazioni a chi usa tecnologie assistive.

### In breve

| | Cosa fa |
|---|---|
| Landmark | segnala una sezione della pagina e il suo tipo |
| `<nav>` | crea il landmark `navigation` |
| `aria-label` | dà l'etichetta (il nome) a un landmark senza titolo |
| `aria-labelledby` | usa un titolo della pagina come etichetta |
| Più `<nav>` nella pagina | ognuno con la sua etichetta |

## Dalla documentazione (parole originali)

Le frasi sono da quattro pagine ufficiali: [Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/) (W3C WAI, ARIA Authoring Practices Guide), la pagina `<nav>` di MDN, la pagina Pagination di Bootstrap v5.3 e la pagina ByRole di Testing Library. I punti sul W3C sono quelli già scritti sopra.

- Sezione *Introduction*: "ARIA landmark roles provide a powerful way to identify the organization and structure of a web page."; "By classifying and labelling sections of a page, they enable structural information that is conveyed visually through layout to be represented programmatically."; "Screen readers exploit landmark roles to provide keyboard navigation to important sections of a page."; "Landmark regions can also be used as targets for "skip links" and by browser extensions to enhanced keyboard navigation."
- Sezione *HTML Sectioning Elements*: "The following HTML sectioning elements create ARIA landmark regions." Nella tabella che segue: `nav` ha il ruolo implicito `navigation`; `section` diventa `region` "if it has an accessible name provided by aria-labelledby or aria-label"; `header` e `footer` diventano `banner` e `contentinfo` "if it is in the context of a body element".
- Sezione *General Principles of Landmark Design*: "Including all perceivable content on a page in one of its landmark regions and giving each landmark region a semantically meaningful role is one of the most effective ways of ensuring assistive technology users will not overlook information that is relevant to their needs."
- Passo 3, *Label areas*: "If a specific landmark role is used more than once on a page, provide each instance of that landmark with a unique label."; "If a landmark is only used once on the page it may not require a label."; "If an area begins with a heading element (e.g. h1-h6) it can be used as the label for the area using the aria-labelledby attribute."; "If an area requires a label and does not have a heading element, provide a label using the aria-label attribute."; "Do not use the landmark role as part of the label. For example, a navigation landmark with a label "Site Navigation" will be announced by a screen reader as "Site Navigation Navigation". The label should simply be "Site"."
- Stesso passo, l'eccezione: "There is one rare circumstance where providing the same label to multiple instances of a landmark can be beneficial: the content and purpose of each instance is identical. For example, a large search results table has two sets of identical pagination controls -- one above and one below the table, so each set is in a navigation region labelled Search Results."
- Sezione *Navigation*: "Navigation landmarks provide a way to identify groups (e.g. lists) of links that are intended to be used for website or page content navigation."; "If a page includes more than one navigation landmark, each should have a unique label (see Step 3 above)."; "If a navigation landmark has an identical set of links as another navigation landmark on the page, use the same label for each navigation landmark."; "Use the HTML nav element to define a navigation landmark."; "If the HTML nav element technique is not being used, use a role="navigation" attribute to define a navigation landmark."
- Da MDN, `<nav>`: "The `<nav>` HTML element represents a section of a page whose purpose is to provide navigation links, either within the current document or to other documents."; "It's not necessary for all links to be contained in a `<nav>` element. `<nav>` is intended only for a major block of navigation links"; "A document may have several `<nav>` elements, for example, one for site navigation and one for intra-page navigation. aria-labelledby can be used in such case to promote accessibility, see example."; nella tabella Technical summary: "Implicit ARIA role navigation".
- Da Bootstrap, Pagination, sezione Overview: "Pagination is built with list HTML elements so screen readers can announce the number of available links. Use a wrapping `<nav>` element to identify it as a navigation section to screen readers and other assistive technologies."; "In addition, as pages likely have more than one such navigation section, it’s advisable to provide a descriptive aria-label for the `<nav>` to reflect its purpose. For example, if the pagination component is used to navigate between a set of search results, an appropriate label could be aria-label="Search results pages"."; sezione Active: "If using an `<a>` on the current page, aria-current="page" should be added for assistive technologies."
- Da Testing Library, ByRole: "Default roles are taken into consideration e.g. `<button />` has the button role without explicitly setting the role attribute."; "You can query the returned element(s) by their accessible name or description. The accessible name is for simple cases equal to e.g. the label of a form element, or the text content of a button, or the value of the aria-label attribute. It can be used to query a specific element if multiple elements with the same role are present on the rendered content."

## Con parole mie

### 1. Cos'è un landmark

> Cos'è un landmark, e a cosa serve a chi usa uno screen reader?

**Risposta:** È una parte della pagina che ha un ruolo, per esempio intestazione, menu o contenuto. Chi usa uno screen reader non vede il disegno della pagina. Il landmark gli dice che tipo di sezione è, e lo aiuta a passare da una sezione all'altra con la tastiera.

- **Dalla pagina:** «Screen readers exploit landmark roles to provide keyboard navigation to important sections of a page.»; «ARIA landmark roles provide a powerful way to identify the organization and structure of a web page.» (Introduction)

### 2. Il ruolo di `<nav>`

> Che ruolo crea l'elemento `nav`, e che cosa raggruppa secondo la pagina?

**Risposta:** `nav` crea il landmark `navigation`. Secondo la pagina, serve a raggruppare i collegamenti (*link*) per spostarsi nel sito o nel contenuto della pagina. Se non uso `nav`, posso scrivere `role="navigation"`.

- **Dalla pagina:** «Navigation landmarks provide a way to identify groups (e.g. lists) of links that are intended to be used for website or page content navigation.»; «Use the HTML nav element to define a navigation landmark.»; «If the HTML nav element technique is not being used, use a role="navigation" attribute to define a navigation landmark.» (Navigation)

### 3. Quando serve l'etichetta

> Quando un landmark ha bisogno di un'etichetta e quando può farne a meno? Con quali due attributi si scrive?

**Risposta:** L'etichetta serve quando lo stesso tipo di landmark compare più di una volta: ogni copia deve avere un nome diverso. Se compare una volta sola, può non servire. Ci sono due attributi: `aria-labelledby` se l'area comincia con un titolo, `aria-label` se il titolo non c'è.

- **Dalla pagina:** «If a specific landmark role is used more than once on a page, provide each instance of that landmark with a unique label.»; «If a landmark is only used once on the page it may not require a label.»; «If an area begins with a heading element (e.g. h1-h6) it can be used as the label for the area using the aria-labelledby attribute.»; «If an area requires a label and does not have a heading element, provide a label using the aria-label attribute.» (passo 3, *Label areas*)

### 4. Perché non ripetere il tipo

> Perché l'etichetta «Navigazione del sito» è una scelta sbagliata per un `<nav>`, e quale sarebbe invece un'etichetta giusta?

**Risposta:** Lo screen reader aggiunge il tipo da solo. Con l'etichetta «Navigazione del sito» direbbe «Navigazione del sito navigazione». Un'etichetta giusta è «Sito».

- **Dalla pagina:** «Do not use the landmark role as part of the label. For example, a navigation landmark with a label "Site Navigation" will be announced by a screen reader as "Site Navigation Navigation". The label should simply be "Site".» (passo 3, *Label areas*)

### 5. Un'applicazione: il paginatore

> Il paginatore di Orarium ha due pulsanti (`<button>`) con il testo «Pagina 1 di 5». Se lo mettessi in un `<nav>`, quale etichetta gli daresti, secondo la regola della pagina, e perché? Servirebbe un'etichetta se nella pagina ci fosse un solo `<nav>`?

**Risposta:** Secondo me non lo metterei in un `nav`. La pagina dice che `nav` serve per gruppi di collegamenti, e i miei due pulsanti non lo sono. Non so però se la pagina consideri i controlli di paginazione collegamenti o pulsanti: nell'esempio li mette in un `nav` con etichetta «Search Results». Se lo mettessi in un `nav`, userei «Paginazione», senza scrivere anche «navigazione». Con un solo `nav` nella pagina l'etichetta può non servire.

- **Dedotto:** non lo metterei in un `nav`, perché i miei pulsanti non sono collegamenti. È una mia deduzione: la pagina non dice se i controlli di paginazione sono collegamenti o pulsanti.
- **Dalla pagina:** «a large search results table has two sets of identical pagination controls -- one above and one below the table, so each set is in a navigation region labelled Search Results.» (passo 3, *Label areas*, eccezione)
- **Non provato:** come lo screen reader legge un paginatore con pulsanti dentro un `nav`.

## Esercizio: la traccia

Lavoro in `accessibilita/01-punti-di-riferimento`, dentro il lab. Non tocco la cartella `orarium`. Scrivo nella traccia solo quello che è successo: il comando, cosa ho visto, cosa ho concluso. Le previsioni non ci vanno. Nella cartella dell'esercizio c'è l'ultima versione dei file; le versioni intermedie sono descritte solo nei passi. In ogni cartella `pnpm test` esegue `vitest run`.

### Passo 1: preparare la cartella

- Comando: `mkdir accessibilita\01-punti-di-riferimento`, poi `Set-Location accessibilita\01-punti-di-riferimento`, poi `pnpm init`, poi `pnpm add -D vitest jsdom @testing-library/dom`.
- Cosa ho visto: `pnpm init` ha scritto `package.json` con nome `01-punti-di-riferimento` e `"type": "module"`. L'installazione ha aggiunto 77 pacchetti: `@testing-library/dom` 10.4.2, `jsdom` 31.0.1, `vitest` 5.1.2, in 7,3 secondi, con pnpm v11.29.0. Nell'esercizio 10 Vitest era alla 5.1.1, come in Orarium.
- Cosa ho concluso: la cartella è pronta. Ho cambiato lo script `test` da `echo "Error: no test specified" && exit 1` a `vitest run`, e ho scritto `vitest.config.js` con `environment: 'jsdom'`.

### Passo 2: un `<nav>` senza etichetta

- Scrivo `nav.test.js` con un test che mette nella pagina un solo `<nav>` con un collegamento e cerca `screen.getByRole('navigation')`.
- Run 1. Comando: `pnpm test`
  - Cosa ho visto: 1 test, verde, in 916 ms.
  - Cosa ho concluso: il `<nav>` si trova con il ruolo `navigation` senza che io abbia scritto `role="navigation"` nel codice.
- Run 2. Cambio la verifica in `getByRole('banner')`, per vedere il test rosso. Comando: `pnpm test`
  - Cosa ho visto: 1 test, rosso: `Unable to find an accessible element with the role "banner"`. Sotto, l'elenco dei ruoli trovati nella pagina: `navigation` con Name `""` e `<nav />`, e link con Name `"Uno"` e `<a href="/uno" />`.
  - Cosa ho concluso: il test è capace di fallire. Il `<nav>` senza `aria-label` ha un nome vuoto; il collegamento ha come nome il suo testo. Ho rimesso `'navigation'`.

### Passo 3: due `<nav>`, senza e con etichette

- Run 3. Aggiungo un secondo test con due `<nav>` senza etichetta, che cerca `getByRole('navigation')` e controlla `toBeDefined()`. Avevo lasciato `'banner'` nel primo test. Comando: `pnpm test`
  - Cosa ho visto: 2 test, tutti e due rossi. Il primo, per `'banner'`. Il secondo: `Found multiple elements with the role "navigation"`, con i due `<nav>` stampati uno dopo l'altro e la frase «(If this is intentional, then use the *AllBy* variant of the query …)».
  - Cosa ho concluso: con due elementi dello stesso ruolo `getByRole` non ne sceglie uno: lancia un errore.
- Run 4. Rimetto `'navigation'` nel primo test, ma nel secondo il file non era stato salvato con le modifiche nuove. Comando: `pnpm test`
  - Cosa ho visto: 2 test, 1 verde (il primo) e 1 rosso (il secondo, ancora quello vecchio). Il file con le modifiche nuove non era salvato.
  - Cosa ho concluso: l'esecuzione mostrava il vecchio file. Ho salvato con Ctrl+S.
- Run 5. Cambio il secondo test in `expect(() => screen.getByRole('navigation')).toThrow(/multiple elements/)` e aggiungo un terzo test con due `<nav>` con `aria-label="Sito"` e `aria-label="Paginazione"`, cercati con `getByRole('navigation', { name: ... })`. Comando: `pnpm test`
  - Cosa ho visto: 3 test verdi. Con il nome, ogni ricerca ha trovato il suo `<nav>` (textContent «Uno» e «Due»).
  - Cosa ho concluso: l'errore del secondo test è quello previsto, e il nome (`aria-label`) distingue due `<nav>`.

### Passo 4: l'etichetta che ripete il tipo

- Scrivo un test con `<nav aria-label="Navigazione del sito">`, che cerca per nome prima `'Sito'` (e controlla `toThrow()`) e poi `'Navigazione del sito'`.
- Run 6. Comando: `pnpm test`
  - Cosa ho visto: 4 test verdi.
  - Cosa ho concluso: con il nome `'Sito'` il `<nav>` non si trova, con il testo intero di `aria-label` sì. Il nome è quindi il testo di `aria-label` così com'è: il ruolo `navigation` non fa parte del nome, ma sta a parte.

### Passo 5: il paginatore con e senza `<nav>`

- Scrivo due test con il markup del paginatore di Orarium: il testo «Pagina 1 di 5» e due pulsanti «Indietro» e «Avanti». Nel primo sono dentro `<nav aria-label="Paginazione">`, nel secondo non c'è `<nav>`.
- Run 7. Comando: `pnpm test`
  - Cosa ho visto: 6 test verdi. Con il `<nav>`: `getByRole('navigation', { name: 'Paginazione' })` lo trova e `getAllByRole('button')` ne trova 2. Senza `<nav>`: `getByRole('navigation')` lancia l'errore e `getByRole('button', { name: 'Avanti' })` trova il pulsante.
  - Cosa ho concluso: i due pulsanti restano pulsanti con o senza `<nav>`; il `<nav>` aggiunge solo il punto di riferimento `navigation` e il suo nome.

## Dopo l'esercizio

### Cosa ho fatto

- Ho preparato una cartella con Vitest, jsdom e `@testing-library/dom`, ho scritto 6 test in `nav.test.js` e ho fatto 7 esecuzioni: il ruolo di un `<nav>`, il test rosso con `banner`, due `<nav>` senza e con etichetta, l'etichetta che ripete il tipo, il paginatore con e senza `<nav>`.

### Cosa ho visto

- Un `<nav>` ha il ruolo `navigation` senza che io lo scriva, e senza `aria-label` ha un nome vuoto (`Name ""`).
- Con due `<nav>` senza etichetta, `getByRole('navigation')` lancia `Found multiple elements`.
- Con `aria-label` diverse, `getByRole('navigation', { name })` trova ogni `<nav>`.
- Il nome di un `<nav>` è il testo di `aria-label`: con `'Sito'` non ho trovato un `<nav>` con etichetta «Navigazione del sito».
- Il paginatore con due pulsanti dentro un `<nav>` si trova per nome, e i pulsanti restano pulsanti.

### Cosa ho verificato

- Il ruolo implicito di `nav` è `navigation`: lo dicono la tabella del W3C e la tabella Technical summary di MDN, e l'ho visto nel test del passo 2.
- Per Testing Library il nome accessibile può essere «il valore dell'attributo `aria-label`» (pagina ByRole) e serve a distinguere più elementi con lo stesso ruolo: l'ho visto nei passi 3 e 4.
- Bootstrap mette la paginazione dentro un `<nav>` con `aria-label` (pagina Pagination, Overview).

### Cosa ho dedotto e non ancora verificato

- Il W3C dice che con l'etichetta «Site Navigation» lo screen reader legge «Site Navigation Navigation». Nei test il nome non contiene il ruolo: quindi è lo screen reader a unire nome e ruolo. Lo deduco dalla pagina e dai test; non l'ho provato con uno screen reader.
- Il `<nav>` nel paginatore non cambia i pulsanti: l'ho visto con Testing Library, ma non so come lo screen reader legga questa struttura.

### Domande aperte

- Il paginatore di Orarium ha due pulsanti, non collegamenti. Il W3C, MDN e Bootstrap parlano di collegamenti; il W3C e Bootstrap mettono la paginazione in un `<nav>` con un'etichetta, ma nessuna delle tre pagine parla di pulsanti. Metterlo in un `<nav>` è una scelta da decidere in Orarium, con le alternative.
- Se il paginatore diventasse una lista di collegamenti, servirebbe `aria-current="page"` sul collegamento della pagina corrente (Bootstrap, sezione Active)? Con i due pulsanti di oggi non c'è un collegamento per pagina.
- Come legge davvero uno screen reader un `<nav>` con etichetta: da provare con uno screen reader vero.

### Applicazione in Orarium

## Fonti

- [Landmark Regions](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/), ARIA Authoring Practices Guide, W3C WAI.
- [`<nav>`: HTML navigation section element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav), MDN Web Docs.
- [Pagination](https://getbootstrap.com/docs/5.3/components/pagination/), Bootstrap v5.3.
- [ByRole](https://testing-library.com/docs/queries/byrole/), Testing Library.
