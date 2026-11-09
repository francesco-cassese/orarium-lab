## Teoria

### L'idea in due righe
Docker fa girare un programma in un ambiente isolato dal resto del tuo computer.
Due parole da non confondere: **immagine** e **contenitore**.

### Immagine = il modello
Un'immagine è un modello in sola lettura, cioè non si modifica. Dentro c'è quello che
serve per far partire un programma: il programma, le librerie e la configurazione.
Per avere una versione diversa si costruisce una nuova immagine, oppure si aggiungono
strati (layer) sopra quelli che già ci sono.

**Analogia (mia, non della documentazione): la classe.**
Una classe come `Ingredient` descrive com'è fatto un oggetto, ma non è un oggetto:
è un modello, e finché non crei un oggetto non succede niente. L'immagine funziona così:
descrive cosa serve al programma, ma da sola non gira.
Dove l'analogia si ferma: una classe contiene codice, un'immagine contiene programma,
librerie e configurazione.

### Contenitore = l'immagine messa in funzione
Un contenitore è un'istanza di un'immagine che si può avviare. È un processo isolato
che ha i suoi file. Ha un'influenza minima sul computer e sugli altri contenitori.
Se ne elimini uno, gli altri non cambiano.
Un contenitore è definito dalla sua immagine e dalle opzioni che gli dai quando lo
crei o lo avvii.

**Analogia (mia, non della documentazione): l'oggetto.**
Con `new Ingredient()` crei un oggetto a partire dalla classe: quell'oggetto gira, ha
il suo stato e può cambiare. Quando lo distruggi, il suo stato sparisce, ma la classe
resta com'è. Il contenitore è lo stesso: nasce da un'immagine, ha il suo stato, e se lo
elimini l'immagine non cambia.
Dove l'analogia si ferma: un oggetto vive dentro un programma; un contenitore è un
processo isolato, con i suoi file.

### Cosa succede ai dati
Se elimini un contenitore, spariscono le modifiche al suo stato che non sono salvate
in un archivio persistente. Come si fa lo vediamo più avanti.

### In breve
| | Immagine | Contenitore |
|---|---|---|
| Cos'è | un modello in sola lettura | un'istanza dell'immagine che si può avviare |
| Modifiche | non si modifica: se ne fa un'altra o si aggiungono strati | può cambiare il suo stato; se lo elimini, le modifiche non salvate spariscono |

## Dalla documentazione (parole originali)
- Da [What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/): "Images are immutable. Once an image is created, it can't be modified."; "You can only make a new image or add changes on top of it."
- Da [What is Docker?](https://docs.docker.com/get-started/docker-overview/): "An image is a read-only template with instructions for creating a Docker container."; "A container is a runnable instance of an image."; "A container is defined by its image as well as any configuration options you provide to it when you create or start it."; "When a container is removed, any changes to its state that aren't stored in persistent storage disappear."
- Da [What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/): "A container is simply an isolated process with all of the files it needs to run."; "Since containers run in isolation, they have minimal influence on the host and other containers."; "Deleting one container won't affect any others."

## Con parole mie
1. Cos'è un'immagine? 
   Risposta: L’immagine è un pacchetto che contiene tutto ciò che serve al mio programma per partire: il programma, le librerie e la configurazione.

2. Cos'è un contenitore? 
   Risposta: Il contenitore è l’immagine in esecuzione: un processo isolato, con tutti i file che gli servono, dove il mio codice sta girando.

3. Perché si dice che un'immagine è "in sola lettura"? Cosa devo fare se voglio una
   versione diversa?
   Risposta: Si dice di sola lettura perchè non va mai cambiata, se ti serve aggiungere o modificare caratteristiche puoi farlo creandone un'altra e aggiungendo strati sopra a quella vecchia.

4. Se elimino un contenitore, cosa succede all'immagine da cui è nato? E alle
   modifiche che il contenitore aveva fatto?
   Risposta: l'immagine rimane intatta, e le modifiche vanno via con il contenitore, è un ambiente isolato, quindi non intacca gli altri container

5. Completa con parole tue: "L'immagine sta al contenitore come ___ sta a ___".
   Poi spiega perché hai scelto proprio quel paragone.
   Risposta: L'immagine sta al contenitore come la Classe sta all'Oggetto. L'immagine definisce la struttura di base ed è fissa (immutabile). Il container è l'istanza viva: ha un suo stato e sta lavorando. L'unica differenza è che due oggetti nel codice condividono la stessa memoria del programma, mentre i container sono scatole isolate il più possibile dal resto del computer.  

## Esercizio: la traccia

### Passo 1: vedere le immagini sul mio computer
- Comando: `docker image ls`
- Cosa ho visto: Otto immagini `catalog-backend`: sette dal registry Azure del corso (tag da `:19` a `:37`) e una locale (`:ud14-local`). Due con la **U** (in uso): `mysql:8.4.13` e `redis:8.2.6`, usate da Orarium, verificato in compose.yaml (vedi passo 2).

### Passo 2: controllare le immagini di Orarium
- Comando: `Select-String -Path ..\orarium\compose.yaml -Pattern "image:"`
- Cosa ho visto: image: mysql:8.4.13 (riga 4) e image: redis:8.2.6 (riga 22) in compose.yaml.
- Cosa ho concluso: Orarium usa `mysql:8.4.13` e `redis:8.2.6`, cioè le due immagini che Docker segna come in uso.

## Dopo l'esercizio

### Cosa ho fatto
- Comandi usati (descritti nel [diario](comandi.md)): `docker image ls`, `Select-String -Path ..\orarium\compose.yaml -Pattern "image:"`

### Cosa ho visto
- Sul mio computer ci sono 10 immagini: 8 `catalog-backend` e 2 in uso (`mysql:8.4.13`, `redis:8.2.6`).
- Le `catalog-backend` hanno lo stesso nome ma tag e ID diversi.

### Cosa ho verificato
- Orarium usa `mysql:8.4.13` (riga 4 di `compose.yaml`) e `redis:8.2.6` (riga 22): verificato leggendo `compose.yaml` con `Select-String`.

### Cosa ho dedotto e non ancora verificato
- Sette `catalog-backend` vengono dal corso Azure, una è locale.

### Domande aperte
- Perché `mysql:8.4.13` ha 1.12GB di `DISK USAGE` e 254MB di `CONTENT SIZE`?

## Fonti
- [What is an image?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-an-image/)
- [What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
- [What is Docker?](https://docs.docker.com/get-started/docker-overview/)