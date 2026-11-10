# 02 - Avviare, vedere e fermare un contenitore

## L'idea

Nell'esercizio 01 hai visto che un contenitore è un'immagine messa in funzione.
Qui impari i cinque comandi per gestirlo: avviarlo, vederlo, leggere cosa scrive,
fermarlo ed eliminarlo.

| Comando | Cosa fa |
|---|---|
| `docker run` | crea e avvia un nuovo contenitore da un'immagine, scaricandola se serve |
| `docker ps` | elenca i contenitori (di default solo quelli in esecuzione) |
| `docker logs` | mostra i log di un contenitore |
| `docker stop` | ferma un contenitore |
| `docker rm` | elimina uno o più contenitori |

## 1. Avviare: `docker run`

La forma generale è:

`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`

- Il comando crea un nuovo contenitore da un'immagine e lo avvia. Se l'immagine non è
  ancora sul computer, `docker run` la scarica da solo.
- `docker pull` scarica di default da Docker Hub, ma si può indicare a mano un altro
  registro. Se non indichi un tag, Docker usa `:latest`.
- Che `docker run` scarichi dallo stesso registro quando serve è una mia deduzione: la
  pagina di `docker run` dice solo "pulling the image if needed".
- Con `-d` il contenitore parte in background e non occupa il terminale.

Opzioni che useremo:

- `-d` (`--detach`): avvia in background, e il terminale resta libero.
- `--name`: assegna al contenitore un nome a tua scelta.
- `--rm`: elimina il contenitore quando termina, insieme ai suoi volumi anonimi.

## 2. Riconoscere un contenitore

- Se non dai un nome con `--name`, il daemon ne assegna uno casuale, per esempio
  `vibrant_cannon`.
- Con `--name` scegli tu il nome: così è più facile riconoscerlo.

## 3. Vedere i contenitori: `docker ps`

- `docker ps` mostra solo i contenitori in esecuzione.
- `docker ps -a` (`--all`) mostra tutti i contenitori, anche quelli fermati.
- Gli stati possibili di un contenitore sono sette: `created`, `running`, `paused`,
  `restarting`, `exited`, `removing`, `dead`.
- Un contenitore fermato con `docker stop` passa allo stato `exited`.
- Nell'esempio della documentazione un contenitore in esecuzione mostra nella colonna
  STATUS `Up 11 seconds` (e `Up 16 minutes` in un altro esempio).

## 4. Leggere cosa scrive: `docker logs`

- `docker logs` mostra i log presenti al momento in cui lo lanci.
- `docker logs --follow` (`-f`) continua a mostrare le nuove righe man mano che
  arrivano.

## 5. Fermare: `docker stop`

`docker stop` non spegne il contenitore all'istante:

1. il processo principale riceve prima `SIGTERM`, cioè gli viene chiesto di chiudersi;
2. se il contenitore non esce entro il timeout, viene terminato con `SIGKILL`, cioè
   fermato subito.

Il timeout lo stabilisce il daemon: 10 secondi per i contenitori Linux, 30 per quelli
Windows. Si può cambiare con `--stop-timeout` quando il contenitore viene creato.

## 6. Eliminare: `docker rm`

- `docker rm` elimina uno o più contenitori.
- `--force` elimina anche un contenitore in esecuzione, usando `SIGKILL`.

## Esempio di prova

La documentazione ([What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/), scheda CLI) usa questo comando:
`docker run -d -p 8080:80 docker/welcome-to-docker`
e dice che il contenitore "runs a web server that displays a simple website".

Noi useremo la stessa immagine senza `-p`, perché le porte sono l'argomento
dell'esercizio 03, e con un nome scelto da noi:
`docker run -d --name prova-02 docker/welcome-to-docker`


## Analogia: il Task Manager di Windows

- `docker ps` è come l'elenco dei processi: vedi cosa sta girando.
- `docker stop` è come chiudere un programma dalla sua finestra: gli dai il tempo di
  chiudersi da solo.
- `SIGKILL` è come "Termina attività": il programma si ferma subito, senza preavviso.

Dove l'analogia si ferma: la documentazione descrive `SIGTERM` e `SIGKILL` come segnali
inviati al processo del contenitore, non come le funzioni di Windows. Il paragone serve
solo a capire la differenza tra "chiedere di fermarsi" e "forzare".

