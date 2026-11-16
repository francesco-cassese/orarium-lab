# 05 - Variabili d'ambiente e healthcheck

## Teoria

### L'idea

Nell'esercizio 04 il file diceva cosa far girare. Qui aggiungiamo due cose che Orarium usa già: far configurare i servizi senza scrivere nel file i valori che cambiano o che sono segreti (le variabili d'ambiente), e far dire a Docker se un servizio funziona davvero, non solo se è acceso (il `healthcheck`).

| Cosa | Dove sta in Orarium | A cosa serve |
|---|---|---|
| `.env.example` e `.env` | nella radice del progetto | i valori (password, nomi); il `.env` con i valori veri non va su Git |
| `${MYSQL_PASSWORD}` | nel `compose.yaml`, servizio `db` | il posto dove Compose scrive il valore preso dal `.env` |
| `environment:` | nel servizio `db` | mette il valore dentro il contenitore |
| `healthcheck:` | nei servizi `db` e `redis` | il comando con cui Docker controlla se il servizio funziona |

### Variabili d'ambiente: due passaggi diversi

Nel `compose.yaml` di Orarium la password del database non è scritta: c'è `MYSQL_PASSWORD: ${MYSQL_PASSWORD}`. Il valore sta nel file `.env`, accanto al `compose.yaml`. Succedono due cose distinte:

1. **Interpolazione.** Prima di avviare, Compose legge il `.env` e al posto di `${MYSQL_PASSWORD}` scrive il valore dentro il file. Succede nel file, non nel contenitore.
2. **`environment:`.** È la riga che mette quel valore dentro il contenitore, come variabile d'ambiente del programma che gira lì.

Il `.env` da solo non mette niente nel contenitore: serve una voce esplicita nel servizio. La pagina ne indica due, `environment:` (scrivi le variabili nel `compose.yaml`) e `env_file:` (carichi un file di variabili). Orarium usa `environment:`.

Un paragone dal laboratorio di pasticceria: il `compose.yaml` è la scheda di produzione con degli spazi da riempire («farina: ___»), il `.env` è il foglio con le quantità del giorno, che tengo per me. Chi prepara la scheda riempie gli spazi prima di consegnarla al reparto: il reparto vede solo la scheda compilata. Il paragone ha un limite: in cucina il foglio con le quantità lo possono leggere tutti, qui il `.env` resta sul mio computer e non va nel repository.

Se la stessa variabile può venire da più fonti, la precedenza è: ambiente della shell, poi `--env-file`, poi il `.env` nella cartella del progetto.

### Healthcheck: «acceso» non vuol dire «funziona»

Un contenitore `Up` dice che il processo è partito, non che il servizio risponda. Il `healthcheck` è un comando che Docker esegue dentro il contenitore a intervalli regolari: se finisce con successo il contenitore è `healthy`, se fallisce troppe volte di fila diventa `unhealthy`; all'inizio è `starting`.

Le opzioni di Orarium (`db`) sono `interval: 10s`, `timeout: 5s`, `retries: 10`. Cioè: il primo controllo parte 10 secondi dopo l'avvio del contenitore e i successivi 10 secondi dopo la fine del precedente; se uno dura più di 5 secondi vale come fallito; dopo 10 fallimenti consecutivi il contenitore è `unhealthy`.

Il `test` si scrive in due modi. `CMD-SHELL` con una stringa (Orarium, `db`) passa il comando alla shell del contenitore. `CMD` con una lista (Orarium, `redis`) lancia il programma direttamente.

Paragone: è il cuoco che assaggia a intervalli. «Il forno è acceso» è `Up`, «il dolce è cotto» è `healthy`. Limite: chi decide cosa assaggiare è chi scrive il test; un test sbagliato dà il via libera anche se il dolce è crudo.

### Cosa le pagine non dicono

