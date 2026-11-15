# 06 - Due servizi con `depends_on`

Nell'esercizio 05 ho visto `healthcheck` e `(healthy)`. Qui li uso per fare aspettare un servizio da un altro.

## Teoria

### L'idea

Finora ho lavorato con un servizio alla volta. Un'applicazione vera ne ha almeno due: Orarium ha `db` e `redis`, e il backend Laravel parla con il database. Se l'applicazione parte prima del database, trova la porta chiusa e fallisce. `depends_on` dice a Compose in che ordine avviare e fermare i servizi.

Un paragone dal laboratorio di pasticceria: non si guarnisce una torta quando il forno è solo acceso, ma quando il pan di Spagna è cotto e raffreddato. "Acceso" e "pronto" sono due cose diverse, e il `healthcheck` è il modo di Compose per controllare se è pronto.

### Cosa fa `depends_on`

- Ordine: Compose crea i servizi in ordine di dipendenza e li rimuove in ordine inverso (prima chi dipende, poi chi è dipeso).
- Sintassi breve: una lista di nomi di servizi. Compose garantisce che quei servizi siano **avviati**, ma non aspetta che siano `healthy`.
- Sintassi lunga: una mappa per ogni dipendenza, con le chiavi `condition`, `restart` e `required`.

### Le tre condizioni

| `condition` | Cosa vuol dire |
|---|---|
| `service_started` | come la sintassi breve: basta che il servizio sia partito |
| `service_healthy` | il `healthcheck` del servizio da cui dipendo deve essere passato |
| `service_completed_successfully` | il servizio da cui dipendo deve finire il suo lavoro con successo («run to successful completion»). Mia lettura, da verificare: uscire con codice 0 |

Le altre due chiavi: `restart: true` riavvia il servizio che dipende quando Compose aggiorna o riavvia l'altro (non copre il riavvio automatico del runtime dopo che un container muore); `required: false` fa dare solo un avviso se la dipendenza non è avviata o disponibile (il valore predefinito è `true`).

### Cosa la pagina non dice

- Cosa succede se uso `service_healthy` su un servizio che non ha un `healthcheck`.
- Cosa fa `docker compose up -d` se il servizio da cui dipendo non diventa mai `healthy`, e dopo quanto tempo.
- Cosa succede a un servizio che dipende da un altro quando quest'ultimo, già avviato, diventa `unhealthy`.

### In Orarium

Il `compose.yaml` di Orarium ha `db` e `redis`, ciascuno con il suo `healthcheck`, ma nessun `depends_on`: i due servizi sono indipendenti, e l'applicazione Laravel gira fuori da Docker. Il `healthcheck` per ora serve a me, per sapere quando sono pronti (punto 4 del README).

## Dalla documentazione (parole originali)

Pagina «Control startup and shutdown order in Compose»:

> On startup, Compose does not wait until a container is "ready", only until it's running.

> `service_healthy`. This specifies that a dependency is expected to be "healthy", which is defined with `healthcheck`, before starting a dependent service.

> Compose waits for healthchecks to pass on dependencies marked with `service_healthy`. `db` is expected to be "healthy" (as indicated by `healthcheck`) before `web` is created.

> Compose also removes services in dependency order. `web` is removed before `db` and `redis`.

Pagina «Define services in Docker Compose», sezione `depends_on`:

> With short syntax, Compose does not wait for dependency services to be "healthy" before starting a dependent service.

> `service_completed_successfully`: Specifies that a dependency is expected to run to successful completion before starting a dependent service.

> `restart`: When set to `true` Compose restarts this service after it updates the dependency service. This applies to an explicit restart controlled by a Compose operation, and excludes automated restart by the container runtime after the container dies.

> `required`: When set to `false` Compose only warns you when the dependency service isn't started or available. If it's not defined the default value of `required` is `true`.

## Con parole mie

