# Diario dei comandi: Docker

| Data | Comando | Cosa fa (parole mie) | Cosa ho visto | Fonte |
|---|---|---|---|---|
| 2026-11-09 | `docker image ls` | mostra le immagini principali sul mio pc, con nome, tag e dimensione | Otto immagini `catalog-backend` dal corso Azure (registry azure del corso, tag da `:19` a `:37`, più `:ud14-local`). Due con la **U** (in uso): `mysql:8.4.13` e `redis:8.2.6`, usate da Orarium, verificato in compose.yaml (vedi riga sotto) | [docker image ls](https://docs.docker.com/reference/cli/docker/image/ls/) |
| 2026-11-09 | `Select-String -Path ..\orarium\compose.yaml -Pattern "image:"` | cerca le righe che contengono un testo dentro un file: `-Path` indica il file in cui cercare, `-Pattern` il testo da trovare | image: mysql:8.4.13 (riga 4) e image: redis:8.2.6 (riga 22) in compose.yaml | [Select-String](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string?view=powershell-7.4) |