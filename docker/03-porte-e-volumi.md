# 03 - Porte e volumi

## Teoria

### Porte

**Il punto di partenza.** Dentro un contenitore c'è un programma che ascolta su una porta. In `prova-02` era nginx sulla porta 80: lo abbiamo visto nei log e in `docker ps` (`80/tcp`). Per default quella porta resta dentro: Docker non la collega al tuo computer.

**Pubblicare una porta.** Con `-p` dici a Docker di collegare una porta del tuo computer a una del contenitore. Si scrive `porta del computer : porta del contenitore`, quindi `-p 8080:80` vuol dire "ciò che arriva alla 8080 del computer va alla 80 del contenitore".

**Cosa significa «non pubblicata».** Non vuol dire «chiusa a tutti». Per i contenitori su una rete bridge, la porta non pubblicata è raggiungibile dal computer che ospita Docker e dagli altri contenitori della stessa rete, ma non da fuori del computer e, con la configurazione predefinita, non dai contenitori di altre reti. Pubblicare serve ad aprirla verso l'esterno.

**Aperta a chi?** Se scrivi solo `-p 8080:80`, la porta è accessibile da tutta la rete a cui è collegato il computer: chiunque sul wifi di casa o dell'ufficio può provare a collegarsi. Se scrivi `-p 127.0.0.1:8080:80`, la porta risponde solo a richieste che partono dal tuo computer stesso. Il database di Orarium usa questa seconda forma: in `docker ps` compare `127.0.0.1:3307->3306/tcp`, quindi solo il tuo computer può collegarsi, mentre dagli altri dispositivi della rete no.

**Analogia: il condominio.** Il contenitore è un appartamento e il portiere è Docker. Senza `-p` il portiere non manda nessuno all'appartamento dall'esterno. Con `-p 8080:80` mette un cartello: «chi suona al 8080 va all'appartamento, porta 80». Con `127.0.0.1` il cartello vale solo per chi abita già nel palazzo.
*Limite:* il portiere inoltra e basta, non controlla chi suona: per questo la pagina dice che pubblicare è insicuro di default.

### Volumi

**Cos'è.** Un volume è un archivio di dati che sopravvive ai contenitori, creato e gestito da Docker. Lo crei tu con `docker volume create`, oppure Docker lo crea da solo quando avvii un contenitore con un volume che non esiste ancora. Fisicamente è una cartella sul computer che ospita Docker: quando lo "monti" in un contenitore, quella cartella compare dentro il contenitore, a un percorso che scegli tu.

**Perché serve.** Nell'esercizio 01 abbiamo letto che i dati di un contenitore cancellato spariscono. La pagina dei volumi dice la stessa cosa dal lato opposto: i dati scritti dentro il contenitore stanno in uno strato che viene distrutto con lui, mentre quelli scritti nel volume restano.

**Con nome o anonimo.** Un volume con nome lo scegli tu (`prova-volume`); uno anonimo riceve un nome casuale. Con `-v` si distingue dai campi: `-v nome:/percorso` è con nome, `-v /percorso` è anonimo. Entrambi restano dopo la cancellazione del contenitore, tranne gli anonimi se avvii il contenitore con `--rm`.

**Non si cancella da solo.** Un volume che nessun contenitore usa resta lì: va rimosso a mano con `docker volume rm nome` (uno) o `docker volume prune` (solo gli anonimi non usati; con `--all` anche quelli con nome).

**Cosa succede se monti un volume su una cartella piena.** Dipende dal volume. Se è vuoto, i file della cartella vengono copiati dentro il volume. Se non è vuoto, i file che c'erano nel contenitore vengono nascosti dal montaggio, non cancellati.

**Più contenitori.** Lo stesso volume può essere montato in più contenitori insieme, anche in lettura e scrittura per alcuni e in sola lettura per altri.

**Quando non è la scelta giusta.** Se vuoi vedere e modificare i file dal tuo computer, la pagina consiglia un altro strumento, il bind mount: il volume è gestito da Docker e non pensato per essere aperto da te.

**Analogia: un disco esterno.** Il volume è un disco esterno che colleghi al contenitore. Se il contenitore viene buttato via, il disco resta; puoi collegarlo a un altro. Questa è l'analogia che usa anche la pagina, con una chiavetta USB.
*Limite:* il disco non sa cosa contiene. Se lo colleghi a una cartella già piena e il disco non è vuoto, i file della cartella spariscono dalla vista finché lo scolleghi, e nei contenitori non c'è un modo semplice di scollegarlo: si ricrea il contenitore senza il montaggio.