1. Un servizio `app` ha `depends_on: - db` con la sintassi breve. Cosa è garantito quando parte `app` e cosa no? Fai un esempio tuo di cosa può andare storto e dì che è tuo.

**Risposta:**

- **Garantito:** `db` parte prima di `app`. Compose lo avvia per primo.
- **Non garantito:** che `db` sia pronto. La pagina dice che con la sintassi breve Compose non aspetta lo stato `healthy`. Visto nel passo 4: `app` era già `Exited (0)` mentre `lento` era ancora `starting`.
- **Esempio mio (non provato):** al primo avvio MySQL crea utente e database. Se `app` parte in quel momento, la connessione può fallire, anche se `db` è già `Up`.

2. Cosa cambia scrivendo invece `depends_on: db: condition: service_healthy`? Che cosa deve avere il servizio `db` perché abbia senso? Cosa deduci se manca, tenendo separato ciò che dice la pagina?

**Cosa dice la pagina:** con `service_healthy` Compose aspetta che il `healthcheck` di `db` passi, poi crea il servizio che dipende da lui.

**Cosa cambia per Orarium:** `app` parte solo quando `db` è `healthy`, non appena è `Up`.

**Cosa serve:** `db` deve avere un `healthcheck`. In Orarium c'è (esercizio 05).

**Visto (passo 13):** senza `healthcheck`, `up -d` fallisce subito con `has no healthcheck configured`, dopo circa 2 secondi. Compose non aspetta. La pagina non dice cosa succede in questo caso: lo lascio tra le cose che la pagina non dice.

3. Se `db` non diventa mai `healthy`, cosa ti aspetti che faccia `docker compose up -d`? Scrivila come ipotesi: la mettiamo alla prova nell'esercizio.

**Ipotesi:**

- Subito: nessun errore, aspetta che `db` diventi `healthy`.
- Se non succede mai: alla fine un errore sulla dipendenza non pronta, e `app` non parte.
- Non so quanto aspetta prima di arrendersi. Questo è il punto da provare nell'esercizio.

**Esito nell'esercizio:**

- Con `db` che diventa `healthy` (passo 8): `up -d` aspetta e non dà errore. Come ipotizzato.
- Con `lento` che non diventa mai `healthy` (passo 11): errore dopo 35 secondi, con `is unhealthy`. Come ipotizzato.
- Nel caso `unhealthy` non è verificato cosa succede ad `app`: il `app-1` del passo 12 è quello del tentativo precedente. Nei casi senza `healthcheck` (passo 13) e con `exit 1` di `service_completed_successfully` (passo 15), `app` è rimasto `Created`.

4. Per ciascuna delle tre condizioni, descrivi un caso (in Orarium o in laboratorio) in cui sceglieresti proprio quella.

**Risposta** (esempi miei, non provati):

- **`service_started`**: il servizio ha bisogno che l'altro sia partito, ma non che sia pronto. Esempio mio: un `proxy` che inoltra le richieste a un `backend`. Il proxy parte appena il backend è `Up`; se il backend non è ancora pronto, le prime richieste possono fallire.
- **`service_healthy`**: il servizio usa il database. Esempio: il backend Laravel di Orarium. Aspetta che il `healthcheck` di `db` passi (esercizio 05).
- **`service_completed_successfully`**: il servizio deve finire il lavoro. Esempio: un `migrate` che lancia `php artisan migrate` e termina con codice 0. Il backend parte solo dopo. Oggi le migrazioni le lancio a mano dalla cartella `backend/`. La condizione l'ho vista nei passi 14 e 15: con codice 0 `app` parte, con codice 1 l'`up` fallisce e `app` resta `Created`.

5. A cosa serve `restart: true`, e cosa la pagina dice che non copre? Un container che diventa `unhealthy` rientra in quel caso? Cosa dice la pagina e cosa no?

**Risposta:**