## Domande aperte (le pagine non le spiegano, le provo)

- Cosa succede se provo a eliminare con `docker rm` un contenitore in esecuzione, senza
  `--force`? La pagina non lo dice.
- Come appare nella colonna STATUS un contenitore fermato? La pagina elenca gli stati ma,
  nella parte letta, non mostra la riga di un contenitore `exited`: lo vedo al passo 5.
- Cosa significano le altre colonne di `docker ps` (COMMAND, CREATED, PORTS)? Nell'esempio
  compaiono ma la pagina non le definisce.

## Dalla documentazione (parole originali)
- `docker run`: "The `docker run` command runs a command in a new container, pulling the image if needed and starting the container."
- `--detach`: "The `--detach` (or `-d`) flag starts a container as a background process that doesn't occupy your terminal window."
- `--name`: "The `--name` flag lets you specify a custom identifier for a container."
- Nome casuale: "If you don't specify a custom name using the `--name` flag, the daemon assigns a randomly generated name, such as `vibrant_cannon`, to the container."
- `--rm`: "Automatically remove the container and its associated anonymous volumes when it exits"; "Docker also removes the anonymous volumes associated with the container when the container is removed."
- `docker pull`: "By default, `docker pull` pulls images from Docker Hub. It is also possible to manually specify the path of a registry to pull from."
- Tag: "If no tag is provided, Docker Engine uses the `:latest` tag as a default."
- Immagine di prova: "This container runs a web server that displays a simple website."
- `docker ps`: "The `docker ps` command only shows running containers by default."
- `--all`: "Show all containers (default shows just running)."
- Stato `running`: "A running container, started by either `docker start` or `docker run`."
- Stato `exited`: "A container which is no longer running. For example, the process inside the container completed or the container was stopped using the `docker stop` command."
- `docker logs`: "The `docker logs` command batch-retrieves logs present at the time of execution."
- `--follow`: "The `docker logs --follow` command will continue streaming the new output from the container's `STDOUT` and `STDERR`."
- `docker stop`: "The main process inside the container will receive `SIGTERM`, and after a grace period, `SIGKILL`."
- `docker stop`, timeout: "If the container does not exit after the timeout elapses, it's forcibly killed with a `SIGKILL` signal."
- `docker stop`, default: "the Daemon determines the default, and is 10 seconds for Linux containers, and 30 seconds for Windows containers."
- `docker rm`: "Remove one or more containers"; `--force`: "Force the removal of a running container (uses SIGKILL)"

## Con parole mie

1. Cosa fa `docker run`? Cosa succede se l'immagine non è sul mio computer?
   Risposta: `docker run` è il comando che prende un'immagine e la avvia, facendola diventare un container vivo. Se l'immagine che gli chiedo non c'è già sul mio computer, Docker non va in errore: si collega da solo a internet, la scarica (da Docker Hub, deduzione mia) e appena ha finito fa partire il container in automatico.

2. A cosa serve l'opzione `-d`? Cosa cambierebbe senza?
   Risposta: permette a docker di runnare il contenitore in background lasciando il terminale libero, senza -d occuperebbe il terminale.

3. Cosa mostra `docker ps`? E cosa aggiunge `-a`?
   Risposta: `docker ps` mostra solo i contenitori attivi, se aggiungiamo `-a` sta per (- all) vengono mostrati tutti i contenitori presenti anche quelli non attivi.

4. A cosa serve `docker logs`? E `-f`?
   Risposta: Mostra i log presenti al momento del lancio, e con l'aggiunta di `-f` continua a mostrarle anche dopo, man mano che vengono aggiunte.

5. Cosa fa `docker stop` prima di fermare davvero un contenitore? E se il contenitore
   non si ferma?
   Risposta: `docker stop` manda prima `SIGTERM`, cioè chiede al programma di chiudersi. Aspetta il timeout (10 secondi per Linux, 30 per Windows). Se il contenitore non si è fermato, gli manda `SIGKILL` e lo ferma subito.

6. Cosa fa `docker rm`? In quale caso serve `--force`?
   Risposta: `docker rm` lo usiamo quando vogliamo eliminare uno o più contenitori, useremo `--force` per poter eliminare anche quello in esecuzione.

