# 04 - Compose: un servizio

## Teoria

### L'idea

Finora ho avviato i contenitori uno alla volta, con comandi lunghi (`docker run -d --name ... -p ... -v ...`). Con Compose scrivo una volta sola, in un file, cosa voglio far girare. Poi un solo comando, `docker compose up`, crea e avvia tutto.

Un paragone dal laboratorio di pasticceria: è la differenza tra dettare a voce ogni passaggio al collega e consegnargli la scheda di produzione scritta. La scheda è sempre la stessa, la rifà chiunque e si può rileggere. Il paragone ha un limite: la scheda dice anche quantità, tempi e ordine dei passaggi, mentre `compose.yaml` descrive solo cosa far girare e con quali impostazioni.

### Il file: servizi e volumi

Nell'esempio della pagina il file ha due parti principali:

- `services:`: l'elenco dei **servizi**. Un servizio è una definizione astratta: i contenitori che lo realizzano sono quelli di cui parla la pagina («Services are backed by a set of containers»), vedi la citazione più sotto. Ogni servizio parte da un'immagine (`image:`) e può avere porte (`ports:`) e volumi (`volumes:`).
- `volumes:` in cima al file, fuori dai servizi: dichiara i volumi con nome.

Le righe dell'esempio ricalcano quello che ho fatto a mano nell'esercizio 03:

| A mano (esercizio 03) | Nel file (esempio della pagina) |
|---|---|
| immagine in fondo al comando | `image: example/database` |
| `-p 8080:80` | `ports:` con `"443:8043"` (stesso ordine: porta del computer, poi porta del contenitore) |
| `-v nome:/percorso` | `volumes:` con `db-data:/etc/data` |
| `docker volume create nome` | `db-data:` nel blocco `volumes:` in cima |

Il paragone: è come l'elenco degli ingredienti di una ricetta, scritto una volta, invece di tirarli fuori dal frigo ogni volta. Il limite: Compose non sceglie lui cosa mettere, usa solo quello che c'è scritto.

### I comandi

La pagina elenca quattro comandi chiave:

- `docker compose up`: avvia tutti i servizi del file; secondo la pagina crea anche le reti e i volumi necessari.
- `docker compose down`: ferma e rimuove i servizi.
- `docker compose logs`: mostra l'output dei contenitori.
- `docker compose ps`: elenca i servizi con il loro stato.

Dal README di Orarium so una cosa in più: `down` lascia i dati nei volumi, `down -v` li cancella. L'ho visto anche in pratica: dopo `docker compose up -d` le migrazioni erano ancora `Ran`.

### Il nome del progetto

