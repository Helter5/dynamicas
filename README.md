# Dynamicas

Stav projektu k 30. 3. 2026.

## Co je uz hotove

- Monorepo struktura je nastavena (`apps/api`, `apps/web`).
- API v Laraveli bezi a ma endpoint na health check.
- API key ochrana funguje (`X-API-KEY`).
- CAS endpoint na vyhodnotenie prikazu funguje (`POST /api/cas/eval`).
- CAS stav sa uklada per user token (`X-ANON-TOKEN`), teda premenne vedia prezit medzi requestami.
- Reset CAS stavu funguje (`DELETE /api/cas/state`).
- Export logov do CSV funguje.
- CAS evaluator ma prepinatelny driver (mock / octave).
- Frontend konzola v Reacte funguje.
- Frontend ma SK/EN prepinanie a routy s jazykom (`/sk/console`, `/en/console`).
- Na frontende je pridane tlacidlo na reset stavu.
- Zakladne testy su doplnene a vacsina scenarov je pokryta.
- Cooldown/throttle pre CAS requesty je hotovy (konfigurovatelny cez `CAS_COOLDOWN_MINUTES`).
- Docker Compose setup je hotovy (API + web).

## Co este treba spravit

- Simulacie:
  - inverted pendulum (backend + frontend vizualizacia)
  - ball and beam (backend + frontend vizualizacia)
- Grafy pre simulacie (casove priebehy, stavove veliciny).
- Frontend UX polish:
  - historia prikazov
  - lepsi feedback pri chybach/loadingu
- Realne otestovanie Octave runnera na lokalnom prostredi.
- Kratka produktova/technicka dokumentacia (OpenAPI alebo aspon jasne API notes).

## Najblizsi logicky krok

- Command history vo web konzole

## Spustenie cez Docker

- V roote projektu spusti:
  - `docker compose up --build`
- API bude na `http://localhost:8000`
- Web bude na `http://localhost:5173`
- Zastavenie stacku:
  - `docker compose down`