7. Perché ha senso dare un nome al contenitore con `--name` invece di usare l'ID?
   Risposta: Il nome lo scelgo io, mentre l'ID lo genera Docker a caso: la pagina di `run` dice che, se non do un nome, il daemon ne assegna uno casuale. Con un nome riconosco il contenitore più facilmente. Questa è una mia deduzione.

8. Il paragone con il Task Manager: dove funziona e dove no?
   Risposta: Funziona per "chiedere" e "forzare": docker stop è chiudere dalla finestra, docker rm --force è "Termina attività". Non funziona per i segnali, che sono cose del contenitore, né per docker ps -a, perché il Task Manager non mostra i programmi chiusi (osservazione mia).

## Esercizio: la traccia

Contenitore di prova: `prova-02`, dall'immagine `docker/welcome-to-docker`.
Non tocco i contenitori di Orarium (`mysql`, `redis`): ogni comando nomina `prova-02`.

### Passo 1: avviare
- Comando: `docker run -d --name prova-02 docker/welcome-to-docker`
- Cosa ho visto: l'immagine non era sul computer, quindi Docker l'ha scaricata (nove livelli, tag `:latest`). Il comando ha stampato l'ID completo del contenitore e mi ha ridato il terminale. Messaggi visti:

```
Unable to find image 'docker/welcome-to-docker:latest' locally
latest: Pulling from docker/welcome-to-docker
...
Status: Downloaded newer image for docker/welcome-to-docker:latest
```

### Passo 2: vedere
- Comando: `docker ps`
- Cosa ho visto: tre contenitori in esecuzione, con stato `Up`.
  - `prova-02`: immagine `docker/welcome-to-docker`, creato 5 minuti fa, `Up 5 minutes`, porta `80/tcp`.
  - I due contenitori di Orarium: `mysql:8.4.13` e `redis:8.2.6`, creati 4 e 7 giorni fa, `Up 3 days (healthy)`.
    - `mysql`: porta `127.0.0.1:3307->3306/tcp`.
    - `redis`: porta `127.0.0.1:6379->6379/tcp`.

### Passo 3: leggere i log
- Comando: `docker logs prova-02`
- Cosa ho visto: 27 righe. Le prime 9 sono dello script `/docker-entrypoint.sh` e finiscono con `Configuration complete; ready for start up`. Poi le righe `[notice]` con `nginx/1.29.0`, `OS: Linux 6.18.33.2-microsoft-standard-WSL2` e 12 righe `start worker process` (dal 30 al 41), tutte alle `23:32:17`.
- Domanda aperta: cosa dice la documentazione di `docker logs`? Perché 12 processi?

### Passo 4: fermare
- Comando: `docker stop prova-02`
- Cosa ho visto: una sola riga, `prova-02`, cioè il nome del contenitore. Non ho misurato quanto tempo ci ha messo a fermarsi.

### Passo 5: dopo lo stop
- Comando: `docker ps`
- Cosa ho visto: due contenitori, `orarium-db-1` e `orarium-redis-1`, entrambi `Up 3 days (healthy)`. `prova-02` non c'è più.
- Comando: `docker ps -a`
- Cosa ho visto: `prova-02` compare con `STATUS` `Exited (0) About a minute ago`, creato 16 minuti fa, colonna `PORTS` vuota. I due contenitori di Orarium sono sempre `Up 3 days (healthy)`.
- Domanda aperta: cosa significa lo `0` in `Exited (0)`?

### Passo 6: cancellare
- Comando: `docker rm prova-02`, poi `docker ps -a`
- Cosa ho visto: `docker rm` risponde con una riga, `prova-02`. Dopo, `docker ps -a` mostra solo `orarium-db-1` e `orarium-redis-1`: `prova-02` non c'è più.

