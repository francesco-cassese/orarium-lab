# 07 - Il `compose.yaml` di Orarium, riga per riga

## Con parole mie

1. Cosa vuol dire `services:` e cosa rappresenta `db`?

**Risposta:**

- `services:` è la lista dei servizi del progetto. Ogni servizio è un pezzo dell'app che Compose fa partire nel suo contenitore.
- In Orarium i servizi sono due: `db` e `redis`.
- `db` è il nome che uso per il database MySQL. Il comando `docker compose exec db mysql` del README del backend lo usa, quindi il nome conta per i comandi. Non è il nome del contenitore.
- `db` c'è già nel primo commit del file (`c62d9d0`, PR #14), con `image: mysql:8.4.13`. Quindi il nome non è stato cambiato dopo. Chi l'ha scelto non si capisce dal commit: non lo so.
- La pagina dice che `services` è una mappa: le chiavi sono i nomi dei servizi, e i valori sono le loro impostazioni. `db` è una di queste chiavi.

2. Perché il tag è `mysql:8.4.13` e non `mysql:latest` o `mysql:8.4`?

**Risposta:**

- `latest` cambia quando esce una versione nuova, e non mi avvisa.
- `8.4.13` è sempre la stessa versione.
- D-004 (in `docs/DECISIONS.md`) vuole un ambiente uguale sul mio pc e in CI. Per questo scarta i tag generici come `redis:8` e `redis:latest`, perché la versione cambia nel tempo (riga 76).
- Per `mysql:8.4` la pagina Docker Hub di MySQL, copiata il 16 novembre 2026, mette `8.4.13` e `8.4` nello stesso gruppo. Cosa succede quando esce la 8.4.14 non lo dice la pagina, e non l'ho provato.
- Nella stessa pagina il primo gruppo di tag inizia con `26.10.0`, `26.10`, `26`, `innovation`, `latest`. Quindi al momento della copia `latest` era una versione 26, non la serie 8.4. Non ho fatto nessun pull.
- Con `latest` la pagina dice che il tag viene sempre riscaricato (voce `pull_policy`). Quindi, se esce una versione nuova, la ritrovo senza cambiare il file. Non l'ho provato.
- La pagina da sola non spiega perché usare un tag fisso. Il motivo lo prendo da D-004.

3. Cosa dice il commento della riga 3, e perché i due tag vanno aggiornati insieme?

**Risposta:**

- Il commento dice: «Stesso tag di `.github/workflows/backend.yml`: aggiornali insieme (D-004, D-010)».
- Ho aperto `backend.yml` alla riga 26: c'è `image: mysql:8.4.13`, come nel mio `compose.yaml`.
- D-010 dice che i test girano su MySQL perché deve essere lo stesso motore di sviluppo e produzione. Un test verde sul mio pc può diventare rosso in CI. D-010 però non dice di tenere uguali i due tag: quel legame lo leggo nel commento.
- Se cambio il tag in un file solo, il database del mio pc e quello della CI non sono più uguali. Un test può passare in uno e fallire nell'altro.
- Questa è una mia deduzione dal commento e dalle decisioni. Non ho provato un caso reale.

4. Cosa succede la prima volta che avvio Orarium e `mysql:8.4.13` non è ancora sul mio computer?

**Risposta:**

- La pagina dice che, se l'immagine non c'è, Compose prova a scaricarla secondo il `pull_policy`.
- Con la policy `missing` scarica solo se l'immagine non è già sul computer.
- Il valore predefinito è `missing` se non uso `build`. Orarium non usa `build`, quindi per `mysql:8.4.13` vale `missing`.
- Un caso simile c'è nell'esercizio 03, passo 5: `docker run ... alpine` ha scaricato `alpine:latest`. Ma era `docker run`, non Compose: è solo un'analogia.
- Per `mysql:8.4.13` non ho provato il pull. Con `docker image ls mysql` vedo che l'immagine è già sul mio pc (creata 2 settimane fa, 1.12GB). Non serve scaricarla.

5. Nella riga `"127.0.0.1:3307:3306"`, quale pezzo è l'IP dell'host, quale la porta dell'host e quale la porta del contenitore? Cosa cambierebbe senza `127.0.0.1`?

**Risposta:**

