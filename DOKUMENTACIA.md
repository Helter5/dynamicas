# Technická dokumentácia – CAS Konzola

## Popis projektu

Webová aplikácia pre spúšťanie CAS (Computer Algebra System) príkazov a riadiacich simulácií (Inverted Pendulum, Ball and Beam) v jednom prostredí. Používatelia sú anonymne identifikovaní cez cookie token. Štatistiky využívania animácií sú dostupné v admin sekcii.

---

## Technológie

| Vrstva    | Technológia                        |
|-----------|------------------------------------|
| Backend   | PHP 8.4, Laravel 11                |
| Frontend  | React 19, TypeScript, Vite         |
| Databáza  | SQLite                             |
| CAS motor | GNU Octave (`octave-cli`)          |
| Kontajner | Docker, Docker Compose             |

---

## Požiadavky na server

- Docker >= 24
- Docker Compose >= 2
- Prístup na porty 8000 (API) a 5173 (frontend)
- Outbound HTTP na `ip-api.com` (geolokácia, port 80) – voliteľné, zlyhanie je non-fatal

---

## Nainštalované programy a knižnice

### V Docker image `api` (Alpine Linux)

Inštalované cez `apk`:

| Balík            | Účel                            |
|------------------|---------------------------------|
| `octave`         | CAS výpočty a simulácie         |
| `git`, `unzip`   | Composer závislosti             |
| `libzip-dev`     | PHP zip rozšírenie              |
| `icu-dev`        | PHP intl rozšírenie             |
| `oniguruma-dev`  | PHP mbstring rozšírenie         |
| `sqlite-dev`     | PHP pdo_sqlite rozšírenie       |
| `libpng-dev`, `libjpeg-turbo-dev`, `freetype-dev`, `libxml2-dev` | PHP gd rozšírenie |

PHP rozšírenia: `pdo`, `pdo_sqlite`, `mbstring`, `intl`, `zip`, `gd`

Composer (PHP balíky): viď `apps/api/composer.json`  
npm balíky: viď `apps/web/package.json`

### V Docker image `web` (Node 20 Alpine)

Štandardné Node.js prostredie, žiadne dodatočné systémové balíky.

---

## Konfigurácia

Všetky nastavenia sa definujú v jednom súbore: `apps/api/.env`  
Šablóna: `apps/api/.env.example`

| Premenná                          | Popis                                                   | Default        |
|-----------------------------------|---------------------------------------------------------|----------------|
| `API_KEY`                         | Tajný kľúč pre autorizáciu API requestov               | –              |
| `ALLOWED_ORIGINS`                 | CORS whitelist (čiarkou oddelené URL)                   | localhost:5173 |
| `CAS_DRIVER`                      | `mock` (dummy odpovede) alebo `octave` (reálny výpočet) | `mock`         |
| `CAS_OCTAVE_BINARY`               | Cesta k Octave binárke                                  | `octave-cli`   |
| `CAS_TIMEOUT_SECONDS`             | Max čas behu Octave skriptu                             | `8`            |
| `CAS_COOLDOWN_SECONDS`            | Cooldown medzi CAS requestmi na token                   | `10`           |
| `CAS_MAX_SCRIPT_BYTES`            | Max veľkosť CAS skriptu                                 | `50000`        |
| `SIMULATION_RATE_LIMIT`           | Max simulácií za okno (throttle)                        | `30`           |
| `SIMULATION_STATS_INTERVAL_SECONDS` | Min interval pre zápis novej štatistiky (per token)  | `600`          |
| `SIMULATION_DELAY_MS`             | Umelé oneskorenie simulácie v ms (debug)               | `0`            |
| `VITE_API_BASE_URL`               | Verejná adresa API (z pohľadu browsera)                 | –              |
| `VITE_API_PROXY_TARGET`           | Interná adresa API pre Vite proxy                       | `http://api:8000` |
| `VITE_ALLOWED_HOSTS`              | Hostname na ktorom beží frontend                        | `node56.webte.fei.stuba.sk` |

---

## Databáza

SQLite súbor sa vytvorí automaticky pri štarte kontajnera:

```
apps/api/database/database.sqlite
```

Schéma (DDL): `apps/api/database/schema/sqlite-schema.sql`

Migrácie sa spúšťajú automaticky pri štarte (`php artisan migrate --force`).  
Žiadne seed dáta nie sú potrebné – aplikácia funguje s prázdnou databázou.

---

## Spustenie

```bash
# 1. Skopíruj konfiguráciu
cp apps/api/.env.example apps/api/.env

# 2. Nastav povinné premenné v apps/api/.env:
#    APP_KEY=  (vygeneruj: docker run --rm php:8.4-cli php -r "echo 'base64:'.base64_encode(random_bytes(32));")
#    API_KEY=  (ľubovoľný tajný reťazec)
#    CAS_DRIVER=octave  (pre reálne výpočty)
#    ALLOWED_ORIGINS=https://tvoja-domena.sk
#    VITE_API_BASE_URL=https://tvoja-domena.sk:8000

# 3. Spusti
docker compose up --build -d
```

Frontend beží na porte `5173`, API na porte `8000`.

---

## Zmeny konfigurácie servera

Na serveri `node56.webte.fei.stuba.sk` neboli vykonané žiadne priame zmeny mimo Docker kontajnerov. Všetko beží v izolovaných kontajneroch.

Jediná požiadavka na server: otvorené porty 5173 a 8000.

---

## Rozdelenie úloh

| Úloha                                          | Riešiteľ         |
|------------------------------------------------|------------------|
| Backend API (Laravel) – CAS, simulácie, logy  | [Meno]           |
| Frontend (React) – UI, grafy, animácie        | [Meno]           |
| Docker konfigurácia a deployment               | [Meno]           |
| Štatistiky a geolokácia                        | [Meno]           |

---

## Nesplnené úlohy

Všetky požadované funkcionality boli implementované.

---

## Adresa projektu

- **Deployment:** https://node56.webte.fei.stuba.sk
- **Repozitár:** [doplniť URL]