- Cosa faccia il doppio dollaro `$$` che c'è nel test del database di Orarium. L'esempio della pagina dei servizi lo usa, ma non lo spiega.
- Che `docker ps` scriva `(healthy)` accanto allo stato: l'ho visto con i contenitori di Orarium, ma le pagine che ho letto non lo descrivono.
- Se il `healthcheck` faccia ripartire un contenitore `unhealthy`: nelle pagine che ho letto non c'è scritto, quindi non lo do per vero.

## Dalla documentazione (parole originali)

### Variabili

Pagina «Set, use, and manage variables in a Compose file with interpolation»:

> Interpolation is applied for unquoted and double-quoted values. Both braced (${VAR}) and unbraced ($VAR) expressions are supported.

> The .env file is the default method for setting variables. The .env file should be placed at the root of the project directory next to your compose.yaml file.

> If an environment variable is not set, Compose substitutes with an empty string.

Pagina «Interpolation»:

> "You can use a `$$` (double-dollar sign) when your configuration needs a literal dollar sign."

Traduzione: puoi usare `$$` quando la configurazione ha bisogno di un dollaro letterale.

> "This also prevents Compose from interpolating a value, so a `$$` allows you to refer to environment variables that you don't want processed by Compose."

Traduzione: questo impedisce anche a Compose di sostituire il valore, quindi `$$` ti permette di indicare variabili che non vuoi far elaborare da Compose.

> "If Compose can't resolve a substituted variable and no default value is defined, it displays a warning and substitutes the variable with an empty string."

Traduzione: se Compose non riesce a risolvere una variabile e non c'è un valore predefinito, mostra un avviso e sostituisce la variabile con una stringa vuota.

Pagina «Set environment variables within your container's environment»:

> A container's environment is not set until there's an explicit entry in the service configuration to make this happen.

> Don't use environment variables to pass sensitive information, such as passwords, in to your containers. Use secrets instead.

### Healthcheck

Pagina «Define services in Docker Compose»:

> The healthcheck attribute declares a check that's run to determine whether or not the service containers are "healthy". It works in the same way, and has the same default values, as the HEALTHCHECK Dockerfile instruction set by the service's Docker image.

> test defines the command Compose runs to check container health. It can be either a string or a list. If it's a list, the first item must be either NONE, CMD or CMD-SHELL. If it's a string, it's equivalent to specifying CMD-SHELL followed by that string.

> Using CMD-SHELL runs the command configured as a string using the container's default shell (/bin/sh for Linux).

Pagina «Dockerfile reference», sezione HEALTHCHECK:

> When a container has a healthcheck specified, it has a health status in addition to its normal status. This status is initially starting. Whenever a health check passes, it becomes healthy (whatever state it was previously in). After a certain number of consecutive failures, it becomes unhealthy.

> If a single run of the check takes longer than timeout seconds then the check is considered to have failed.

> It takes retries consecutive failures of the health check for the container to be considered unhealthy.

> The command's exit status indicates the health status of the container. The possible values are: 0: success - the container is healthy and ready for use; 1: unhealthy - the container isn't working correctly; 2: reserved - don't use this exit code

## Con parole mie

### 1. Differenza tra `.env` e `environment:`
 
> Spiega a un collega la differenza tra il file `.env` e la voce `environment:`: cosa fa ciascuno, e cosa succede se c'è solo il `.env`?
 
**Risposta:** il `.env` lavora sul file: è un file con i valori delle variabili, e Compose lo legge e usa quei valori al posto dei `${...}`. `environment:` lavora sul contenitore: sta nel servizio e mette le variabili dentro il contenitore. Se c'è solo il `.env`, i valori finiscono nel file che Compose legge, ma non nel contenitore.
 
- **Dalla pagina:** per arrivare nel contenitore serve una voce esplicita nel servizio: `environment:` oppure `env_file:`.

### 2. Il percorso di `MYSQL_PASSWORD`
 