### Passo 7: cancellare un contenitore in esecuzione
- Comandi: `docker run -d --name prova-02 docker/welcome-to-docker`, poi `docker rm prova-02`, poi `docker rm --force prova-02`
- Cosa ho visto:
  - Il nuovo `prova-02` ha un ID diverso dal primo (`c87d8aa8b255` invece di `e68c5d2b825c`), pur avendo lo stesso nome.
  - `docker rm prova-02` su un contenitore in esecuzione dà errore: `cannot remove container "prova-02": container is running: stop the container before removing or force remove`. Dopo l'errore, `docker ps` mostra `prova-02` ancora `Up`.
  - `docker rm --force prova-02` risponde `prova-02`, e `docker ps -a` non lo mostra più.

## Fonti
- [docker container run](https://docs.docker.com/reference/cli/docker/container/run/)
- [docker container ls](https://docs.docker.com/reference/cli/docker/container/ls/)
- [docker container logs](https://docs.docker.com/reference/cli/docker/container/logs/)
- [docker container stop](https://docs.docker.com/reference/cli/docker/container/stop/)
- [docker container rm](https://docs.docker.com/reference/cli/docker/container/rm/)
- [docker image pull](https://docs.docker.com/reference/cli/docker/image/pull/)
- [Running containers](https://docs.docker.com/engine/containers/run/)
- [What is a container?](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)

## Dopo l'esercizio

### Cosa ho fatto
- Passo 1: `docker run -d --name prova-02 docker/welcome-to-docker`
- Passo 2: `docker ps`
- Passo 3: `docker logs prova-02`
- Passo 4: `docker stop prova-02`
- Passo 5: `docker ps` e `docker ps -a`
- Passo 6: `docker rm prova-02`, poi `docker ps -a`
- Passo 7: di nuovo `docker run`, poi `docker rm prova-02` e `docker rm --force prova-02`

### Cosa ho visto
- Passo 1: l'immagine non era sul computer, quindi Docker l'ha scaricata (nove livelli, tag `:latest`). Il comando ha stampato l'ID completo del contenitore e mi ha ridato il terminale.
- Passo 2: tre contenitori `Up`. `prova-02` ha porta `80/tcp`; i due di Orarium hanno porte su `127.0.0.1`, con `mysql` su `3307->3306`.
- Passo 3: 27 righe di log, dello script `/docker-entrypoint.sh` e di nginx (`nginx/1.29.0`), con 12 righe `start worker process`.
- Passo 4: `docker stop` stampa solo il nome del contenitore.
- Passo 5: dopo lo stop, `docker ps` non mostra più `prova-02`; `docker ps -a` lo mostra con `Exited (0) About a minute ago` e porte vuote.
- Passo 6: dopo `docker rm`, `prova-02` non compare nemmeno con `-a`.
- Passo 7: il nuovo `prova-02` ha un ID diverso dal primo. `docker rm` senza `--force` dà errore e il contenitore resta `Up`; con `--force` viene cancellato.

### Cosa ho verificato
- Le immagini di `orarium-db-1` e `orarium-redis-1` in `docker ps` coincidono con quelle del `compose.yaml` (`mysql:8.4.13` e `redis:8.2.6`).
- `docker ps` mostra solo i contenitori in esecuzione: la pagina di `docker container ls` dice, nell'opzione `-a, --all`, `Show all containers (default shows just running)`. L'ho visto anche di persona: `prova-02` fermo compare solo con `docker ps -a`.
- `docker rm --force` rimuove un contenitore in esecuzione usando `SIGKILL`: pagina di `docker container rm`, opzione `-f, --force`. L'ho provato di persona: senza `--force` il comando dà errore e il contenitore resta `Up`, con `--force` viene cancellato.

### Cosa ho dedotto e non ancora verificato
- Il formato `porta del computer -> porta del contenitore` lo ricavo dall'esempio `8080:80` di `-p`; la pagina non lo spiega.
- `prova-02` non ha `->` perché non è collegato a nessuna porta del computer.
- Il `…` nella colonna `COMMAND` di `docker ps` sembra un taglio del testo: l'opzione `--no-trunc` dice `Don't truncate output`, ma la pagina non dice che sia proprio quello.

### Domande aperte
- Cosa significa lo `0` in `Exited (0)`?
- Perché 12 processi nginx?
- Cosa significa `(healthy)`? (esercizio 05)
- Perché `CREATED` e `Up` sono diversi per i contenitori di Orarium?
- Cosa fa l'opzione `-v, --volumes` di `docker rm`? (da vedere quando parliamo di dati)