- **A cosa serve:** riavvia il servizio che dipende quando Compose riavvia o aggiorna la dipendenza.
- **Non copre (dalla pagina):** il riavvio automatico del runtime quando il container muore da solo.
- **`unhealthy` rientra?** La pagina non dice di sì. È solo uno stato del `healthcheck`.
- **Deduzione (non provata):** un `unhealthy` non fa scattare `restart: true`. Da verificare.

6. Con `docker compose down`, in che ordine vengono rimossi `web` e `db`, e perché ha senso?

**Risposta:**

- **Ordine (dalla pagina):** `web` viene rimosso prima di `db` e `redis`. Visto nei passi 6 e 10: prima `app-1`, poi `lento-1`, poi la rete.
- **Perché ha senso (deduzione, non provata):** `web` usa `db`. Se `db` si ferma prima, `web` resterebbe senza database mentre ancora gira. Togliere prima chi dipende evita questo.

7. Orarium oggi non usa `depends_on`: perché non serve adesso, e in quale caso futuro lo useresti? Un'ipotesi tua.

**Risposta:**

- **Perché non serve adesso (dal file):** `db` e `redis` sono indipendenti, e il backend Laravel gira fuori da Docker. Nessun servizio aspetta un altro.
- **Quando lo userei (ipotesi mia, non provata):** se il backend finisse in un container nel `compose.yaml`. Lì gli metterei `depends_on` con `service_healthy` su `db`, così non parte prima che il database sia pronto.

## Esercizio: la traccia

