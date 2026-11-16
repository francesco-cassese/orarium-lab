# orarium-lab
Il mio quaderno di studio: provo, sbaglio, capisco e poi uso tutto in Orarium.

Orarium è il progetto a cui mi serve tutto questo: un'app per pianificare produzione e scorte nei laboratori alimentari, su [github.com/francesco-cassese/orarium](https://github.com/francesco-cassese/orarium).

## Come è organizzata

- [docker/](docker/): esercizi su Docker (immagine e contenitore, avviare, vedere e fermare un contenitore, porte e volumi, Compose con un servizio, variabili d'ambiente e healthcheck, `depends_on`, il `compose.yaml` di Orarium).

## Come lavoro

- Prendo le pagine della documentazione ufficiale e le faccio sintetizzare a Claude, che prepara la teoria, le domande e la traccia di ogni esercizio.
- Controllo le citazioni sul testo della pagina originale. I comandi, le osservazioni e le risposte «con parole mie» sono scritti da me.
- Ogni esercizio ha teoria, citazioni dalla documentazione ufficiale e le mie risposte con parole mie.
- Ogni risposta «con parole mie» ha una frase di risposta e, quando servono, queste etichette: **Visto** (l'ho controllato io con un comando o aprendo un file), **Dalla pagina** (lo dice una fonte scritta), **Dedotto** (è un mio ragionamento) e **Non provato** (non l'ho verificato).
- Gli esercizi vanno dal più semplice all'avanzato, un concetto nuovo per volta.
- I commit sono in italiano, con tipo e scope in inglese secondo le [Conventional Commits](https://www.conventionalcommits.org/it/v1.0.0/).

## Stato

Ho fatto gli esercizi da 01 a 07 di Docker: immagine e contenitore, come avviarli, vederli e fermarli, porte e volumi, Compose con un servizio, variabili d'ambiente e healthcheck, due servizi con `depends_on`, il `compose.yaml` di Orarium riga per riga, con il diario dei comandi. Il blocco su Docker è finito ([vedi l'indice](docker/README.md)). Il prossimo argomento lo scelgo a parte.