Compose dà un nome di progetto a tutto quello che crea, e lo usa per tenere separati ambienti diversi (la pagina dà tre casi d'uso: più copie dello stesso ambiente, build in parallelo su un server, progetti diversi con servizi che si chiamano allo stesso modo). Se non lo scelgo io, è il nome della cartella che contiene il file; con `-p`, `COMPOSE_PROJECT_NAME` o `name:` nel file posso sceglierlo io, e hanno la precedenza sulla cartella.

Paragone: è il nome della commessa scritto su ogni vaschetta, così due commesse con gli stessi ingredienti non si mescolano in cella. Limite: sulle vaschette il nome lo scrivo io a mano, qui lo mette Compose.

### Cosa la pagina non dice

- Che il nome del progetto finisca davanti al nome del volume (`orarium_mysql_data`) o del contenitore (`orarium-db-1`): l'esempio della pagina mostra `example-frontend-1`, ma non spiega lo schema. Lo deducevo prima dell'esercizio; l'ho verificato nei passi 3, 5, 7 e 10.
- Come si scrive bene il file (rientri, simboli): lo vedo nell'esempio, ma la pagina non lo spiega.

## Dalla documentazione (parole originali)

### Il file e i comandi

Pagina «How Compose works»:

> With Docker Compose you use a YAML configuration file, known as the Compose file, to configure your application’s services, and then you create and start all the services from your configuration with the Compose CLI.

> The default path for a Compose file is compose.yaml (preferred) or compose.yml that is placed in the working directory.

> The docker compose up command starts the frontend and backend services, creates the necessary networks and volumes, and injects the configuration and secret into the frontend service.

> To stop and remove the running services: `docker compose down`

> docker compose ps provides a snapshot of the current state of your services, making it easy to see which containers are running, their status, and the ports they are using

### Il nome del progetto

Pagina «Specify a project name»:

> By default, Compose assigns the project name based on the name of the directory that contains the Compose file.

> Compose uses a project name to isolate environments from each other.

> The precedence order for each method, from highest to lowest, is as follows: 1. The `-p` command line flag. 2. The COMPOSE_PROJECT_NAME environment variable. 3. The top-level `name:` attribute in your Compose file. [...] 4. The base name of the project directory containing your Compose file. [...]

### Il servizio

Pagina «Define services in Docker Compose»:

> A service is an abstract definition of a computing resource within an application which can be scaled or replaced independently from other components.

Traduzione: un servizio è una definizione astratta di una risorsa di calcolo dentro un'applicazione, che si può scalare o sostituire senza toccare gli altri componenti.

> Services are backed by a set of containers, run by the platform according to replication requirements and placement constraints.

Traduzione: i servizi sono realizzati da un insieme di contenitori, che la piattaforma fa girare secondo i requisiti di replica e i vincoli di posizionamento.

## Con parole mie

### 1. Compose invece di tre `docker run`
 
> Spiega a un collega che non conosce Docker perché gli conviene un compose.yaml invece di tre docker run separati.
 
**Risposta:** con tre `docker run` separati devo ricordarmi ogni volta comandi lunghi, con porte, volumi e nomi, e rifarli uno per uno. Con un `compose.yaml` scrivo una volta sola cosa voglio far girare e con un solo comando, `docker compose up`, parte tutto.
 
- **Dedotto:** il file si può rileggere, condividere e rifare identico da chiunque. Il limite è che il file descrive cosa far girare e con quali impostazioni, ma l'ordine di avvio non lo decide da solo: serve `depends_on`, che ho provato nell'esercizio 06.

### 2. `docker compose up -d` due volte di fila

> Hai un compose.yaml e lanci `docker compose up -d` due volte di fila. Cosa ti aspetti alla seconda volta?

**Risposta:** mi aspetto che non succeda niente di grave: Compose vede che i servizi sono già in esecuzione, quindi non crea contenitori nuovi e non me ne ritrovo due uguali.

- **Visto:** la seconda volta `up -d` stampa una sola riga, `Container prova-compose-web-1 Running`, e `CREATED` dice ancora `9 minutes ago`: Compose non ha ricreato niente (passo 9).
- **Dedotto:** se il file non è cambiato, mi aspetto che lo dica nell'output, per esempio con lo stato «Running» o «up-to-date». Se invece i contenitori erano fermi, li riavvia.

### 3. `down` e `down -v`
 
> Quando lanceresti `docker compose down` e quando `docker compose down -v`? Cosa rischi con la seconda?
 
**Risposta:** lancerei `docker compose down` quando voglio fermare tutto a fine lavoro: i dati restano nei volumi, quindi la volta dopo basta un `docker compose up -d` e trovo il database com'era. Lancerei `docker compose down -v` solo se voglio ripartire da zero: il rischio è che cancella anche i dati del database di sviluppo, quindi perdo tutto e devo ricreare le tabelle con `php artisan migrate`.
 
### 4. Tenere separati due ambienti
 
> Metti lo stesso compose.yaml in due cartelle con nomi diversi e avvii entrambi. Cosa può andare storto se Compose non tenesse separati i due ambienti? Come fa a tenerli separati?
 
**Risposta:** Compose li tiene separati con il nome del progetto: se non lo scelgo io, è il nome della cartella, e Compose lo mette davanti ai nomi di contenitori e volumi.
 
- **Visto:** anche per le reti il nome del progetto va davanti: l'ho visto nell'esercizio con `prova-compose_default` e `orarium_default`.
- **Dalla pagina:** per default Compose assegna il nome del progetto in base alla cartella che contiene il file, e lo usa per isolare gli ambienti. Si può cambiare con `-p`, con la variabile `COMPOSE_PROJECT_NAME` o con `name:` nel file, e questi tre hanno la precedenza sul nome della cartella (citazioni sopra).
- **Dedotto:** se Compose non separasse i due ambienti, ci sarebbero problemi: i due file creano le stesse cose, quindi i nomi dei contenitori si scontrerebbero; i dati di un ambiente finirebbero nei volumi dell'altro; un `down` in una cartella fermerebbe anche i contenitori dell'altra.

### 5. Il nome del progetto di Orarium
 
> Apri il compose.yaml di Orarium: c'è un `name:` in cima? Se no, quale voce dell'elenco di precedenza si applica e che nome di progetto ne esce?
 
**Risposta:** no, in cima al file non c'è nessun `name:`: il file inizia direttamente con `services:`. Non uso il flag `-p` e nel `.env` di Orarium non c'è `COMPOSE_PROJECT_NAME`, quindi si applica la voce 4 dell'elenco, il nome della cartella: la cartella si chiama `orarium`, quindi il progetto è `orarium`.
 
- **Visto:** l'ho verificato con `docker compose ls`: il progetto si chiama `orarium` e ha 2 servizi in esecuzione (`running(2)`). Nessun altro nome lo ha cambiato.
- **Dalla pagina:** la precedenza è, dalla più alta alla più bassa: `-p`, `COMPOSE_PROJECT_NAME`, `name:` nel file, nome della cartella (citazione sopra).

### 6. Lo schema dei nomi
 
> Confronta i nomi che hai visto in Orarium (`orarium-db-1`, `orarium-redis-1`, `orarium_mysql_data`) con `example-frontend-1` dell'esempio della pagina. Che schema vedi? Scrivi cosa è certo e cosa è una tua ipotesi.
 
**Risposta:** lo schema è: contenitori come `<progetto>-<servizio>-<numero>`, volumi come `<progetto>_<nome del volume>`. Il progetto è `orarium`, il servizio è `db` o `redis`, e il numero è `1`.
 
- **Visto:** sul mio computer ci sono i contenitori `orarium-db-1` e `orarium-redis-1`, e i volumi `orarium_mysql_data` e `orarium_redis_data`; li ho controllati con `docker ps -a` e `docker volume ls`.
- **Dedotto:** `example-frontend-1` segue lo stesso schema, con progetto `example` e servizio `frontend`.
- **Non provato:** `example-frontend-1`: l'esempio è solo scritto nella pagina e non l'ho lanciato.

### 7. Servizio e volume a confronto con l'esercizio 03
 
> Nel compose.yaml di Orarium indica un servizio e un volume con nome. A quale comando a mano dell'esercizio 03 corrisponde ciascuno?
 
**Risposta:** il servizio è `db` e corrisponde a un intero `docker run -d --name ... -p ... -v ... immagine`. Il volume con nome è `mysql_data` e corrisponde a `-v nome:/percorso`, mentre la sua dichiarazione in fondo al file, nel blocco `volumes:`, corrisponde a `docker volume create nome`.
 
- **Visto:** nel `compose.yaml`, `db` ha l'immagine `mysql:8.4.13` in `image:`, la porta in `ports:` e il volume in `volumes:`; nel servizio il volume compare come `mysql_data:/var/lib/mysql`.
- **Dedotto:** le corrispondenze con i comandi dell'esercizio 03 (`docker run`, `-v`, `docker volume create`) sono letture mie.

## Esercizio: la traccia

Lavoro in una cartella di prova, `docker/prova-compose`, perché il nome della cartella diventa il nome del progetto. **Attenzione:** prima di ogni `docker compose down` controllo con `Get-Location` che il percorso finisca con `prova-compose`. Un `down -v` lanciato dalla cartella di Orarium cancellerebbe i dati del suo database.

1. Guardo i progetti Compose già presenti con `docker compose ls`. Annoto il nome e lo stato del progetto di Orarium.

   **Cosa ho visto:** c'è un solo progetto, `orarium`, con stato `running(2)`, cioè 2 servizi in esecuzione. Nella colonna dei file di configurazione compaiono due percorsi che puntano allo stesso `compose.yaml`, uno con `desktop` e uno con `Desktop`. Qui non li riporto (vedi le domande aperte).

2. Creo la cartella `docker/prova-compose` e dentro il file `compose.yaml`, scritto da me, con un solo servizio: nome `web`, immagine `docker/welcome-to-docker`, porta `127.0.0.1:8080:80`. Mi sposto nella cartella con `cd docker\prova-compose` e controllo con `Get-Location`.

   **Cosa ho visto:** la cartella `prova-compose` è stata creata dentro `docker`, senza errori. Dopo il `cd`, `Get-Location` mostra un percorso che finisce con `prova-compose`, quindi sono nella cartella giusta. Il percorso completo non lo riporto.

3. `docker compose up -d`. Annoto quali righe compaiono nell'output e cosa dicono di aver creato.

   **Cosa ho visto:** Compose ha creato una rete, `prova-compose_default`, che nel file non avevo scritto. Ha creato il contenitore `prova-compose-web-1`, che segue lo schema `<progetto>-<servizio>-<numero>` della risposta 6. Non c'è stato nessun download dell'immagine, perché ce l'avevo già. La rete ha anche lei il nome del progetto davanti.

4. `docker compose ps`. Annoto le colonne `NAME`, `SERVICE` e `PORTS`.

   **Cosa ho visto:** `NAME` è `prova-compose-web-1`, `SERVICE` è `web`, `PORTS` è `127.0.0.1:8080->80/tcp`. Il `SERVICE` è il nome che ho dato nel file, mentre il `NAME` contiene anche il nome del progetto.

5. `docker ps`. Confronto il nome del contenitore con quello di Orarium.

   **Cosa ho visto:** in `docker ps` compaiono tre contenitori: `prova-compose-web-1`, `orarium-db-1` e `orarium-redis-1`. Tutti e tre hanno lo stesso schema `<progetto>-<servizio>-<numero>`, ma ognuno con il proprio progetto davanti. Quelli di Orarium risultano `Up 2 hours (healthy)`.

6. `docker compose ls`. Annoto quanti progetti compaiono e come si chiamano.

   **Cosa ho visto:** compaiono 2 progetti: `orarium`, con `running(2)`, e `prova-compose`, con `running(1)`. Il progetto `prova-compose` prende il nome dalla cartella, come previsto. I percorsi dei file non li riporto.

7. `docker network ls`. Cerco se è comparsa una rete nuova e come si chiama.

   **Cosa ho visto:** è comparsa una rete nuova, `prova-compose_default`, con driver `bridge`. Anche la rete di Orarium ha il nome del progetto davanti: `orarium_default`. Quindi la rete segue lo stesso schema `<progetto>_<nome>` dei volumi.

8. Apro `http://127.0.0.1:8080` nel browser.

   **Cosa ho visto:** la pagina risponde. Compare «Congratulations!!! You ran your first container.», la stessa pagina di benvenuto del passo 9 dell'esercizio 03. La porta pubblicata nel file, `127.0.0.1:8080:80`, risponde dal mio computer.

   ![Pagina di benvenuto di Docker su 127.0.0.1:8080](img/congratulations.png)

9. Lancio `docker compose up -d` una seconda volta, senza cambiare niente. Annoto l'output e poi controllo con `docker compose ps` la colonna `CREATED`.

   **Cosa ho visto:** l'output è una sola riga: `Container prova-compose-web-1 Running`. Non compare nessuna creazione di rete o di contenitore, quindi Compose non ha ricreato niente. Con `docker compose ps` la colonna `CREATED` dice `9 minutes ago`: il contenitore è quello del primo `up`, non è stato ricreato. Lo stato è `Up 9 minutes`.

10. Aggiungo al servizio un volume con nome: `dati:/dati` sotto `volumes:` del servizio, e `dati:` nel blocco `volumes:` in cima al file. Lancio `docker compose up -d`, annoto cosa cambia nell'output, poi `docker volume ls` e annoto il nome del volume.

    **Cosa ho visto:** l'output dice `Volume prova-compose_dati Created` e `Container prova-compose-web-1 Started`. Compose ha creato il volume, che si chiama `prova-compose_dati`: il nome del progetto davanti, come per la rete. Il file monta il volume su `/dati`; non l'ho controllato. Con `docker compose ps` la colonna `CREATED` dice `About a minute ago`, mentre al passo 9 diceva `9 minutes ago`: questa volta il contenitore è stato ricreato. Con `docker volume ls` il volume compare come `prova-compose_dati`, insieme ai quattro che c'erano già (due con nome lungo, `orarium_mysql_data` e `orarium_redis_data`).

11. Controllo con `Get-Location`, poi `docker compose down`. Dopo guardo `docker ps -a`, `docker volume ls` e `docker network ls`. Annoto cosa è sparito e cosa è rimasto.

    **Cosa ho visto:** l'output di `docker compose down` dice `Container prova-compose-web-1 Removed` e `Network prova-compose_default Removed`. Il volume `prova-compose_dati` non compare nell'output, quindi `down` senza `-v` non lo ha toccato. Con `docker volume ls` il volume `prova-compose_dati` c'è ancora, insieme ai quattro volumi di prima. Con `docker network ls` la rete `prova-compose_default` non compare più, mentre restano `orarium_default` e le altre tre reti già presenti (`bridge`, `host`, `none`). Con `docker ps -a` restano solo i due contenitori di Orarium, `orarium-db-1` e `orarium-redis-1`, entrambi `Up 2 hours (healthy)`. Il contenitore `prova-compose-web-1` non compare più. In `orarium-db-1` la porta è ancora `127.0.0.1:3307->3306/tcp`, e `33060/tcp` non compare.

12. Lancio `docker compose -p altro up -d`. Guardo `docker compose ls` e `docker ps`. Annoto i nomi di contenitore, rete e volume.

    **Cosa ho visto:** Compose ha creato la rete `altro_default`, il volume `altro_dati` e il contenitore `altro-web-1`. Il nome del progetto è `altro`, cioè quello passato con `-p`, e non quello della cartella. Il volume `prova-compose_dati` non è stato riusato: il progetto nuovo ne crea uno suo. Con `docker compose ls` compaiono due progetti: `altro`, con `running(1)`, e `orarium`, con `running(2)`. Il progetto `prova-compose` non compare più. Non ho lanciato `docker ps`: ho preso i nomi dall'output di `up`.

    **Cosa ho dedotto:** `prova-compose` non compare più perché l'ho fermato con `down` al passo 11.

13. Lancio `docker compose -p altro down -v`. Guardo `docker volume ls` e annoto quali volumi `dati` restano.

    **Cosa ho visto:** l'output dice `Container altro-web-1 Removed`, `Volume altro_dati Removed` e `Network altro_default Removed`. Il `-v` ha cancellato il volume `altro_dati` del progetto `altro`, e basta. Il volume `prova-compose_dati` non è nell'output, quindi non è stato toccato da questo comando. Con `docker volume ls` restano `prova-compose_dati`, i due volumi con nome lungo, `orarium_mysql_data` e `orarium_redis_data`. Il volume `altro_dati` è sparito.

14. Cancello il volume rimasto con `docker volume rm` (il nome lo prendo da `docker volume ls`) e controllo con `docker volume ls`.

    **Cosa ho visto:** `docker volume rm prova-compose_dati` stampa il nome del volume, `prova-compose_dati`, e non dà errori. Con `docker volume ls` restano solo i quattro volumi di prima: i due con nome lungo (di cui non so il proprietario), `orarium_mysql_data` e `orarium_redis_data`. `prova-compose_dati` è sparito. Ho anche ripetuto il `docker volume rm` sullo stesso nome, e ha risposto `Error response from daemon: get prova-compose_dati: no such volume`: il volume non esisteva più perché l'avevo appena rimosso.

## Dopo l'esercizio

### Cosa ho fatto

Ho costruito un progetto di prova, `prova-compose`, con un solo servizio `web` e un volume `dati`, e l'ho avviato, modificato, fermato e rimosso. Ho avviato anche un secondo progetto, `altro`, con `-p`, accanto al primo, per vedere come Compose separa i nomi. Ho controllato ogni passo con `docker compose`, `docker ps`, `docker volume ls` e `docker network ls`.

### Cosa ho verificato

- Il nome del progetto è quello della cartella, se non lo cambio: `prova-compose` dalla cartella `prova-compose` (passo 6), `orarium` dalla cartella `orarium` (passo 1).
- Il nome del progetto va davanti a contenitori, volumi e reti: `prova-compose-web-1` (passo 5), `prova-compose_dati` (passo 10), `prova-compose_default` (passo 7).
- `up -d` lanciato due volte: la seconda volta l'output è solo `Container prova-compose-web-1 Running`, e `CREATED` resta `9 minutes ago` (passo 9).
- Cosa succede al contenitore quando cambia il file: dopo la modifica, `CREATED` passa da `9 minutes ago` a `About a minute ago`, quindi il contenitore è stato ricreato (passo 10, `docker compose ps`). La causa è confermata: nell'esercizio 05, passo 7, cambiando solo il comando il messaggio è stato `Recreated`.
- Il messaggio non sempre dice `Recreated`: al passo 13 dell'esercizio 05 era `Started`, ma `CREATED` mostrava un contenitore nuovo. Per sapere se è stato ricreato guardo `CREATED`, non solo il messaggio.
- `down` e `down -v`: `down` rimuove contenitore e rete e lascia il volume (passo 11); `down -v` con `-p altro` rimuove anche il volume `altro_dati` (passo 13).
- `-p` contro il nome della cartella: con `-p altro` il progetto e i nomi sono `altro`, anche se la cartella è `prova-compose` (passi 12 e 6).

### Cosa ho dedotto e non ancora verificato

- Il volume è montato su `/dati`: il file lo dichiara, ma non ho controllato dentro il contenitore (passo 10). Per verificarlo servirebbe `docker container inspect`, sezione `Mounts`.
- Il secondo `up -d` non nomina la rete perché la rete esiste già e non è cambiato niente: è la mia ipotesi. L'output dice solo che il contenitore è in esecuzione (passo 9).

### Domande aperte

- 33060/tcp non compare più: al passo 11 `docker ps -a` mostra solo `127.0.0.1:3307->3306/tcp` per `orarium-db-1`. Nel 03 l'avevo annotata con il contenitore `Exited`. Il perché non lo so. Ora la differenza tra `Exited` e `Up` l'ho vista sullo stesso contenitore (esercizio 05), e l'immagine dichiara quella porta.
- I due volumi con nome lungo (`2d43ed70…` e `a385f5a4…`) esistono, come visto con `docker volume ls` al passo 10, ma non so di chi siano.
- Perché `docker compose ls` mostra due volte lo stesso file di configurazione, una volta con `desktop` e una volta con `Desktop`? Ipotesi: è lo stesso file scritto con le maiuscole diverse, ma non l'ho verificato. Altra traccia: per `prova-compose` il file compare una sola volta, mentre per `orarium` compare due volte. Non so ancora spiegare la differenza.

### Applicazione in Orarium

- [PR #88](https://github.com/francesco-cassese/orarium/pull/88), `docs(backend): name the Docker volumes and explain the prefix`: ho riscritto nel `backend/README.md` la riga sui volumi, con i nomi veri (`orarium_mysql_data`, `orarium_redis_data`) e il motivo del prefisso: Compose mette davanti il nome del progetto, che di default è il nome della cartella.
- Prima di scriverla ho controllato con `docker compose ls` che il progetto di Orarium si chiama `orarium` (esercizio 04, passo 1) e con `docker volume ls` i nomi dei volumi (passo 10).

## Fonti

- [How Compose works](https://docs.docker.com/compose/intro/compose-application-model/)
- [Specify a project name](https://docs.docker.com/compose/how-tos/project-name/)
- [Define services in Docker Compose](https://docs.docker.com/reference/compose-file/services/)