> Nel `compose.yaml` di Orarium trova la riga `MYSQL_PASSWORD: ${MYSQL_PASSWORD}` e racconta il percorso del valore, dal `.env` fino al contenitore, in due passaggi. Non scrivere nessuna password e non incollare il tuo `.env`.
 
**Risposta:** il valore parte dal `.env`, dove c'è una variabile che si chiama `MYSQL_PASSWORD`. Primo passaggio: prima di avviare, Compose legge il `.env` e usa il valore al posto di `${MYSQL_PASSWORD}` nel file che legge. Secondo passaggio: la riga `MYSQL_PASSWORD:` dentro `environment:` del servizio `db` mette quel valore nel contenitore, come variabile d'ambiente del database.
 
### 3. Variabile mancante nel `.env`
 
> Cosa succede se in `.env` manca una variabile che il `compose.yaml` usa? Scrivi cosa dice la pagina e cosa deduci per Orarium.
 
**Risposta:** se una variabile manca, Compose la sostituisce con una stringa vuota. In Orarium, se in `.env` manca `MYSQL_PASSWORD`, la riga del servizio `db` arriverebbe vuota al contenitore.
 
- **Dalla pagina:** se una variabile non è impostata, Compose la sostituisce con una stringa vuota.
- **Dedotto:** per Orarium, se in `.env` manca `MYSQL_PASSWORD`, la riga `MYSQL_PASSWORD:` del servizio `db` arriverebbe vuota al contenitore.
- **Non provato:** se il database si avvierebbe lo stesso o darebbe errore.

### 4. Variabili d'ambiente e secrets
 
> La pagina sconsiglia le variabili d'ambiente per le password e propone i secrets. Orarium le usa lo stesso: quali ragioni ipotizzi, e cosa è certo (guarda `.env.example` e `.gitignore`)?
 
**Risposta:** la mia ipotesi è che Orarium giri in locale, sul mio pc, e che per un progetto così i secrets siano più da configurare di quanto serva.
 
- **Visto:** il `.gitignore` esclude `.env` e `.env.*`, tranne `.env.example`, quindi il `.env` della radice non va su Git. Il `.env.example` ha `MYSQL_PASSWORD=` vuota e il commento «Never commit .env»; dice anche che la stessa password va in `backend/.env` come `DB_PASSWORD`, quindi la password sta in due file sul mio pc. Che `backend/.env` non vada su Git l'ho verificato nel passo 9 della traccia, con `git check-ignore`: è ignorato dal `.gitignore` di `backend/`.
- **Dalla pagina:** la pagina sconsiglia le variabili d'ambiente per le password e propone i secrets.
- **Dedotto:** con le variabili d'ambiente è tutto più semplice. Il rischio è che la password finisca in un posto dove non dovrebbe, per esempio nei log o nelle variabili del contenitore. Per lo sviluppo sul mio pc il rischio mi sembra accettabile, ma per un server vero non lo farei.
- **Non provato:** che nelle variabili del contenitore la password si possa vedere con `docker inspect`.

### 5. `Up` e `(healthy)`
 
> Un contenitore risulta `Up`: basta per dire che il servizio funziona? Cosa aggiunge `(healthy)`?
 
**Risposta:** no, `Up` da solo non basta: vuol dire che il processo è partito, ma non che il servizio risponda. `(healthy)` aggiunge che l'ultimo controllo del `healthcheck` è andato a buon fine.
 
- **Visto:** nell'esercizio 04 ho visto `orarium-db-1` come `Up 2 hours (healthy)`: il database era partito e il suo controllo passava.
- **Dalla pagina:** la pagina del healthcheck dice che lo stato è `starting` all'inizio, poi diventa `healthy` quando un controllo passa.
- **Dedotto:** un database può essere `Up` anche mentre è bloccato, per esempio mentre prepara le tabelle: questo è un mio esempio, non viene dalla pagina. Il limite è che il `healthcheck` è scritto da me, quindi se il test è sbagliato può dire `healthy` anche quando il servizio non funziona davvero.