- **`127.0.0.1`** è l'IP. Dice che la porta è aperta solo sul mio pc. Si può anche non scrivere.
- **`3307`** è la porta del mio pc: è quella a cui mi collego io.
- **`3306`** è la porta del contenitore, dove ascolta MySQL.
- **Senza `127.0.0.1`** (cioè `"3307:3306"`), la porta non resta solo sul mio pc. La pagina dice che Docker la apre su tutte le interfacce (`0.0.0.0`). Quindi altri dispositivi della rete, o internet se il pc ha un IP pubblico, potrebbero arrivarci.
- Non l'ho provato: so solo quello che dice la pagina. Nel mio `docker ps` vedo solo `127.0.0.1:3307->3306/tcp` (esercizio 02, passo 2, ed esercizio 03).

6. Perché la riga è tra virgolette?

**Risposta:**

- La pagina dice che `HOST:CONTAINER` va sempre scritto tra virgolette, per evitare conflitti con i numeri in base 60 di YAML.
- Non spiega il caso. Per `3307:3306` non so se succederebbe, e non l'ho provato.

7. Perché fuori è `3307` e dentro `3306`?

**Risposta:**

- **`3306`** dentro è la porta standard di MySQL. Il contenitore la usa così, e non la cambio. Nel 05, con `docker image inspect`, ho visto che l'immagine dichiara `3306/tcp`.
- **`3307`** fuori la scelgo io. D-004 la sceglie per evitare conflitti con un MySQL già installato sul pc, che userebbe la `3306`.
- **`127.0.0.1`**: D-004 dice che la porta è legata a `127.0.0.1`, quindi non si raggiunge dalla rete di casa.
- Il conflitto con un MySQL installato non l'ho provato: lo so da D-004. Il `backend/README.md` (riga 122) usa `3307` per il client, quindi è lo stesso valore.

8. Le quattro variabili `MYSQL_*`: da dove prende i valori Compose, e cosa succede se mancano?

**Risposta:**

- Le variabili sono `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER` e `MYSQL_PASSWORD`. Nel `compose.yaml` si scrivono come `${NOME}`.
- Compose prende i valori dal file `.env`, nella cartella del progetto. Il `.env` non va su Git: lo dice D-004, e lo conferma il `.gitignore` (verificato con `Select-String`, righe 8 e 9).
- Il `.env.example` ha vuote `MYSQL_ROOT_PASSWORD` e `MYSQL_PASSWORD`. `MYSQL_DATABASE` e `MYSQL_USER` hanno `orarium` (verificato con `Select-String`).
- Se una variabile manca, nell'esercizio 05 (passo 5) Compose ha stampato un avviso e ha usato una stringa vuota. Quindi per `db` il valore arriverebbe vuoto.
- La pagina Docker Hub di MySQL dice che `MYSQL_ROOT_PASSWORD` è obbligatoria (citazione sotto), ma non dice cosa succede con un valore vuoto. Non l'ho provato.
- La stessa pagina dice che, se la cartella dati ha già un database, le `MYSQL_*` non hanno effetto. Quindi con il volume `mysql_data` già pieno, cambiare il `.env` non cambia il database. Non l'ho provato.
- Nell'esercizio 05 (passo 6) una variabile della shell ha vinto sul `.env`. Qui non è successo, ma è da ricordare.

