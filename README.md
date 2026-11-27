# orarium-lab
Il mio quaderno di studio: provo, sbaglio, capisco e poi uso tutto in Orarium.

Orarium è il progetto a cui mi serve tutto questo: un'app per pianificare produzione e scorte nei laboratori alimentari, su [github.com/francesco-cassese/orarium](https://github.com/francesco-cassese/orarium).

## Come è organizzata

- [docker/](docker/): esercizi su Docker (immagine e contenitore, avviare, vedere e fermare un contenitore, porte e volumi, Compose con un servizio, variabili d'ambiente e healthcheck, `depends_on`, il `compose.yaml` di Orarium).
- [vitest/](vitest/): esercizi su Vitest (il primo test, i confronti `toBe`, `toEqual`, `toStrictEqual`, `.not`, `toThrow`, `describe`, `beforeEach`, `afterEach`, i test asincroni con `async`/`await`, `resolves` e `rejects`, le funzioni finte con `vi.fn()`, le spie con `vi.spyOn`, le globali finte con `vi.stubGlobal`, le variabili d'ambiente finte con `vi.stubEnv`, i moduli finti con `vi.mock`, i timer finti con `vi.useFakeTimers` e l'ambiente di esecuzione con `environment`, `setupFiles` e `isolate`).
- [accessibilita/](accessibilita/): esercizi sull'accessibilità del web (i punti di riferimento o *landmark*, l'elemento `<nav>` e la sua etichetta, provati con Testing Library).
- [typescript/](typescript/): esercizi su TypeScript (cos'è TypeScript, il controllo statico dei tipi, `tsc`, i tipi che spariscono).

## Come lavoro

- Prendo le pagine della documentazione ufficiale e le faccio sintetizzare a Claude, che prepara la teoria, le domande e la traccia di ogni esercizio.
- Controllo le citazioni sul testo della pagina originale. I comandi, le osservazioni e le risposte «con parole mie» sono scritti da me.
- Ogni esercizio ha teoria, citazioni dalla documentazione ufficiale e le mie risposte con parole mie, in questo ordine. Fanno eccezione due esercizi di Docker: il 02 ha la teoria in sezioni numerate e le domande aperte prima delle citazioni; il 07 è una lettura guidata del `compose.yaml`, non ha la teoria e parte dalle mie risposte, che rimandano alle citazioni che stanno sotto.
- Ogni risposta «con parole mie» ha una frase di risposta e, quando servono, queste etichette: **Visto** (l'ho controllato io con un comando o aprendo un file), **Dalla pagina** (lo dice una fonte scritta), **Dedotto** (è un mio ragionamento) e **Non provato** (non l'ho verificato).
- Gli esercizi vanno dal più semplice all'avanzato, un concetto nuovo per volta.
- I commit sono in italiano, con tipo e scope in inglese secondo le [Conventional Commits](https://www.conventionalcommits.org/it/v1.0.0/).

## Stato

Ho fatto gli esercizi da 01 a 07 di Docker: immagine e contenitore, come avviarli, vederli e fermarli, porte e volumi, Compose con un servizio, variabili d'ambiente e healthcheck, due servizi con `depends_on`, il `compose.yaml` di Orarium riga per riga, con il diario dei comandi. Il blocco su Docker è finito ([vedi l'indice](docker/README.md)). Ho cominciato Vitest e ho fatto gli esercizi da 01 a 10 ([vedi l'indice](vitest/README.md)). Ho cominciato l'accessibilità e ho fatto l'esercizio 01 ([vedi l'indice](accessibilita/README.md)). Ho cominciato TypeScript e ho fatto l'esercizio 01 ([vedi l'indice](typescript/README.md)).
