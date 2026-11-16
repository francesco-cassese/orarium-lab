# Diario dei comandi: Vitest

| Data | Comando | Cosa fa (parole mie) | Dove l'ho usato | Fonte |
|---|---|---|---|---|
| 2026-11-16 | `node -v` | Stampa la versione di Node. | Esercizio 01, passo 1 | [Node.js, opzioni da riga di comando](https://nodejs.org/api/cli.html) («Print node's version.»; pagina della v26.13.1, la mia è la v24.16.0) |
| 2026-11-16 | `pnpm init` | Crea un `package.json`; se esiste già, il comando fallisce. | Esercizio 01, passo 2 | [pnpm init](https://pnpm.io/cli/init) |
| 2026-11-16 | `pnpm add -D vitest` | Installa un pacchetto e quelli da cui dipende. `-D` lo mette tra le `devDependencies`, cioè le dipendenze che servono solo mentre sviluppo. | Esercizio 01, passo 2 | [pnpm add](https://pnpm.io/cli/add) (pagina della versione più recente; la mia è la 11.28.12) |
| 2026-11-16 | `pnpm why vite` | Mostra tutti i pacchetti che dipendono da quello indicato. | Esercizio 01, passo 2: sotto `vitest@5.1.0` compare `vite@8.3.8` | [pnpm why](https://pnpm.io/cli/why) |
| 2026-11-16 | `git status --short -uall` | Mostra lo stato in formato breve. `-uall` fa elencare anche i singoli file dentro le cartelle non tracciate. | Esercizio 01, controllo di `node_modules` | [git status](https://git-scm.com/docs/git-status) |
| 2026-11-16 | `pnpm exec vitest run` | Esegue un comando dentro il progetto e aggiunge `node_modules/.bin` al PATH: per questo trova `vitest`. Con `run` i test girano una volta e poi il comando si ferma. | Esercizio 01, passi 3–6 e 8 | [pnpm exec](https://pnpm.io/cli/exec), [Vitest CLI](https://vitest.dev/guide/cli) |
| 2026-11-16 | `pnpm exec vitest` | Esegue un comando dentro il progetto e aggiunge `node_modules/.bin` al PATH: per questo trova `vitest`. Senza `run` resta acceso in modo watch. | Esercizio 01, passo 7 | [pnpm exec](https://pnpm.io/cli/exec), [Vitest CLI](https://vitest.dev/guide/cli) |
| 2026-11-16 | `Rename-Item` | Cambia il nome di un elemento, senza toccarne il contenuto. | Esercizio 01, passi 7 e 8 | [Rename-Item](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/rename-item) |