### 6. `interval`, `timeout` e `retries`
 
> Nel `healthcheck` di `db` di Orarium cosa fanno `interval: 10s`, `timeout: 5s` e `retries: 10`? Dopo quanti controlli falliti di fila il contenitore diventa `unhealthy`?
 
**Risposta:** `interval: 10s` è il tempo tra un controllo e il successivo, `timeout: 5s` è il tempo massimo di un singolo controllo (se ci mette di più, quel controllo conta come fallito) e `retries: 10` è il numero di fallimenti di fila necessari: con 10 fallimenti di fila il contenitore diventa `unhealthy`.
 
- **Dalla pagina:** servono tanti fallimenti consecutivi quanti sono i `retries` perché il contenitore sia `unhealthy`, e basta un solo controllo riuscito per tornare `healthy`.
- **Dedotto:** con controlli ogni 10 secondi ci vogliono circa 100 secondi, più il tempo dei controlli che vanno in timeout.
- **Non provato:** il tempo non l'ho misurato.

### 7. `CMD-SHELL` per `db`, `CMD` per `redis`
 
> Perché per `db` il `test` è `CMD-SHELL` con una stringa e per `redis` è `CMD` con una lista? Scrivi cosa dice la pagina e cosa deduci tu.
 
**Risposta:** per `db` il `test` è `CMD-SHELL` con una stringa perché il comando contiene `$$MYSQL_ROOT_PASSWORD`, e la variabile va letta dalla shell del contenitore. Per `redis` basta `CMD` con una lista, perché `redis-cli ping` non ha variabili né pipe.
 
- **Visto:** con un solo `$` (`echo $SALUTO`), `config` mostra `echo ciao`, quindi Compose sostituisce la variabile da solo. È una prova mia, non letta sulla pagina.
- **Dalla pagina:** il primo elemento della lista deve essere `NONE`, `CMD` o `CMD-SHELL`; se `test` è una stringa, vale come `CMD-SHELL` con quella stringa; `CMD-SHELL` fa girare il comando con la shell del contenitore (`/bin/sh` su Linux). La pagina Interpolation, trovata dopo l'esercizio, conferma il comportamento del `$$` (vedi «Dopo l'esercizio»).
- **Dedotto:** con `CMD` il programma parte direttamente, senza shell; con `CMD` non ci sarebbe nessuna shell a espandere la variabile, e il `$$` serve a dire a Compose di non sostituirla lui.
- **Non provato:** togliere la shell da `db`.

## Esercizio: la traccia

Lavoro in due cartelle di prova, `docker/prova-variabili` e `docker/prova-healthcheck`: il nome della cartella diventa il nome del progetto. In tutto l'esercizio uso solo valori finti (`ciao`). Non lancio `docker compose config` nella cartella di Orarium e, in Orarium, `docker inspect` solo con `--format "{{json .State.Health}}"`: un `docker inspect` completo mostrerebbe le variabili d'ambiente, password comprese. Prima di ogni `docker compose down` controllo con `Get-Location`.

### Parte A: le variabili

1. Creo `docker/prova-variabili` con due file scritti da me. `.env`: una riga, `SALUTO=ciao`. `compose.yaml`: un servizio `eco`, immagine `alpine`, `environment` con `SALUTO: ${SALUTO}` e come comando `["sh", "-c", "echo $$SALUTO"]`. Mi sposto con `cd docker\prova-variabili` e controllo con `Get-Location`.

   **Cosa ho visto:** `cd` ok. `Get-Location` finisce con `docker/prova-variabili`.

2. `docker compose config`. Confronto come sono scritti `SALUTO` dentro `environment` e il comando, rispetto al file.

   **Cosa ho visto:** `environment` ha `SALUTO: ciao`, quindi `${SALUTO}` è stato sostituito con il valore del `.env`. Il comando è ancora `echo $$SALUTO`: il `$$` non viene toccato da Compose. Compare anche la rete `prova-variabili_default`, che nel file non avevo scritto.