Lavoro in una cartella di prova, `docker/prova-depends-on`: il nome della cartella diventa il nome del progetto. Uso solo `alpine` (ce l'ho già) e valori finti. Prima di ogni `docker compose down` controllo con `Get-Location`. Il `down` ha impiegato 3,3 s per un container in esecuzione, e 0,0 s per uno già fermo.

### Parte A: la sintassi breve

1. Controllo se `depends_on` c'è nel `compose.yaml` di Orarium: `Select-String -Path ..\orarium\compose.yaml -Pattern "depends_on"`. Annoto se compare qualcosa.

   **Cosa ho visto:** `Select-String` non trova nessuna riga. Nel `compose.yaml` di Orarium `depends_on` non c'è, come già scritto nella teoria.

2. Creo `docker/prova-depends-on` e dentro un `compose.yaml` scritto da me, con due servizi. `lento`: immagine `alpine`, comando `["sh", "-c", "sleep 15; touch /tmp/pronto; sleep 3600"]` e un `healthcheck` con `test: ["CMD-SHELL", "test -f /tmp/pronto"]`, `interval: 3s`, `timeout: 2s`, `retries: 10`. `app`: immagine `alpine`, comando `["sh", "-c", "echo partito"]` e `depends_on` con la sintassi breve su `lento`. Mi sposto con `cd docker\prova-depends-on` e controllo con `Get-Location`.

   **Cosa ho visto:** `cd` ok. `Get-Location` finisce con `docker/prova-depends-on`. Il `compose.yaml` ha i due servizi come descritto sopra.

3. `docker compose config`. Guardo come è scritto `depends_on` di `app` rispetto al file.

   **Cosa ho visto:** nel file ho scritto la sintassi breve (`- lento`). Nel `config` diventa la forma lunga: `lento` con `condition: service_started` e `required: true`. Compose completa da solo i valori predefiniti. `lento` ha `healthcheck` con `test` come `CMD-SHELL` e `test -f /tmp/pronto`, `interval` 3s, `timeout` 2s, `retries` 10.

4. `Get-Date; docker compose up -d; Get-Date`. Annoto le due ore e cosa stampa `up -d`. Subito dopo `docker compose ps -a`: stato di `lento` e di `app`.

   **Cosa ho visto:** alle 16:21:16 parte `up -d`; alle 16:21:17 finisce. Stampa rete `prova-depends-on_default` creata, poi `lento` e `app` avviati (`Started`). Subito dopo: `app` è `Exited (0)` (con `echo partito`), `lento` è `Up` con `(health: starting)`. Quindi `app` è già uscito mentre `lento` non è ancora `healthy`: la sintassi breve non ha aspettato il `healthcheck`.

5. Aspetto circa 20 secondi e rilancio `docker compose ps -a`, poi `docker compose logs app`. Annoto lo stato finale di `lento` e cosa ha stampato `app`.

   **Cosa ho visto:** `app` è `Exited (0)` da 42 secondi. `lento` è `Up 42 seconds (healthy)`. `docker compose logs app` stampa `app-1  | partito`. `app` è partito prima che `lento` diventasse `healthy`, e il suo output è quello atteso.

6. Controllo con `Get-Location`, poi `docker compose down`. Annoto l'ordine delle righe che compaiono.

   **Cosa ho visto:** `Get-Location` finisce con `docker/prova-depends-on`. L'ordine delle righe è: `app-1` rimosso (0.0 s), poi `lento-1` rimosso (3.3 s), poi la rete. Quindi `app` viene rimosso prima di `lento`, come nella risposta 6 (il dipendente prima). `lento` ha impiegato 3.3 s, non i 10 s che avevo ipotizzato nella traccia.

### Parte B: `service_healthy`

7. Nel `compose.yaml` cambio `depends_on` di `app` alla sintassi lunga: `lento` con `condition: service_healthy`. Lancio `docker compose config` e confronto con il passo 3.

   **Cosa ho visto:** nel `config` la condizione di `lento` è passata da `service_started` a `service_healthy`. `required` resta `true`. Il resto (il `healthcheck` di `lento`, il comando, l'immagine) è uguale al passo 3.

8. Prima dell'`up` scrivo come ipotesi quanto ci metterà il comando (la mia risposta 3). Poi `Get-Date; docker compose up -d; Get-Date`. Annoto le due ore e le righe stampate.

   **Cosa ho visto:** alle 16:25:03 parte `up -d`. Il `Network` è creato, poi `lento-1` diventa `Healthy` dopo 16.3 s, e solo dopo `app-1` è `Started` (16.4 s). Alle 16:25:19 `ps -a` mostra `app-1` `Exited (0)` e `lento-1` `Up 16 seconds (healthy)`. Quindi `up -d` ha aspettato che `lento` fosse `healthy` prima di avviare `app`. Questo conferma l'ipotesi della risposta 3 per il caso in cui il servizio diventa `healthy`; il caso in cui non lo diventa è la parte C. Il passo 9 con `docker compose logs app` stampa `app-1  | partito`.

9. `docker compose ps -a` e `docker compose logs app`. Confronto con i passi 4 e 5.

   **Cosa ho visto:** `docker compose ps -a` del passo 8: `app-1` `Exited (0)`, `lento-1` `Up 16 seconds (healthy)`. `docker compose logs app` stampa `partito`. Rispetto ai passi 4 e 5 il comando è lo stesso, ma `app` è partito dopo che `lento` era `healthy`.

10. Controllo con `Get-Location`, poi `docker compose down`. Annoto l'ordine delle righe e lo confronto con il passo 6 e con la risposta 6.

    **Cosa ho visto:** `Get-Location` finisce con `docker/prova-depends-on`. L'ordine è lo stesso del passo 6: `app-1` rimosso (0.0 s), poi `lento-1` (3.3 s), poi la rete. Stesso ordine con entrambe le condizioni, quindi la condizione non cambia la rimozione. Il tempo di `lento` è uguale al passo 6 (3.3 s).

### Parte C: un servizio che non diventa mai `healthy`

11. Nel `compose.yaml` cambio il `test` di `lento` in `["CMD-SHELL", "exit 1"]`. Prima scrivo l'ipotesi: dopo quanti secondi succede qualcosa e cosa (risposta 3, con `retries: 10` e `interval: 3s`). Poi `Get-Date; docker compose up -d; Get-Date`. Annoto le ore e il messaggio.

    **Cosa ho visto:** il primo `up -d` (16:27:30) era identico al passo 8, perché il test non era ancora cambiato. Alle 16:28:59 parte `up -d`. Dopo 35.0 s, alle 16:29:34, esce l'errore: `Error dependency lento failed to start`, con il messaggio `dependency failed to start: container prova-depends-on-lento-1 is unhealthy`. Nel file il `test` di `lento` è `["CMD-SHELL", "exit 1"]`, come da passo 11.
    Confronto con la stima: 10 tentativi a 3 s l'uno fanno circa 30 s, più il tempo dei controlli. 35 s è vicino, ma la stima l'ho fatta dopo il risultato, non prima: l'ipotesi scritta prima non è nel file.

12. `docker compose ps -a`. Annoto lo stato di `lento` e se `app` esiste. Poi controllo con `Get-Location` e lancio `docker compose down`.

    **Cosa ho visto:** `lento-1` è `Up 2 minutes (unhealthy)`. `app-1` è `Exited (0) 3 minutes ago`, ma è il container del tentativo precedente (16:27:30). Da questo `ps` non so se `app` sia stato avviato nell'`up` fallito.

    Poi `Get-Location` finisce con `docker/prova-depends-on` e `docker compose down` rimuove `app-1` (0.0 s), `lento-1` (3.3 s) e la rete. Stesso ordine dei passi 6 e 10.

### Parte D: due casi che la pagina non spiega

13. Nel `compose.yaml` tolgo il blocco `healthcheck` da `lento` (il resto resta uguale) e lascio `condition: service_healthy` in `app`. Prima scrivo l'ipotesi su cosa succede (risposta 2). Poi `Get-Date; docker compose up -d; Get-Date`. Annoto il messaggio e i tempi, poi `docker compose ps -a` e `docker compose down`.

    **Cosa ho visto:** nel file ora `lento` non ha più `healthcheck`, e `app` ha ancora `condition: service_healthy`. Alle 16:36:24 parte `up -d`. Dopo circa 2 secondi (16:36:26) esce l'errore: `dependency failed to start: container prova-depends-on-lento-1 has no healthcheck configured`. Compose non ha aspettato: ha fallito subito. `app-1` risulta `Created`, non `Started`. Prima di questa prova ci sono state due prove non valide: alle 16:33:27 non so cosa contenesse il file; alle 16:34:45 `app` dipendeva da un servizio non definito, `lento`, perché `lento` era stato cancellato. Con `docker compose ps -a` (51 secondi dopo): `app-1` è `Created`, cioè mai avviato; `lento-1` è `Up 50 seconds`, senza stato di salute, perché non ha più `healthcheck`. Poi `Get-Location` finisce con `docker/prova-depends-on` e `docker compose down` rimuove `app-1` (0.0 s), `lento-1` (3.3 s) e la rete. Stesso ordine dei passi 6, 10 e 12.

14. Cambio `lento` con il comando `["sh", "-c", "sleep 5; echo fatto"]` e in `app` metto `condition: service_completed_successfully`. Il `healthcheck` non serve in questa prova: lo lascio fuori. Prima scrivo l'ipotesi: `app` parte? quando? Poi `Get-Date; docker compose up -d; Get-Date`, `docker compose ps -a` e `docker compose logs lento app`. Annoto stati, codici di uscita e tempi, poi `docker compose down`.

    **Cosa ho visto:** nel file `lento` ha `command: ["sh", "-c", "sleep 5; echo fatto"]` e `app` ha `condition: service_completed_successfully`. Il `healthcheck` non c'è, ed è voluto: in questa prova non serve.
    Alle 16:40:10 parte `up -d`. Dopo 5.8 s `lento-1` è `Exited`; dopo 5.9 s `app-1` è `Started`. Alle 16:40:17 `ps -a` mostra entrambi `Exited (0)` con meno di un secondo di distanza. Quindi `app` è partito solo dopo che `lento` ha finito con codice 0.
    Poi `Get-Location` finisce con `docker/prova-depends-on` e `docker compose down` rimuove `app-1` (0.0 s), `lento-1` (0.0 s) e la rete (0.2 s). `lento-1` è stato rimosso in 0.0 s, contro i 3.3 s dei passi precedenti: adesso era già `Exited`, non stava più dormendo.
    Seconda prova, con `Get-Content compose.yaml`: il file conferma che `lento` non ha `healthcheck`. `up -d` alle 16:42:58 dura 5.8 s: `lento-1` `Exited`, `app-1` `Started`. Alle 16:43:04 entrambi sono `Exited (0)`. Stesso risultato della prima prova.

15. In `lento` cambio il comando in `["sh", "-c", "sleep 5; exit 1"]` (il resto uguale). Scrivo l'ipotesi: `app` parte? Cosa stampa `up -d`? Poi `Get-Date; docker compose up -d; Get-Date`, `docker compose ps -a`, poi `Get-Location` e `docker compose down`.

    **Cosa ho visto:** prima il `down` che chiude la seconda prova del 14: rimuove `app-1` (0.0 s), `lento-1` (0.0 s) e la rete (0.2 s). Poi `Get-Content compose.yaml` conferma `sleep 5; exit 1` e `service_completed_successfully` in `app`. Alle 16:44:17 `up -d`: dopo 5.8 s `lento-1` dà errore `service "lento" didn't complete successfully: exit 1`. `app-1` è `Created`, mai avviato. Con `ps -a` alle 16:44:23: `lento-1` `Exited (1)`, `app-1` `Created`. Quindi con codice 1 `app` non parte e l'`up` fallisce.

## Dopo l'esercizio

### Verificato

- Sintassi breve = `service_started`: la `config` la mostra così (passo 3).
- La sintassi breve non aspetta che il servizio sia `healthy` (passi 4 e 5).
- `service_healthy` aspetta il `healthcheck`: con `lento` che diventa `healthy` dopo 16.3 s, `app` parte solo dopo (passo 8).
- Ordine di `down`: prima il dipendente, poi chi è dipeso (passi 6, 10, 12, 13, 14).
- Con `healthcheck` che non passa mai (`exit 1`), `up -d` dà errore dopo circa 35 s, con `is unhealthy` (passo 11). Dopo l'errore Compose non ha rimosso `lento`: restava `Up 2 minutes (unhealthy)` (passo 12).
- Senza `healthcheck`, con `service_healthy`, `up -d` dà errore subito, con `has no healthcheck configured` (passo 13).
- `service_completed_successfully` parte con codice 0 (passo 14) e dà errore con codice 1, lasciando `app` `Created` (passo 15).
- `depends_on` non c'è nel `compose.yaml` di Orarium (passo 1).

### Dedotto, non provato

- `restart: true` con un servizio `unhealthy` non fa scattare il riavvio.
- `required: false` non l'ho provato.

### Domande aperte

- Perché il timeout è 35 s e non 30 s (10 tentativi a 3 s)?
- Cosa succede se la dipendenza diventa `unhealthy` quando il servizio dipendente è già partito?
- Cosa succede ad `app` quando `lento` diventa `unhealthy`?
- Perché il `down` ha impiegato 3,3 s per `lento-1` nei passi precedenti, e 0,0 s nei passi 14 e 15?

### Applicazione in Orarium

Nessuna PR da fare su Orarium: nel `compose.yaml` non ci sono servizi che dipendono da altri. È una scelta, non un'assenza di lavoro.

## Fonti

- [Control startup and shutdown order in Compose](https://docs.docker.com/compose/how-tos/startup-order/)
- [Define services in Docker Compose](https://docs.docker.com/reference/compose-file/services/)