# 01 - Immagine e contenitore

## Teoria

### L'idea in due righe
Docker fa girare un programma in una "stanza" separata dal resto del tuo computer.
Due parole da non confondere: **immagine** e **contenitore**.

### Immagine = il modello
Un'immagine è un modello che non si può modificare. Dentro c'è tutto quello che serve
per far partire un programma: il programma, le librerie e le impostazioni.
Se vuoi una versione diversa non cambi l'immagine: ne crei una nuova, aggiungendo
altri strati sopra.

### Contenitore = il modello in funzione
Un contenitore è un'immagine che sta girando. È un processo isolato: ha i suoi file
e non disturba il resto del computer né gli altri contenitori.
Se ne elimini uno, gli altri continuano a funzionare.

### Un paragone 
L'immagine è la ricetta con gli ingredienti già pronti in una scatola sigillata.
Il contenitore è il piatto che stai cucinando adesso.

### Cosa succede ai dati
Se elimini un contenitore, spariscono le modifiche che aveva fatto, a meno che siano
salvate in un archivio persistente. Come si fa lo vediamo più avanti.

### In breve
| | Immagine | Contenitore |
|---|---|---|
| Cos'è | un modello | il modello in funzione |
| Si modifica? | no, se ne fa un'altra | sì, mentre gira |
| Se lo elimini | il programma non parte più da lì | spariscono le sue modifiche, se non salvate |

## Dalla documentazione (parole originali)
- "An image is a read-only template with instructions for creating a Docker container."
- "A container is a runnable instance of an image."
- "A container is simply an isolated process with all of the files it needs to run."
- "Deleting one container won't affect any others."
- "When a container is removed, any changes to its state that aren't stored in
  persistent storage disappear."

## Con parole mie
1. Cos'è un'immagine? 
   Risposta: L’immagine è un pacchetto che contiene tutto ciò che serve al mio programma per partire: il programma, le librerie e la configurazione.

2. Cos'è un contenitore? 
   Risposta: Il contenitore è l’immagine in esecuzione: un processo isolato, con tutti i file che gli servono, dove il mio codice sta girando.

3. Perché si dice che un'immagine è "in sola lettura"? Cosa devo fare se voglio una
   versione diversa?
   Risposta: Si dice di sola lettura perchè non va mai cambiata, se ti serve aggiungere o modificare caratteristiche puoi farlo creandone un altro e aggiungendo strati sopra a quella vecchia.

4. Se elimino un contenitore, cosa succede all'immagine da cui è nato? E alle
   modifiche che il contenitore aveva fatto?
   Risposta: l'immagine rimane intatta, e le modifiche vanno via con il contenitore, è un ambiente isolato, quindi non intacca gli altri container

5. Completa con parole tue: "L'immagine sta al contenitore come ___ sta a ___".
   Poi spiega perché hai scelto proprio quel paragone.
   Risposta: L'immagine sta al contenitore come la Classe sta all'Oggetto. L'immagine definisce la struttura di base ed è fissa (immutabile). Il container è l'istanza viva: ha una sua memoria e sta lavorando. L'unica differenza è che due oggetti nel codice condividono la stessa memoria del programma, mentre i container sono scatole isolate il più possibile dal resto del computer.  


## Fonti
- [What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)
- [What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
- [What is Docker?](https://docs.docker.com/get-started/docker-overview/)