3. `docker compose up`. Guardo cosa stampa il contenitore e come finisce il comando.

   **Cosa ho visto:** creati rete `prova-variabili_default` e contenitore `prova-variabili-eco-1`. Il contenitore stampa `ciao` ed esce con `exited with code 0`.

4. `docker compose ps -a`. Guardo la colonna `STATUS` di `eco`.

   **Cosa ho visto:** `STATUS` è `Exited (0) 2 minutes ago`, quindi lo stesso caso di prima (vedi 02, domanda sullo `0`). Nella colonna `COMMAND` il comando è `sh -c 'echo $SALUTO'`: un solo `$`, mentre nel file c'è `$$`.

5. Cancello dal `.env` la riga `SALUTO=ciao` (il file resta vuoto). Rilancio `docker compose config`. Guardo se compaiono avvisi e come è scritto `SALUTO`.

   **Cosa ho visto:** compare un avviso: `The "SALUTO" variable is not set. Defaulting to a blank string.` In `environment` ora c'è `SALUTO: ""`, cioè stringa vuota.

6. Rimetto `SALUTO=ciao` nel `.env`. In PowerShell lancio `$env:SALUTO = "dalla-shell"` e poi `docker compose config`. Poi `Remove-Item Env:SALUTO` e di nuovo `docker compose config`. Annoto il valore in ciascun caso.

   **Cosa ho visto:** con `$env:SALUTO = "dalla-shell"` `config` mostra `SALUTO: dalla-shell`. Il `.env` ha `SALUTO=ciao` (l'ho controllato), ma vince la shell. Il `$$SALUTO` nel comando resta uguale. Dopo `Remove-Item Env:SALUTO`, `config` torna a `SALUTO: ciao`, cioè il valore del `.env`.

7. Nel `compose.yaml` cambio il comando da `$$SALUTO` a `$SALUTO` (un solo dollaro). Lancio `docker compose config` e poi `docker compose up`. Confronto con i passi 2 e 3.

   **Cosa ho visto:** `config`: il comando è diventato `echo ciao`, non più `echo $$SALUTO`. Compose ha sostituito la variabile da solo, prima di passare il comando al contenitore. `environment` resta `SALUTO: ciao`. `up`: il contenitore è stato ricreato (`Recreated`, non creata la rete), stampa `ciao` ed esce con `exited with code 0`. Stesso output del passo 3, anche se il comando nel file è cambiato.

8. Controllo con `Get-Location`, poi `docker compose down`.

   **Cosa ho visto:** `down` rimuove il contenitore `prova-variabili-eco-1` e la rete `prova-variabili_default`. Nessun volume, perché il `compose.yaml` di questa prova non ne ha.

9. Nella cartella di Orarium lancio `git check-ignore -v .env backend/.env`. Annoto quale regola e quale file compaiono per ciascuno dei due.

   **Cosa ho visto:** `.env` è ignorato dalla regola alla riga 8 del `.gitignore` della radice. `backend/.env` è ignorato dalla regola alla riga 3 di `backend/.gitignore`, cioè dal file della cartella `backend`.

### Parte B: il healthcheck

10. Creo `docker/prova-healthcheck` con un `compose.yaml` scritto da me: un servizio `cache`, immagine `redis:8.2.6` (ce l'ho già, ci sono i contenitori di Orarium), nessuna porta pubblicata, e un `healthcheck` con `test: ["CMD", "redis-cli", "ping"]`, `interval: 5s`, `timeout: 3s`, `retries: 3`. Mi sposto nella cartella e controllo con `Get-Location`.

    **Cosa ho visto:** `cd` ok. `Get-Location` finisce con `docker/prova-healthcheck`.

11. `docker compose up -d` e subito `docker compose ps`; poi di nuovo `docker compose ps` dopo una decina di secondi. Annoto la colonna `STATUS` nei due momenti.

    **Cosa ho visto:** al primo `up -d` il `ps` dopo 22 secondi dà `Up 22 seconds (healthy)`, quindi lo stato `starting` non l'ho visto. Ho lanciato una volta `down; up -d; ps` (non previsto dalla traccia) e poi `ps` altre due volte: subito dopo `up` lo stato è `Up Less than a second (health: starting)`; dopo 2 secondi `Up 2 seconds (health: starting)`; dopo 24 secondi `Up 24 seconds (healthy)`. `PORTS` è `6379/tcp` senza freccia; nel mio file non c'è `ports`.

12. `docker inspect --format "{{json .State.Health}}" prova-healthcheck-cache-1`. Annoto i campi che compaiono.

    **Cosa ho visto:** `Status` è `healthy`, `FailingStreak` è `0`. `Log` ha 5 controlli, tutti con `ExitCode: 0` e `Output: "PONG\n"`. Ogni voce ha `Start` e `End`: la durata va da 24 a 42 ms. Gli inizi sono a circa 5 secondi di distanza (11:36:52, 11:36:57, 11:37:02, 11:37:07, 11:37:13): quindi `interval: 5s` si vede. Una distanza è di circa 5,9 s (11:37:07 → 11:37:13): non la spiego.

13. Cambio il test in `["CMD-SHELL", "exit 1"]`. Annoto l'ora con `Get-Date`, lancio `docker compose up -d` e ripeto `docker compose ps` finché lo stato diventa `unhealthy`; annoto di nuovo l'ora. Confronto con la stima della risposta 6.

    **Cosa ho visto:** con `test: ["CMD-SHELL", "exit 1"]` ho fatto due prove, in ordine.
    Prova 1: alle 12:39:07 il primo `up -d` risponde `Running`, senza ricreare il contenitore. Il motivo (file non salvato) è solo un'ipotesi.
    Prova 2: alle 12:39:51 (`Get-Date`) il secondo `up -d` risponde `Started`. Alle 12:40:17 `ps` mostra `Created 25 seconds ago` e `Up 24 seconds (unhealthy)`: quindi era stato ricreato, anche se il messaggio non diceva `Recreated`.
    Misura precisa: `up -d --force-recreate` e un ciclo che controlla lo stato ogni secondo, dalle 12:42:48 alle 12:43:05: circa 17 secondi fino a `unhealthy`. Il ciclo non era previsto dalla traccia.

    Confronto con la risposta 6: lì la stima era per `db` (10 controlli × 10 s = 100 s). Qui applico la stessa formula con `retries: 3` e `interval: 5s`: 3 × 5 = 15 s. I 17 secondi misurati sono vicini, ma è una sola misura.

14. Rilancio `docker inspect --format "{{json .State.Health}}" prova-healthcheck-cache-1`. Guardo `Status`, `FailingStreak` e il `Log`.

    **Cosa ho visto:** `Status` è `unhealthy`, `FailingStreak` è `32`. Il container è rimasto `Up` mentre i fallimenti salivano a 32. Il `Log` ha solo le ultime 5 voci: tutte con `ExitCode: 1` e `Output` vuoto. Gli inizi sono a circa 5 secondi di distanza (11:45:13, 11:45:18, 11:45:23, 11:45:29, 11:45:34, in UTC). `FailingStreak` a 32 è coerente con il tempo passato: da 12:42:48 locali a questo controllo sono circa 2 minuti e 45 secondi, cioè circa 33 controlli a 5 secondi l'uno. Il conteggio continua finché il test fallisce, non si ferma a `retries`.

15. Controllo con `Get-Location`, poi `docker compose down`.

    **Cosa ho visto:** `Get-Location` finisce con `docker/prova-healthcheck`. `down` rimuove il contenitore `prova-healthcheck-cache-1` e la rete `prova-healthcheck_default`.

16. Per Orarium, solo la salute: `docker inspect --format "{{json .State.Health}}" orarium-db-1`. Annoto `Status`, `FailingStreak` e il `Log`.

    **Cosa ho visto:** `Status` è `starting`, `FailingStreak` è `0`. Il `Log` ha 5 controlli, tutti con `ExitCode: 0` e output `mysqladmin: [Warning] Using a password on the command line interface can be insecure.` seguito da `mysqld is alive`. Gli inizi sono a circa 10 secondi di distanza, come `interval: 10s`. Il `Log` è datato 2026-11-05 (UTC), mentre nell'esercizio 04 (passo 5) `docker ps` mostrava `orarium-db-1` come `Up 2 hours (healthy)`. La data di quell'osservazione non è scritta nel file. Non capisco ancora perché lo stato sia `starting` con 5 controlli riusciti. Poi, con `docker ps -a --filter "name=orarium"`, `orarium-db-1` e `orarium-redis-1` risultano `Exited (255) 36 minutes ago`: non sono più in esecuzione. Il motivo non lo so ancora (stesso `Exited (255)` già visto nell'esercizio 03). Si sono fermati alle 12:12 circa. Questo spiega perché non ci sono controlli recenti, ma non spiega perché l'ultimo controllo sia del 5 novembre né perché lo stato sia `starting`.

    **Osservazione:** su un contenitore fermo `docker inspect` mostra ancora la parte `Health` dell'ultima volta che ha girato, con `Status` `starting` e orari vecchi.

## Dopo l'esercizio

### Cosa ho fatto

Ho lavorato in due cartelle di prova. In `prova-variabili` ho provato il `.env` e la voce `environment:`, con `echo $SALUTO` e `echo $$SALUTO`, cambiando il valore del `.env`, la variabile della shell e togliendo la riga. In `prova-healthcheck` ho provato un Redis con `healthcheck`, prima sano e poi con un test che fallisce sempre, e ho guardato lo stato con `ps` e con `docker inspect`.

### Cosa ho verificato

- Compose sostituisce `${SALUTO}` con il valore del `.env` (passo 2).
- Se la variabile manca nel `.env`, Compose stampa un avviso e usa una stringa vuota (passo 5). La pagina Interpolation lo dice così: «If Compose can't resolve a substituted variable and no default value is defined, it displays a warning and substitutes the variable with an empty string.»
- Una variabile impostata nella shell vince sul `.env` (passo 6).
- Con `$$SALUTO` il contenitore stampa `ciao` (passo 3), in `COMMAND` compare `$SALUTO` (passo 4), e con un solo `$` la sostituzione la fa Compose (passo 7).
- L'esempio della pagina Interpolation, `command: "$$VAR_NOT_INTERPOLATED_BY_COMPOSE"`, corrisponde ai passi 2–4: usa `$$`.
- La pagina Interpolation dice che `$VARIABLE` e `${VARIABLE}` sono entrambi supportati: copre il passo 7, con un solo `$`.
- Quando cambio la configurazione, il contenitore viene ricreato: al passo 7 il messaggio dice `Recreated`. Non sempre lo dice: al passo 13 era `Started`, ma il contenitore risultava ricreato (`CREATED` di 25 secondi).
- `.env` e `backend/.env` sono ignorati da Git (passo 9).
- Lo stato passa da `starting` a `healthy` (passo 11), e nel `Log` di `State.Health` ci sono `ExitCode` e `Output` (passo 12).
- Il `Log` tiene solo le ultime 5 voci (passo 14).
- `docker inspect` mostra le variabili d'ambiente del contenitore nel campo `Config.Env` (visto con `prova-variabili-eco-1`, valore finto `SALUTO=ciao`; il campo l'ho letto con `--format`). Su Orarium non l'ho provato.
- Con un test che fallisce, il contenitore diventa `unhealthy` dopo circa 17 secondi misurati (passo 13), mentre resta `Up` e i fallimenti salgono a 32 (passo 14).
- L'immagine `redis:8.2.6` dichiara la porta `6379/tcp`: `docker image inspect redis:8.2.6 --format "{{json .Config.ExposedPorts}}"` restituisce `{"6379/tcp":{}}`. È la porta che `PORTS` mostra senza freccia (passo 11).
- L'immagine `mysql:8.4.13` dichiara `3306/tcp` e `33060/tcp`, con il comando `docker image inspect mysql:8.4.13 --format "{{json .Config.ExposedPorts}}"`. Con `orarium-db-1` fermo `PORTS` mostra `33060/tcp` e `127.0.0.1:3307->3306/tcp`; da `Up` mostra solo `127.0.0.1:3307->3306/tcp`. Il perché della differenza resta aperto.
- Il 15 novembre alle 15:55 ho riavviato `orarium-db-1`: `healthy` dopo 56 secondi, con un `Log` nuovo. Il `Log` ha 5 controlli, tutti con `ExitCode: 0`, con inizi alle 14:55:33, 14:55:44, 14:55:54, 14:56:04 e 14:56:15 UTC (cioè 15:55–15:56 ora locale). Le distanze sono di circa 10 o 11 secondi.

### Cosa ho dedotto e non ancora verificato

- I secrets sono più da configurare del necessario in locale (risposta 4).
- Il tempo per diventare `unhealthy` per `db` è circa 100 secondi (risposta 6).
- Togliere la shell da `db` e usare `CMD` farebbe fallire il controllo.
- Il motivo per cui al passo 13 il primo `up -d` ha risposto `Running` è che il file non era stato salvato: è solo un'ipotesi.
- `PORTS` mostra le porte dichiarate dall'immagine anche quando non sono pubblicate. È coerente con `80/tcp` di `prova-02` nell'esercizio 02, ma non l'ho letto su una pagina.

### Domande aperte

- Secrets o variabili d'ambiente per Orarium?
- `--env-file` e una variabile senza valore (`- VAR` in `environment`) non le ho provate.
- Perché `orarium-db-1` e `orarium-redis-1` sono `Exited (255)`.
- Perché nel passo 16 `Status` era `starting` con un `Log` del 5 novembre, mentre dopo il riavvio del 15 novembre il `Log` è nuovo?
- Perché alcune distanze tra i controlli sono diverse dall'`interval`: 5,9 s invece di 5 nel Redis di prova (più lunga), 9,1 s invece di 10 nel database di Orarium (più corta). La variazione è di circa un secondo rispetto all'`interval`.
- Cosa fa Docker con un contenitore `unhealthy`, oltre a mostrare l'etichetta: l'ho visto solo per circa due minuti e mezzo.

### Applicazione in Orarium

- [PR #89](https://github.com/francesco-cassese/orarium/pull/89), `docs(backend): explain the Docker health states and how to read them`: senza issue, un solo file (`backend/README.md`), una riga modificata e una aggiunta (nel diff: 2 inserzioni, 1 cancellazione).
- Nel README ho scritto i tre stati di salute che si vedono sotto `docker compose ps` (`starting`, `healthy`, `unhealthy`), e il comando `docker inspect --format "{{json .State.Health}}"` con l'avvertimento sulle password.
- Perché: il punto 4 dell'avvio diceva già di aspettare `healthy`, ma non spiegava cosa significasse.
- Fuori dal README, perché non serve a chi usa il progetto: i 17 secondi misurati, `Recreated` e le domande aperte.
- Provato solo con un valore finto: le password in `docker inspect`. Non detto nel README perché non provato: cosa succede a `db` dopo `unhealthy`.

## Fonti

- [Interpolation](https://docs.docker.com/reference/compose-file/interpolation/)
- [Set, use, and manage variables in a Compose file with interpolation](https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/)
- [Set environment variables within your container's environment](https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/)
- [Define services in Docker Compose](https://docs.docker.com/reference/compose-file/services/)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)