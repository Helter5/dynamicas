# Technická dokumentácia

**Projekt:** CAS Konzola  
**URL:** https://node56.webte.fei.stuba.sk  
**Repozitár:** https://github.com/Helter5/dynamicas

---

## Čo to robí

Webová aplikácia s dvoma hlavnými funkciami:
- spúšťanie CAS príkazov cez GNU Octave
- spúšťanie riadiacich simulácií (Inverted Pendulum, Ball and Beam) s grafmi a 3D animáciou

Používatelia sú anonymní, identifikovaní cookie tokenom. Štatistiky spustení sú v sekcii Štatistiky.

---

## Stack

- **Backend:** PHP 8.4, Laravel 11
- **Frontend:** React 19, TypeScript, Vite
- **Databáza:** SQLite
- **CAS:** GNU Octave (`octave-cli`)
- **Deployment:** Docker, Docker Compose

---

## Inštalované programy a knižnice

Všetko beží v Docker kontajneroch. Na serveri nie je nič inštalované priamo.

### API kontajner (`php:8.4-cli-alpine`)

Systémové balíky nainštalované cez `apk`:

```
octave, git, unzip, libzip-dev, icu-dev, oniguruma-dev,
sqlite-dev, libpng-dev, libjpeg-turbo-dev, freetype-dev, libxml2-dev
```

PHP rozšírenia: `pdo`, `pdo_sqlite`, `mbstring`, `intl`, `zip`, `gd`

PHP balíky (Composer): viď `apps/api/composer.json`

### Web kontajner (`node:20-alpine`)

npm balíky: viď `apps/web/package.json`

---

## Konfigurácia

Konfigurácia je v jednom súbore: `apps/api/.env` (šablóna: `apps/api/.env.example`)

Povinné premenné:

| Premenná | Popis |
|----------|-------|
| `APP_KEY` | Laravel šifrovací kľúč |
| `API_KEY` | Kľúč pre autorizáciu API requestov |
| `ALLOWED_ORIGINS` | CORS whitelist (čiarkou oddelené URL) |
| `CAS_DRIVER` | `octave` pre reálne výpočty, `mock` pre testovanie |
| `VITE_API_BASE_URL` | Verejná adresa API |

Voliteľné premenné:

| Premenná | Default | Popis |
|----------|---------|-------|
| `CAS_OCTAVE_BINARY` | `octave-cli` | Cesta k Octave |
| `CAS_TIMEOUT_SECONDS` | `8` | Max čas behu Octave skriptu |
| `CAS_COOLDOWN_SECONDS` | `10` | Cooldown medzi CAS requestmi (per token) |
| `CAS_MAX_SCRIPT_BYTES` | `50000` | Max veľkosť CAS session skriptu |
| `SIMULATION_RATE_LIMIT` | `30` | Max simulácií za rate-limit okno |
| `SIMULATION_STATS_INTERVAL_SECONDS` | `600` | Min interval zápisu štatistiky (per token) |

---

## Spustenie

```bash
cp apps/api/.env.example apps/api/.env
# vyplň APP_KEY, API_KEY, ALLOWED_ORIGINS, CAS_DRIVER=octave, VITE_API_BASE_URL

docker compose up --build -d
```

Frontend: port `5173`, API: port `8000`

Databáza (SQLite) a migrácie sa spustia automaticky pri štarte kontajnera.  
Schéma: `apps/api/database/schema/schema-dump.sql`

---

## Zmeny na serveri

Žiadne priame zmeny na serveri. Iba otvorené porty 5173 a 8000.

---

## Rozdelenie úloh

| Úloha | Riešiteľ |
|-------|----------|
| Backend – CAS, simulácie, API, databáza | [Gabriel Kanocz, Samuel Bagín] |
| Frontend – UI, grafy, 3D animácie | [Samuel Bagín, Gabriel Kanocz] |
| Docker, deployment, štatistiky | [Gabriel Kanocz] |
| Video | [Samuel Bagín] |

---