**`-v` o `--mount`.** Fanno la stessa cosa. `-v nome:/percorso` è più corto; `--mount type=volume,src=nome,dst=/percorso` è più esplicito, ed è quello che la pagina preferisce. Per lo studio useremo `-v` perché è più breve, ma la pagina consiglia `--mount`.

## Dalla documentazione (parole originali)

### Porte

Pagina: [Port publishing and mapping](https://docs.docker.com/engine/network/port-publishing/)

- Sezione introduttiva: "By default, for both IPv4 and IPv6, the Docker daemon blocks access to ports that have not been published."
- Sezione "Publishing ports": "When you create or run a container using docker create or docker run, all ports of containers on bridge networks are accessible from the Docker host and other containers connected to the same network. Ports are not accessible from outside the host or, with the default configuration, from containers in other networks."
- Sezione "Publishing ports", tabella: "-p 8080:80 — Map port 8080 on the Docker host to TCP port 80 in the container."
- Sezione "Publishing ports": "Publishing container ports is insecure by default. Meaning, when you publish a container's ports it becomes available not only to the Docker host, but to the outside world as well."
- Sezione "Publishing ports": "If you include the localhost IP address (127.0.0.1, or ::1) with the publish flag, only the Docker host can access the published container port."
- Sezione "Setting the default bind address for containers": "By default, when a container's ports are mapped without any specific host address, the Docker daemon publishes ports to all host addresses (0.0.0.0 and [::])."

### Volumi

Pagina: [Volumes](https://docs.docker.com/engine/storage/volumes/)

- Introduzione: "Volumes are persistent data stores for containers, created and managed by Docker. You can create a volume explicitly using the docker volume create command, or Docker can create a volume during container or service creation."
- Sezione "When to use volumes": "Volumes are not a good choice if you need to access the files from the host, as the volume is completely managed by Docker. Use bind mounts if you need to access files or directories from both containers and the host."
- Sezione "A volume's lifecycle": "A volume's contents exist outside the lifecycle of a given container. When a container is destroyed, the writable layer is destroyed with it. Using a volume ensures that the data is persisted even if the container using it is removed."
- Sezione "A volume's lifecycle": "A given volume can be mounted into multiple containers simultaneously. When no running container is using a volume, the volume is still available to Docker and isn't removed automatically."
- Sezione "Mounting a volume over existing data": "If you mount a non-empty volume into a directory in the container in which files or directories exist, the pre-existing files are obscured by the mount."
- Sezione "Named and anonymous volumes": "Just like named volumes, anonymous volumes persist even if you remove the container that uses them, except if you use the --rm flag when creating the container, in which case the anonymous volume associated with the container is destroyed."
- Sezione "Options for --volume": "docker run -v [<volume-name>:]<mount-path>[:opts]"

Pagina: [docker volume prune](https://docs.docker.com/reference/cli/docker/volume/prune/)

- Sezione "Description": "Remove all unused local volumes. Unused local volumes are those which are not referenced by any containers. By default, it only removes anonymous volumes."
- Sezione "Filtering (--all, -a)": "Use the --all flag to prune both unused anonymous and named volumes."

## Con parole mie

1. Cosa vuol dire che una porta di un contenitore «non è pubblicata»? Chi può raggiungerla e chi no?

**Risposta:** Una porta non pubblicata può essere raggiunta solo dal computer che ospita Docker e dagli altri contenitori collegati alla stessa rete di Docker, non dagli altri computer della rete di casa. Quindi dall'esterno non è raggiungibile.

2. Che differenza c'è tra `-p 8080:80` e `-p 127.0.0.1:8080:80`? Chi può collegarsi nei due casi?

**Risposta:** Nel primo caso stiamo dicendo che chiunque sulla rete di casa o dell'ufficio può collegarsi alla porta `8080`, e la richiesta viene inoltrata alla porta `80` del container. Nel secondo caso gli stiamo dicendo che solo il mio computer può collegarsi, usando l'indirizzo `127.0.0.1`.

3. Nel `docker ps` di Orarium compare `127.0.0.1:3307->3306/tcp`. Cosa significano `3307`, `3306`, `->` e `/tcp`?

**Risposta:** `127.0.0.1` dice che la porta è pubblicata solo sul mio computer. `3307` è la porta del mio computer, quella a cui mi collego io. `3306` è la porta del contenitore, dove ascolta il database. Credo che la freccia `->` indichi la direzione: quello che arriva alla 3307 del mio computer viene inoltrato alla 3306 del contenitore. `/tcp` è il protocollo usato dalla porta.

4. Cosa succede ai dati scritti dentro un contenitore quando lo cancelli? E a quelli scritti in un volume?

**Risposta:** Quando cancello un contenitore, cancello anche i dati che ho scritto dentro di lui. Quelli scritti in un volume invece restano, perché il volume è separato dal contenitore e continua a esistere anche dopo la sua cancellazione.

5. Qual è la differenza tra un volume con nome e uno anonimo? Cosa cambia se avvii il contenitore con `--rm`?

**Risposta:** Il volume con nome lo scelgo io, per esempio `prova-volume`. Quello anonimo riceve un nome casuale da Docker. Con `--rm`, quando il contenitore viene cancellato alla fine, cancella anche i volumi anonimi, mentre quelli con nome restano.

6. Cosa succede se monti un volume vuoto su una cartella piena del contenitore? E se il volume non è vuoto?

**Risposta:** Se il volume è vuoto, i file della cartella del contenitore vengono copiati dentro il volume. Se il volume non è vuoto, i file che c'erano nel contenitore vengono nascosti dal montaggio, ma non cancellati.

7. Perché in un progetto come Orarium non usiamo `docker volume prune`?

**Cosa dice la pagina:** `docker volume prune` rimuove i volumi non referenziati da nessun contenitore. Di default cancella solo quelli anonimi; per cancellare anche quelli con nome serve `--all`.

**Cosa deduco io:** un volume anonimo di un contenitore non più in uso verrebbe cancellato. Nel `compose.yaml` di Orarium il database usa `mysql_data:/var/lib/mysql`, un volume con nome, quindi `prune` semplice non lo tocca, ma `prune --all` sì, se nessun contenitore lo usa. Per questo non conviene usare `--all` a cuor leggero.

## Esercizio: la traccia

Tutti i nomi di contenitori e volumi creati qui cominciano per `prova-`. Non si toccano `orarium-db-1`, `orarium-redis-1` né i volumi di Orarium, e non si usa mai `docker volume prune`.

### Passo 1: guardare se Orarium usa volumi
- Comando: `Select-String -Path ..\orarium\compose.yaml -Pattern "volumes"`
- Cosa guardare: se compare la parola `volumes` e su quali righe. È solo una lettura del file.
- Cosa ho visto: nel `compose.yaml` la parola `volumes` compare tre volte. Il database usa `mysql_data:/var/lib/mysql` e `./docker/mysql/init:/docker-entrypoint-initdb.d:ro` (righe 12-14); Redis usa `redis_data:/data` (righe 25-26); in fondo, alle righe 33-35, trovo `mysql_data` e `redis_data` dichiarati.
- Domanda aperta: perché `mysql_data` è solo un nome, mentre `./docker/mysql/init` è un percorso?

### Passo 2: elencare i volumi che esistono
- Comando: `docker volume ls`
- Cosa guardare: i nomi dei volumi che ci sono già. Non toccarli.
- Cosa ho visto: ci sono 4 volumi, tutti di tipo `local`. Due hanno nomi lunghi 64 caratteri esadecimali: sembrano anonimi, visto il nome casuale, ma non so di chi siano. Gli altri due sono `orarium_mysql_data` e `orarium_redis_data`: hanno gli stessi nomi del `compose.yaml` con il prefisso `orarium_`, e non so perché.
- Domanda aperta: da dove viene il prefisso `orarium_`? (risposta nell'esercizio 04, vedi «Cosa ho verificato»)

### Passo 3: creare un volume di prova
- Comando: `docker volume create prova-volume`
- Cosa guardare: cosa stampa il comando.
- Cosa ho visto: il comando stampa solo il nome del volume, `prova-volume`.

### Passo 4: ispezionare il volume
- Comando: `docker volume inspect prova-volume`
- Cosa guardare: i campi `Driver`, `Mountpoint`, `Name`, `Scope`.
- Cosa ho visto: `inspect` mi mostra un solo volume, `prova-volume`, di tipo `local` e con scope `local`. Il `Mountpoint` è `/var/lib/docker/volumes/prova-volume/_data`, un percorso Linux. Ci sono anche `CreatedAt` (in UTC), mentre `Labels` e `Options` sono `null`.

### Passo 5: scrivere un file nel volume
- Comando: `docker run --rm -v prova-volume:/dati alpine sh -c "echo ciao > /dati/nota.txt"`
- Cosa guardare: se il comando stampa qualcosa. Alla fine il contenitore si cancella da solo (`--rm`). Se è la prima volta, Docker scarica l'immagine `alpine`.
- Cosa ho visto: l'immagine `alpine:latest` non era sul computer, quindi Docker l'ha scaricata (messaggi `Unable to find image … locally` e `Status: Downloaded newer image for alpine:latest`). Il comando in sé non ha stampato altro e non ha dato errori; il contenitore si è cancellato da solo (`--rm`). Non ho ancora controllato se il file è stato scritto.

### Passo 6: rileggere il file con un contenitore nuovo
- Comando: `docker run --rm -v prova-volume:/dati alpine cat /dati/nota.txt`
- Cosa guardare: cosa stampa. È un contenitore diverso da quello del passo 5.
- Cosa ho visto: il comando ha stampato `ciao`, cioè il contenuto del file scritto al passo 5 da un altro contenitore, già cancellato (`--rm`). Questa volta Docker non ha scaricato niente, perché l'immagine `alpine` era già sul computer.

### Passo 7: avviare un contenitore con una porta pubblicata
- Comando: `docker run -d --name prova-web -p 127.0.0.1:8080:80 docker/welcome-to-docker`
- Cosa guardare: l'ID che stampa.
- Cosa ho visto: il comando ha stampato l'ID completo del contenitore (comincia con `f819788cd363`). Nessuno scaricamento, perché l'immagine c'era già, e nessun errore sulla porta 8080.

### Passo 8: vedere la porta in `docker ps`
- Comando: `docker ps`
- Cosa guardare: la colonna `PORTS` di `prova-web`, e confrontala con quella di `orarium-db-1`.
- Cosa ho visto: `prova-web` ha `PORTS` `127.0.0.1:8080->80/tcp`, cioè quello che ho scritto in `-p`. I contenitori di Orarium non compaiono in `docker ps`. Con `docker ps -a` risultano `Exited (255) 13 minutes ago`, con gli stessi ID di prima; la colonna `PORTS` però è ancora piena (`orarium-db-1` mostra anche `33060/tcp`, senza freccia).

### Passo 9: aprire la porta nel browser
- Azione (non è un comando): apri `http://127.0.0.1:8080` nel browser.
- Cosa guardare: se la pagina risponde.
- Cosa ho visto: la pagina di benvenuto di Docker, con «Congratulations!!! You ran your first container.» e dei coriandoli. La porta pubblicata risponde dal mio computer, all'indirizzo `127.0.0.1:8080`. Non ho provato da un altro dispositivo.

![Pagina di benvenuto di Docker su 127.0.0.1:8080](img/congratulations.png)

### Passo 10: ispezionare le porte
- Comando: `docker container inspect prova-web --format "{{json .NetworkSettings.Ports}}"`
- Cosa guardare: i campi `HostIp` e `HostPort`, e confrontali con il `docker ps` del passo 8.
- Cosa ho visto: `{"80/tcp":[{"HostIp":"127.0.0.1","HostPort":"8080"}]}`. `HostIp` e `HostPort` coincidono con quello che ho scritto in `-p` e con il `docker ps` del passo 8. Nell'esempio della pagina, senza indirizzo, `HostIp` è `0.0.0.0`; con il mio `-p` l'ho visto solo nel caso `127.0.0.1`.

### Passo 11: cancellare il contenitore di prova
- Comando: `docker rm --force prova-web`
- Cosa guardare: cosa stampa.
- Cosa ho visto: il comando stampa il nome del contenitore, `prova-web`, e lo cancella anche se è in esecuzione (come con `prova-02` nell'esercizio 02).

### Passo 12: controllare che il volume sia ancora lì
- Comando: `docker volume ls`
- Cosa guardare: se `prova-volume` compare ancora, ora che i contenitori che lo hanno usato non esistono più.
- Cosa ho visto: `prova-volume` compare ancora, insieme ai quattro che c'erano già (i due con nome lungo, `orarium_mysql_data` e `orarium_redis_data`). I due contenitori che lo avevano montato (passi 5 e 6, con `--rm`) non esistono più.

### Passo 13: cancellare il volume di prova
- Comando: `docker volume rm prova-volume`
- Cosa guardare: cosa stampa. Poi rilancia `docker volume ls` per controllare che sia sparito.
- Cosa ho visto: `docker volume rm` stampa il nome del volume. Dopo, `docker volume ls` mostra solo i quattro volumi che c'erano già.

## Dopo l'esercizio

### Cosa ho fatto
Tredici passi con `prova-volume`, `prova-web` e due contenitori usa e getta con `alpine`: guardare i volumi di Orarium (`compose.yaml`, `docker volume ls`), creare e ispezionare un volume, scrivere e rileggere un file con due contenitori diversi, pubblicare una porta, vederla in `docker ps`, nel browser e con `docker container inspect`, e cancellare contenitore e volume di prova.

### Cosa ho visto
- Un file scritto in un volume resta dopo che il contenitore che l'ha scritto è stato cancellato.
- Il volume non è stato cancellato insieme ai contenitori, ma solo con `docker volume rm`.
- `-p 127.0.0.1:8080:80` compare uguale in `docker ps` (`127.0.0.1:8080->80/tcp`) e in `docker container inspect` (`HostIp`, `HostPort`), e la porta risponde dal mio computer.
- Orarium ha due volumi con nome nel `compose.yaml` e sul computer ce ne sono altri due con nome lungo, forse anonimi.
- I contenitori di Orarium risultavano `Exited (255)`; non so ancora la causa.

### Cosa ho verificato
- Ho visto che un dato scritto in un volume resta anche dopo la cancellazione del contenitore (passi 5-6).
- La porta pubblicata risponde dal mio computer (passo 9).
- Il formato `127.0.0.1:8080->80/tcp` corrisponde a quello che scrivo in `-p` (passi 8 e 10).
- Il `compose.yaml` dichiara per il database un volume con nome, `mysql_data` (passo 1), ed esiste un volume `orarium_mysql_data` (passo 2). Non ho verificato che il contenitore usi proprio quello: lo si vedrebbe con `docker inspect` sul contenitore, sezione `Mounts` (come nella pagina dei volumi).
- `:ro` alla fine di una riga di `volumes` vuol dire sola lettura: è l'opzione `readonly, ro` della pagina dei volumi (sezione «Options for --volume»).
- `sh -c` e `cat` funzionano in `alpine`.
- Il prefisso `orarium_` dei volumi è il nome del progetto Compose, che di default è il nome della cartella: per Orarium `docker compose ls` mostra il progetto `orarium` (esercizio 04, passo 1), e un volume nuovo si chiama `<progetto>_<nome>`, per esempio `prova-compose_dati` (esercizio 04, passo 10). La pagina «Specify a project name» non dice che il nome vada davanti ai volumi: lo so dalla prova.

### Cosa ho dedotto e non ancora verificato
- Penso che dagli altri dispositivi la porta non risponda, ma non l'ho provato.
- Penso che «not referenced by any containers» comprenda anche i contenitori fermi, ma la pagina non lo dice esplicitamente.
- Penso che il `Mountpoint` stia dentro la macchina virtuale di Docker.
- Penso che i due volumi con nome lungo siano anonimi, ma non so di chi siano.
- Penso che `./docker/mysql/init:/docker-entrypoint-initdb.d:ro` nel `compose.yaml` sia un bind mount.
- Penso che con `-p 8080:80`, senza indirizzo, la porta sia raggiungibile dagli altri dispositivi della rete: la pagina dice «the outside world», ma non ho provato.

### Domande aperte
- Cosa vuol dire `Exited (255)`, a differenza di `Exited (0)`?
- Perché `PORTS` è vuota per un contenitore fermato con `docker stop`, ma piena per i contenitori di Orarium, che risultano fermi ma hanno ancora le porte?
- A cosa serve la porta `33060/tcp`? Nel passo 8 l'avevo vista con `docker ps -a`, quando `orarium-db-1` era `Exited`. Ora che il contenitore è in esecuzione, `docker ps -a` mostra solo `127.0.0.1:3307->3306/tcp`, e `33060/tcp` non compare più. Non so ancora perché.
- La mia versione di Docker è precedente alla 28.0.0? (si vede con `docker version`)

### Applicazione in Orarium

- [PR #87](https://github.com/francesco-cassese/orarium/pull/87), `docs(backend): explain where the data lives and the prune risk`: ho aggiunto al `backend/README.md` dove stanno i dati del database e di Redis (i volumi `mysql_data` e `redis_data`) e un avviso sul rischio di `docker volume prune --all`.
- Prima di scriverla ho riavviato i servizi con `docker compose up -d`, e `php artisan migrate:status` mostrava le quattro migrazioni `Ran`: i dati erano rimasti nel volume.

## Fonti

- [Port publishing and mapping](https://docs.docker.com/engine/network/port-publishing/)
- [Volumes](https://docs.docker.com/engine/storage/volumes/)
- [docker volume prune](https://docs.docker.com/reference/cli/docker/volume/prune/)