9. Nella riga `mysql_data:/var/lib/mysql`: cosa è `mysql_data`, cosa è `/var/lib/mysql`, e dove è dichiarato `mysql_data` nel file? Cosa succede ai dati con `docker compose down`? (Esercizio 03 e PR #87.)

**Risposta:**

- `mysql_data` è il nome del volume: lo spazio, gestito da Docker, dove stanno i dati del database. La pagina dei servizi lo chiama «VOLUME» (citazione sotto).
- `/var/lib/mysql` è la cartella dentro il contenitore dove MySQL salva i suoi file. La pagina la chiama «CONTAINER_PATH» (citazione sotto). Il volume viene collegato lì: quello che MySQL scrive finisce nel volume.
- Il volume è dichiarato in fondo al file, nel blocco `volumes:` (righe 33–35).
- Con `docker compose down` i dati restano. Nel 04, passo 11, il volume è rimasto. Nel 03 (parte sulla PR #87) c'è la nota su dove stanno i dati, e dopo `up -d` le migrazioni erano ancora `Ran`. Il `backend/README.md` (riga 102) dice che `down` lascia i dati.
- Provato: `down` senza `-v` su un progetto di prova (04, passo 11). Non provato: `down` sul progetto Orarium.
- Con `down -v` il volume viene cancellato, e con lui i dati. Il `backend/README.md` (riga 103) lo dice. L'ho provato solo su un progetto di prova, `altro` (04, passo 13).
- Non ho lanciato nessun `down -v` su Orarium, e non lo farò.
- Collegamento con la domanda 8: con il volume già pieno, cambiare `MYSQL_*` non cambia il database. Non l'ho provato.

10. Nella riga `./docker/mysql/init:/docker-entrypoint-initdb.d:ro`: quali sono i tre pezzi, che tipo di montaggio è, e cosa fa `:ro`? Cosa c'è nella cartella `docker/mysql/init`?

**Risposta:**

- I tre pezzi sono: `./docker/mysql/init` (la cartella sul mio pc), `/docker-entrypoint-initdb.d` (la cartella dentro il contenitore dove MySQL cerca gli script), `ro` (sola lettura).
- È un bind mount: una cartella del mio pc collegata al contenitore. Non è un volume con nome, perché il percorso inizia con `./`. La pagina dice che i percorsi relativi devono iniziare con `.` o `..`, per non confonderli con i volumi con nome (citazione sotto).
- `:ro` vuol dire che il contenitore può leggere la cartella ma non scriverci. Lo dice la pagina dei servizi (citazione sotto).
- Nella cartella c'è `01-test-database.sh`. Il nome compare nel commento di `.env.example` (riga 7). Il commento dello script (righe 2–3) dice che crea il database di test `orarium_test` e dà i permessi all'utente dell'app. `orarium_test` deve essere uguale a `DB_DATABASE` in `backend/phpunit.xml` (verificato con `Select-String`, riga 29).
- Lo script parte alla prima partenza del contenitore, in ordine alfabetico (pagina Docker Hub). Il prefisso `01-` fa sì che parta per primo: questa è la mia idea. Il commento dello script e `backend/README.md` (riga 32) dicono invece «quando il volume è nuovo». Un contenitore nuovo con un volume già pieno: la pagina non lo dice, e non l'ho provato. È una domanda aperta.
- La pagina dice che i file `.sh` senza il bit di esecuzione vengono letti con `source` invece di essere eseguiti. Non so se `01-test-database.sh` ha quel bit: non l'ho controllato.

11. Cosa fa `CMD-SHELL` rispetto a `CMD`, e perché qui serve? Cosa fa `$$` davanti a `MYSQL_ROOT_PASSWORD`?

**Risposta:**

- `CMD-SHELL` è il primo elemento della lista `test`, come dice la pagina. Il comando parte dalla shell del contenitore (`/bin/sh` su Linux).
- Con `CMD` il programma parte direttamente, senza shell. Questa è una mia deduzione: la pagina dei servizi non lo dice.
- Il mio comando legge una variabile (`$MYSQL_ROOT_PASSWORD`). Per leggerla serve una shell, quindi uso `CMD-SHELL`. È una mia lettura, non una prova.
- **`$$`**: la pagina Interpolation dice che `$$` serve per avere un dollaro letterale, e che Compose non sostituisce il valore (citazione sotto).
- Nel `docker inspect` del `db` il test contiene `-p$MYSQL_ROOT_PASSWORD`, con un dollaro solo. Quindi Compose ha tolto un `$` prima di passare il comando al contenitore. È coerente con la pagina Interpolation (esercizio 05).
- Il valore della password non si vede: resta il nome della variabile. Lo sostituisce la shell del contenitore. In questo output non lo vedo: è una deduzione, non una prova.

12. Pezzo per pezzo, cosa fa `mysqladmin ping -h 127.0.0.1 -uroot -p$$MYSQL_ROOT_PASSWORD --silent`?

**Risposta:**

- `mysqladmin` è lo strumento con cui MySQL si amministra. `ping` controlla se il server è acceso (citazioni sotto).
- `-h 127.0.0.1` dice a quale indirizzo collegarsi.
- Domanda aperta: perché `127.0.0.1` e non `localhost`? Non lo so. La pagina dice che il valore predefinito di `--host` è `localhost`, e che `--socket` serve per le connessioni a localhost. Quindi con `localhost` il client userebbe il file socket, con `127.0.0.1` una connessione TCP. Non è detto che sia il motivo di Orarium.
- `-uroot` è l'utente con cui mi collego.
- `-p$MYSQL_ROOT_PASSWORD` è la password. Come nella domanda 11, il valore lo mette la shell del contenitore: non lo vedo.
- `--silent` esce senza messaggi solo se la connessione non riesce (citazione sotto). Se la connessione riesce, `mysqld is alive` compare lo stesso: è quello che ho visto nel log del 05. È una mia deduzione dalla frase.
- `-p` e la password devono stare attaccati, senza spazio: lo dice la pagina. L'avviso «insecure» del log del 05 è quello che la pagina scrive sulla password nella riga di comando.
- Il controllo passa se il comando esce con codice 0 (citazione Dockerfile reference sotto).
- `ping` risponde a «il server è acceso?», non a «la password è giusta?». La pagina dice che con una password sbagliata il comando esce comunque con 0. Quindi che Docker segni `healthy` in quel caso è una mia deduzione: non l'ho provato.

13. Cosa significano `interval: 10s`, `timeout: 5s` e `retries: 10`, e dopo quanto tempo, in caso di fallimento continuo, il `db` diventa `unhealthy`? (Riprendi dal 05.)

**Risposta:**

- Nel `docker inspect` del `db` i tempi sono in nanosecondi. `Interval` vale `10000000000`, cioè 10 secondi. `Timeout` vale `5000000000`, cioè 5 secondi. `Retries` vale 10.
- `interval` è il tempo tra un controllo e il successivo. `timeout` è il tempo massimo di un controllo: se lo supera, il controllo è fallito. `retries` è quanti fallimenti di fila servono.
- Con 10 fallimenti di fila il `db` diventa `unhealthy`. Il `backend/README.md` (riga 100) dice lo stesso: 10 controlli falliti di fila, uno ogni 10 secondi.
- Stima, non provata: 10 controlli da 10 secondi fanno circa 100 secondi, più i timeout. Per il `db` non l'ho misurata.
- Altre misure: 17 secondi con `retries: 3` e `interval: 5s` (Redis di prova, 05 passo 13); 35 secondi con `retries: 10` e `interval: 3s` (06 passo 11).
- `StartPeriod` non c'è: nel `compose.yaml` non c'è `start_period`.
- Domanda aperta: cosa cambia senza `start_period` nei primi secondi di MySQL? Non l'ho provato.

14. Cosa c'è in `redis` uguale a `db`, e cosa è diverso (rispetto a `ports`, `environment`, `volumes`)? Perché `redis:8.2.6`? (D-004, riga 77.)

**Risposta:**

- **Uguale a `db`:** hanno `image`, `ports` su `127.0.0.1`, `volumes` con un volume con nome, e un `healthcheck`. L'ho letto nel `compose.yaml`.
- **Diverso:** `redis` non ha `environment`. Ha un solo volume (`redis_data:/data`), mentre `db` ne ha due. La porta è `6379`. Il `healthcheck` usa `CMD`, non `CMD-SHELL`.
- **Perché `redis:8.2.6`:** D-004 (riga 76) scarta i tag generici come `redis:8` e `redis:latest`, perché la versione cambia nel tempo. La riga 77 sceglie `redis:8.2.6`, «come già fatto per MySQL».
- **Sicurezza:** la pagina Docker Hub di Redis dice che la «Protected mode» è spenta di default, e che se la porta esce dal pc è aperta senza password. Quindi nel mio file la porta deve restare su `127.0.0.1` (collegato alla domanda 5). È una mia lettura, non una prova.
- Domanda aperta: `redis:8.2.6` è disponibile oggi (prova con `docker buildx imagetools inspect`, 16 novembre 2026). Non è nell'elenco dei tag di oggi, dove la serie 8.2 mostra `8.2.11`. Non so cosa cambia tra le due versioni. Se aggiornare, lo valuto in «Applicazione in Orarium».
- Non provato: `redis:8` e `redis:latest` nel mio ambiente.

15. Nella riga `redis_data:/data`: a cosa serve `/data` nell'immagine Redis?

**Risposta:**

- La pagina Docker Hub di Redis dice che, con la persistenza attiva, i dati stanno in `VOLUME /data` (citazione sotto).
- Quindi `/data` è la cartella dove Redis salva i dati, se la persistenza è attiva. Nel mio `compose.yaml`, `redis_data` è collegato lì.
- La prova 6 mostra la regola `save` (`3600 1 300 100 60 10000`): quindi nel mio Redis gli snapshot sono previsti. La pagina Persistence e la pagina CONFIG GET (citazioni sotto) confermano il significato del parametro.
- Che siano i valori predefiniti è una mia deduzione: nel `compose.yaml` non c'è nessun `command` né file di configurazione per `redis`.
- Cosa c'è in `/data` l'ho visto nella prova 7.

16. Nell'healthcheck di Redis (`["CMD", "redis-cli", "ping"]`): perché qui `CMD` e non `CMD-SHELL`? Cosa fa `redis-cli ping`?

**Risposta:**

- La pagina di PING (citazione sotto) dice che il comando risponde `PONG` e serve a controllare che la connessione sia ancora viva.
- Nel 05 (passo 12) il log del Redis di prova mostra `Output: "PONG\n"` con `ExitCode: 0`: questo l'ho visto.
- Perché `CMD` e non `CMD-SHELL`: la mia idea è che non serve la shell, perché il comando non ha variabili né pipe. È una deduzione: la pagina dei servizi non lo dice.
- Confronto (non è una prova): `mysqladmin ping` esce con 0 anche con «Access denied», perché controlla solo che il server sia acceso. La pagina di PING dice invece che Redis dà errore quando non riesce a servire i dati, per esempio mentre carica da disco. Quindi il controllo di Redis dice di più su «risponde davvero».
- Domanda aperta: la pagina PING descrive il comando, ma non dice che `redis-cli ping` mandi proprio quel comando. È una mia deduzione, coerente con il `PONG` del 05.
- Domanda aperta: la pagina non dice con quale codice esce `redis-cli` in caso di errore, quindi non so se Docker segnerebbe `unhealthy`. Non l'ho provato.
- Non provato: `redis-cli ping` con Redis fermo o con password.

17. In fondo al file, `mysql_data:` e `redis_data:` sono scritti senza niente dopo i due punti. Cosa significa, e perché vanno dichiarati lì? Il nome vero sul mio computer è `orarium_mysql_data`: da dove viene il prefisso?

**Risposta:**

- Il blocco `volumes:` in fondo dichiara i volumi con nome che uno o più servizi possono usare (citazione sotto). Ogni servizio deve avere l'accesso esplicito con `volumes` dentro `services` (stessa citazione). Quindi `db` usa `mysql_data`, `redis` usa `redis_data`.
- `mysql_data:` senza niente dopo i due punti: la pagina dice che una voce può essere vuota, e in quel caso si usa la configurazione di default del motore (citazione sotto). `docker compose up` crea il volume se non c'è.
- Il prefisso: senza un `name` esplicito, il nome di default include il nome del progetto. L'esempio della pagina (sezione `external`) mostra `{project_name}_db-data`. Il progetto è `orarium` (04, passo 1), quindi il nome vero è `orarium_mysql_data`.
- Lo stesso schema l'ho visto con `prova-compose_dati` (04, passo 10). I nomi `orarium_mysql_data` e `orarium_redis_data` compaiono nelle prove 2 e 4.
- Non provato: cosa succede se metto un `name:` esplicito su `mysql_data`.

## Dalla documentazione (parole originali)

### Define services in Docker Compose

Sezione generale:

> A Compose file must declare a services top-level element as a map whose keys are string representations of service names, and whose values are service definitions. A service definition contains the configuration that is applied to each service container.

> `image` specifies the image to start the container from. `image` must follow the Open Container Specification addressable image format, as `[<registry>/][<project>/]<image>[:<tag>|@<digest>]`.

> If the image does not exist on the platform, Compose attempts to pull it based on the pull_policy.

Voce `pull_policy`, valore `missing`:

> missing: Compose pulls the image only if it's not available in the platform cache. This is the default option if you are not also using the Compose Build Specification. if_not_present is considered an alias for this value for backward compatibility. The latest tag is always pulled even when the missing pull policy is used.

Sezione `ports`:

> The short syntax is a colon-separated string to set the host IP, host port, and container port in the form:

> HOST is [IP:](port | range) (optional). If it is not set, it binds to all network interfaces (0.0.0.0).

> If you do not specify a host IP (such as 127.0.0.1), Docker binds to all interfaces (0.0.0.0), bypassing host firewall rules. This can expose the container directly to the internet if the host has a public IP address.

> HOST:CONTAINER should always be specified as a (quoted) string, to avoid conflicts with YAML base-60 float.

Sezione `environment`:

> The environment attribute defines environment variables set in the container.

Sezione `healthcheck`:

> test defines the command Compose runs to check container health. It can be either a string or a list. If it's a list, the first item must be either NONE, CMD or CMD-SHELL. If it's a string, it's equivalent to specifying CMD-SHELL followed by that string.

> Using CMD-SHELL runs the command configured as a string using the container's default shell (/bin/sh for Linux).

Sezione `volumes`:

> To avoid ambiguities with named volumes, relative paths should always begin with `.` or `..`.

> Relative host paths are only supported by Compose that deploy to a local container runtime.

> VOLUME: Can be either a host path on the platform hosting containers (bind mount) or a volume name.

> CONTAINER_PATH: The path in the container where the volume is mounted.

> ro: Read-only access.

### Docker Hub: mysql

Sezione «Initializing a fresh instance»:

> When a container is started for the first time, a new database with the specified name will be created and initialized with the provided configuration variables. Furthermore, it will execute files with extensions .sh, .sql, .sql.gz, .sql.bz2, .sql.xz, and .sql.zst that are found in /docker-entrypoint-initdb.d. Files will be executed in alphabetical order. When parsing .sh files without the execute bit set, they are sourced rather than executed.

Sezione «Environment Variables»:

> This variable is mandatory and specifies the password that will be set for the MySQL root superuser account.

> Do note that none of the variables below will have any effect if you start the container with a data directory that already contains a database: any pre-existing database will always be left untouched on container startup.

Elenco «Supported tags»:

> 8.4.13, 8.4, 8, 8.4.13-oraclelinux9, 8.4-oraclelinux9, 8-oraclelinux9, 8.4.13-oracle, 8.4-oracle, 8-oracle

Nella stessa pagina il primo gruppo di tag comincia con `26.10.0`, `26.10`, `26`, `innovation`, `latest`. Questo non è una citazione: è l'elenco che ho letto.

La pagina dei servizi di Compose non spiega la differenza tra `latest`, `8.4` e `8.4.13`: mostra solo esempi come `redis` e `redis:5`. La pagina Docker Hub di MySQL mostra quali tag puntano allo stesso gruppo; il motivo del tag fisso lo prendo da D-004.

### Docker Hub: redis

Sezione «Start with persistent storage»:

> If persistence is enabled, data is stored in the VOLUME /data, which can be used with --volumes-from some-volume-container or -v /docker/host/dir:/data (see docs.docker volumes).

Sezione «Security»:

> For the ease of accessing Redis from other containers via Docker networking, the "Protected mode" is turned off by default. This means that if you expose the port outside of your host (e.g., via -p on docker run), it will be open without a password to anyone.

### redis.io: PING

Sezione «This command is useful for:»:

> This command returns the simple string PONG if no argument is provided, otherwise it returns a copy of the provided message as a bulk string.

> Testing whether a connection is still alive.

> Verifying the server's ability to serve data - an error is returned when this isn't the case (for example, during load from persistence data or accessing a stale replica).

### MySQL: mysqladmin (dev.mysql.com, MySQL 8.4)

Sezione `ping` e codice di uscita:

> Check whether the server is available. The return status from mysqladmin is 0 if the server is running, 1 if it is not. This is 0 even in case of an error such as Access denied, because this means that the server is running but refused the connection, which is different from the server not running.

> The password of the MySQL account used for connecting to the server. The password value is optional. If not given, mysqladmin prompts for one. If given, there must be no space between --password= or -p and the password following it. If no password option is specified, the default is to send no password.

> Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file.

Opzione `--host`:

> Connect to the MySQL server on the given host.

Scheda dell'opzione `--host`: il campo Default Value riporta `localhost`.

Opzione `--socket`:

> For connections to localhost, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

Opzione `--silent`:

> Exit silently if a connection to the server cannot be established.

### Dockerfile reference

Sezione HEALTHCHECK:

> The command's exit status indicates the health status of the container. The possible values are: 0: success - the container is healthy and ready for use; 1: unhealthy - the container isn't working correctly; 2: reserved - don't use this exit code

### Interpolation

> You can use a `$$` (double-dollar sign) when your configuration needs a literal dollar sign.

> This also prevents Compose from interpolating a value, so a `$$` allows you to refer to environment variables that you don't want processed by Compose.

### Define and manage volumes in Docker Compose

> The top-level `volumes` declaration lets you configure named volumes that can be reused across multiple services.

> To use a volume across multiple services, you must explicitly grant each service access by using the volumes attribute within the services top-level element.

> An entry under the top-level volumes section can be empty, in which case it uses the container engine's default configuration for creating a volume.

> Running docker compose up creates the volume if it doesn't already exist. Otherwise, the existing volume is used and is recreated if it's manually deleted outside of Compose.

> name sets a custom name for a volume. The name field can be used to reference volumes that contain special characters. The name is used as is and is not scoped with the stack name.

Sezione `external`:

> In the following example, instead of attempting to create a volume called `{project_name}_db-data`, Compose looks for an existing volume simply called `db-data` and mounts it into the backend service's containers.

### Persistence (redis.io)

Sezione «Snapshotting»:

> By default Redis saves snapshots of the dataset on disk, in a binary file called `dump.rdb`.

> You can configure Redis to have it save the dataset every N seconds if there are at least M changes in the dataset, or you can manually call the SAVE or BGSAVE commands.

### CONFIG GET (redis.io)

> The `CONFIG GET` command is used to read the configuration parameters of a running Redis server.

> Any configuration parameter matching any of the patterns are reported as a list of key-value pairs.

> All the supported parameters have the same meaning of the equivalent configuration parameter used in the redis.conf file.

## Esercizio: la traccia

Prove di sola lettura sul progetto vero (Orarium), tranne il `docker compose up -d` del passo 3, usato per riavviare i servizi che erano fermi. Non copio percorsi con il mio nome utente.

1. `docker inspect --format "{{json .HostConfig.PortBindings}}" orarium-db-1`: conferma `127.0.0.1:3307`.

   **Cosa ho visto:** il comando mi ha dato `{"3306/tcp":[{"HostIp":"127.0.0.1","HostPort":"3307"}]}`. Vuol dire che la porta `3306` del contenitore è collegata solo a `127.0.0.1`, sulla porta `3307`. Così si conferma la riga del `compose.yaml` delle domande 5 e 7.

2. `docker inspect --format "{{json .Mounts}}" orarium-db-1`: distinguo volume con nome e bind mount, e controllo se sono in lettura e scrittura (RW).

   **Cosa ho visto:** il contenitore ha due mount, cioè due cose collegate dentro.
   - Il primo è la cartella `docker/mysql/init` del mio computer, collegata a `/docker-entrypoint-initdb.d`. Ha `RW` a `false`, quindi il contenitore la legge soltanto: è il `:ro` della riga del file.
   - Il secondo è il volume `orarium_mysql_data`, collegato a `/var/lib/mysql`. È un volume di Docker, e il contenitore ci può leggere e scrivere (`RW` a `true`).
   Il percorso completo della cartella non lo scrivo, perché contiene il mio nome utente.

3. `docker compose exec db ls /docker-entrypoint-initdb.d`: cosa vede il contenitore nella cartella montata.

   **Cosa ho visto:** il comando mi ha stampato `01-test-database.sh`. È l'unico file nella cartella, e conferma il mount della prova 2: dentro il contenitore c'è lo script di `docker/mysql/init`. Prima il comando aveva dato `service "db" is not running`, cioè il servizio era fermo; adesso risponde, quindi `db` è in esecuzione. L'ho riavviato con `docker compose up -d` dalla cartella di Orarium: `orarium-db-1` e `orarium-redis-1` risultano `Started`.

4. `docker inspect --format "{{json .Mounts}}" orarium-redis-1`: come sopra, per Redis.

   **Cosa ho visto:** un solo mount. È il volume `orarium_redis_data`, collegato a `/data`, con `Driver` `local`, `Mode` `rw` e `RW` `true`. Non ci sono bind mount, quindi Redis non ha cartelle del mio computer collegate.

5. `docker compose exec redis redis-cli ping`, poi `$LASTEXITCODE`: annoto la risposta e il codice di uscita.

   **Cosa ho visto:** il comando stampa `PONG`. Subito dopo, `$LASTEXITCODE` vale `0`. Quindi il comando è riuscito, e per il `healthcheck` questo vuol dire «sano».

6. `docker compose exec redis redis-cli config get save`: risponde alla domanda sulla persistenza predefinita.

   **Cosa ho visto:** il comando stampa `save` con il valore `3600 1 300 100 60 10000`. Sono le regole di salvataggio di Redis, a coppie (secondi, numero di modifiche): salva dopo 3600 secondi se c'è almeno 1 modifica, dopo 300 secondi se ce ne sono almeno 100, dopo 60 secondi se ce ne sono almeno 10000. La regola `save` mostra che gli snapshot sono previsti. Leggo `save` con `CONFIG GET`, lo stesso parametro che si scriverebbe nel `redis.conf` (citazione sotto). Non ho lanciato `CONFIG GET *`: la scheda del comando lo classifica tra i comandi `@admin`, `@slow`, `@dangerous`, e `*` elencherebbe tutta la configurazione. Che siano i valori predefiniti è una mia deduzione: nel `compose.yaml` non c'è nessun `command` né file di configurazione per `redis`. Le citazioni di Persistence e CONFIG GET sotto sono verificate sul testo delle pagine.

7. `docker compose exec redis ls -la /data`: cosa c'è nella cartella dei dati di Redis?

   **Cosa ho visto:** c'è un file `dump.rdb` di 88 byte, con data 2 novembre, 21:48, di proprietà dell'utente `redis`. Deduzione: Redis ha salvato almeno uno snapshot, e il file è finito nel volume. Deduzione: l'ora di `ls` è quella del contenitore, che può non coincidere con l'ora del mio computer: non l'ho confrontata con altre date. Ho visto il file e la sua data, non chi l'ha creato.
   **Cosa non so:** non so cosa contiene il file, quindi non lo do per vuoto. Non so perché la data sia del 2 novembre, cioè di due settimane fa.

## Dopo l'esercizio

### Verificato

- Prove 1–5: `PortBindings` di `orarium-db-1` è `127.0.0.1:3307`; i mount di `orarium-db-1` (bind mount `ro` su `/docker-entrypoint-initdb.d`, volume `rw` su `/var/lib/mysql`) e di `orarium-redis-1` (volume `rw` su `/data`); `redis-cli ping` risponde `PONG` con codice `0`.
- Il 16 novembre 2026, `docker buildx imagetools inspect redis:8.2.6` risponde: il tag esiste sul registro. Per `linux/amd64` l'immagine è stata creata il 19 maggio 2026, con base `debian:bookworm-slim`. Questo dice che il tag è disponibile oggi, ma non che resterà disponibile in futuro. Non dice in cosa `8.2.6` si differenzi da `8.2.11`: non l'ho confrontato.
- Prova 6: `CONFIG GET save` restituisce `3600 1 300 100 60 10000`.
- Prova 7: in `/data` c'è `dump.rdb`, di 88 byte, datato 2 novembre, di proprietà dell'utente `redis`.

### Dedotto

- I valori di `save` letti nella prova 6 sono quelli predefiniti di Redis: nel `compose.yaml` non c'è nessun `command` né file di configurazione per `redis`.
- La regola `save` è prevista anche per il mio Redis, perché il parametro letto con `CONFIG GET` ha lo stesso significato della voce del file `redis.conf`.

### Domande aperte

- Non ho controllato il bit di esecuzione di `01-test-database.sh`. Non so cosa succede con un contenitore nuovo su un volume già pieno (domanda 10).
- `dump.rdb` è del 2 novembre: non so perché non sia più recente, non l'ho provato. Non so se da allora non ci sono state modifiche sufficienti per far scattare le regole di `save`, o se Redis salva solo in certi momenti.
- Ipotesi, non provata: i contenitori sono fermi quando Docker Desktop si chiude o si riavvia. Può essere la causa dei vecchi `Exited (255)`.
- `redis:8.2.6` è disponibile oggi; cosa cambia rispetto a 8.2.11 non lo so. Possibile aggiornamento a `8.2.11`: da valutare nella parte «Applicazione in Orarium», controllando anche `backend.yml`.
- Perché `127.0.0.1` e non `localhost`? Non lo so.
- Con quale codice di uscita `redis-cli ping` esce in caso di errore? Non so se Docker segnerebbe il container `unhealthy`. Non l'ho provato.
- Cosa comporta l'assenza di `start_period` per i primi secondi di MySQL? Non l'ho provato.

### Applicazione in Orarium

- Nessuna PR da fare per ora: il `compose.yaml` non cambia.
- Verificato oggi con `Select-String`: `.github/workflows/backend.yml` non contiene `redis`, quindi il servizio Redis non compare nella CI.
- Verificato oggi: `.github/dependabot.yml` non esiste. Quindi nel repository non è configurato Dependabot per gli aggiornamenti di versione. Non ho controllato se esistono altri strumenti.
- Nuovo debito da valutare: `redis:8.2.6` potrebbe passare a `8.2.11`. Se lo cambio, va cambiato solo in `compose.yaml`, perché `backend.yml` non ha Redis.

## Fonti

- [Define services in Docker Compose](https://docs.docker.com/reference/compose-file/services/)
- [Define and manage volumes in Docker Compose](https://docs.docker.com/reference/compose-file/volumes/)
- [Docker Hub: mysql](https://hub.docker.com/_/mysql)
- [Docker Hub: redis](https://hub.docker.com/_/redis)
- [Comando PING (redis.io)](https://redis.io/docs/latest/commands/ping/)
- [Persistence (redis.io)](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/)
- [Comando CONFIG GET (redis.io)](https://redis.io/docs/latest/commands/config-get/)
- [Interpolation](https://docs.docker.com/reference/compose-file/interpolation/)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [mysqladmin](https://dev.mysql.com/doc/refman/8.4/en/mysqladmin.html)
- Orarium, `docs/DECISIONS.md` (D-004 e D-010) e `.github/workflows/backend.yml`: documenti interni del progetto, non fonti esterne.
