# AGENTS.md

Monorepo (**pnpm workspaces**) for Buscaminas (Minesweeper). Three packages:
- `apps/frontend` — Angular 22 SPA (`@buscaminas/frontend`)
- `apps/backend` — NestJS 11 + TypeORM + PostgreSQL API (`@buscaminas/backend`)
- `libs/shared` — `@buscaminas/shared`, **type-only** package (currently just `Level`)

`PLAN.md` describes the migration that produced this layout (Fases 0-8). Its appendix records the executed inventory and which phases remain. Treat un-checked items as TODO, not done.

## Git workflow

**`main` receives merges ONLY from `develop`.** Feature branches merge into `develop` first; `develop` is then fast-forwarded (or merged) into `main`. Never merge a feature/hotfix branch directly into `main`. Keep `develop` and `main` in sync after every merge to `main`.

## Commands

Package manager is **pnpm**. Don't use npm/yarn (even though `build:github` uses shell `cp`/`rm`, not `npm run`).

Run from repo root unless noted:

- `pnpm start` — Angular dev server at http://localhost:4200. Backend dev: `pnpm --filter @buscaminas/backend start:dev` (needs Postgres at localhost:5432 — `docker compose up -d` from `apps/backend/`).
- `pnpm build` — build all workspaces (`pnpm -r build`).
- `pnpm test` — run all suites. Frontend = Karma/Jasmine in **Chrome**, **watch by default**; backend = Jest one-shot.
- `pnpm lint` — runs `lint` only where present (backend; frontend has none).
- `pnpm build:github` — wipe root `docs/`, build frontend with `--base-href ./`, copy into `docs/` for GitHub Pages.
- Single-package: `pnpm --filter @buscaminas/frontend <script>` / `pnpm --filter @buscaminas/backend <script>`.
- One frontend spec: `pnpm --filter @buscaminas/frontend exec ng test --include='src/app/services/game.service.spec.ts'`. Non-interactive: add `--watch=false --browsers=ChromeHeadless`. On snap Chromium use `--browsers=ChromeHeadlessNoSandbox` (defined in `karma.conf.js`) and set `CHROME_BIN=/usr/bin/chromium-browser`.
- Backend migrations: `pnpm --filter @buscaminas/backend migrate` / `migration:down` / `migration:create`.

There is **no `typecheck` script**. Type errors surface via `build` (frontend AoT with `strictTemplates`; backend `nest build`).

### pnpm `allowBuilds` quirk

`pnpm-workspace.yaml` declares `allowBuilds: { esbuild: false, lmdb: false, ... }` for native deps. This is intentional — they ship prebuilt binaries via `optionalDependencies`, so their build scripts are skipped. **If pnpm errors with `ERR_PNPM_IGNORED_BUILDS` after adding a new native dep, add it under `allowBuilds: false`** (don't run `pnpm approve-builds` blindly — it would try to compile native code).

## Architecture

**Frontend** (`apps/frontend`, Angular 22):
- Standalone components only (no NgModules), bootstrapped via `bootstrapApplication`. Routes lazy-load with `loadComponent`.
- Signals throughout (`signal`, `computed`, `linkedSignal`, `effect`, `resource`). No NgRx.
- **`GameStore` (`src/app/store/game.store.ts`) is the single source of truth.** It holds `currentGame`/`currentBoxes` signals, derived selectors (`status`, `isGameOver`, `hasWon`, `flagsPlaced`, `numberOfMines`, `level`), and the actions `createGame`/`reveal`/`flag`/`chord`/`newGame`/`changeLevel`. After each action it merges the returned boxes into the board. `gameId` is a `linkedSignal` persisted in `localStorage` (`game-id`); a constructor `effect` reloads game+boxes when it changes.
- Services are thin wrappers, no game state: `GameService` (pure HttpClient over `/games`), `LevelService` (`httpResource` over `/level`), `TimerService` (display-only, derived from the store's `startedAt`/`endedAt`, ticks only while `PLAYING`).
- **No client-side mine logic** (Fase 6 done): `BoxesService` and `GameStateService` were deleted. The backend owns all mine/number state.
- Click wiring (Fase 6 done): `GameComponent.boxClicked` → `store.reveal(boxId)` (or `chord` when clicking a revealed numbered cell); `boxRightClicked` → `store.flag(boxId)`.
- `Box` model reflects the antitrampas contract: `hasMine?: boolean` (present only at game end or if revealed), `minesAroundQuantity: number | null` (null unless revealed).
- API base URLs in `src/environments/environment*.ts` (dev → `localhost:3000/api/v2/`, prod → Netlify function URL); only `gamesUri`/`levelsUri` remain.

**Backend** (`apps/backend`, NestJS 11):
- TypeORM + PostgreSQL, `synchronize: false` (migrations only). `DataSource` at `src/shared/utils/datasource.ts`; migrations at `src/database/migrations/` (note: `pnpm migrate` needs `ts-node --transpile-only -P tsconfig.json`, already in the scripts — TypeORM 0.3.30 loads the datasource via ESM `import()`).
- Global prefix `api/v2`, `ValidationPipe` with `class-validator` (`whitelist`, `forbidNonWhitelisted`, `transform`), `@nestjs/throttler` via `APP_GUARD` (`THROTTLE_TTL`/`THROTTLE_LIMIT` env). CORS via `CORS_ORIGINS` (csv), port via `PORT` (default 3000).
- **API is `/api/v2/games`** (refactored, PLAN.md Fase 5 done): `POST /games`, `GET /games/:id`, `DELETE /games/:id` (204/404), `GET /games/:id/boxes`, `PATCH /games/:id/{reveal,flag,chord}`. Request DTOs `{ boxId }`/`{ levelId }`; responses `GameResponseDto`, `BoxViewDto[]`, `ActionResultDto { game, boxes }`. Old `/game/...` endpoints are gone.
- Game logic server-side: `FrameService.initEmptyBoxes` (empty board) + `placeMinesAndNumbers` (first-click safe, avoids clicked region); `board.ts` pure helpers (`floodReveal`, `areAllNonMinesRevealed`, `adjacentFlagCount`); `GameService` orchestrates reveal/flag/chord with `INITIAL|PLAYING|WON|LOST`. Mines are placed on the **first reveal**, not at `createGame`.
- **Antitrampas enforced** in `game-mapper.ts` (`toBoxView`): `hasMine` only when the game ended (`LOST`/`WON`) or the cell is revealed; `minesAroundQuantity` only for revealed cells. On loss, the full board (all mines) is returned. Verified: `flag` on an unrevealed cell leaks nothing.
- Entities: `Game` (status, startedAt, createdAt, endedAt, wonAt, level M:1, boxes 1:N cascade) and `Box`. Schema is **relational**; PLAN.md's proposed `boardState jsonb` was explicitly **not** adopted.

**Shared** (`libs/shared`): type-only (interfaces). Consumed by frontend via `tsconfig.json` `paths` → `../../libs/shared/src/index.ts`. The backend declares the dep but doesn't import yet (its `Level` is a TypeORM entity with decorators — migrating is Fase 4 scope). Don't put runtime values here without a build step (the CommonJS backend can't `require` a `.ts`).

## Styling

**Tailwind CSS v4**, configured via `@import 'tailwindcss'` in `apps/frontend/src/styles.css` and `@tailwindcss/postcss` in `apps/frontend/.postcssrc.json`. **No `tailwind.config.js`** — don't assume v3 patterns.

## opencode MCP config

`opencode.jsonc` is gitignored because it contains local API keys. A template with env-var placeholders is at `opencode.jsonc.example`. To use it:

1. `cp opencode.jsonc.example opencode.jsonc`
2. Set `CONTEXT7_API_KEY` in your shell (or replace inline).

opencode substitutes `${VAR}` syntax with environment variables at runtime.

## Gotchas

- `docs/` (repo root) is a **committed build artifact** for GitHub Pages. `pnpm build:github` wipes and regenerates it. Don't hand-edit; regenerate.
- Package names are scoped (`@buscaminas/frontend` / `@buscaminas/backend` / `@buscaminas/shared`). `build:github` and `pnpm --filter` calls rely on them — don't rename casually.
- Backend `tsconfig.json` is **non-strict** (`strictNullChecks: false`, `noImplicitAny: false`, `target: ES2021`, `module: commonjs`); frontend `tsconfig.json` is `strict: true` (`target: ES2022`, `module: ES2022`, `moduleResolution: bundler`). They differ deliberately — don't unify without checking both apps still compile.
- `apps/backend/.env` is the only place with DB creds (local `postgres/postgres`); it's gitignored. Copy from someone or set from `docker-compose.yaml` defaults.
- `pnpm --filter @buscaminas/backend lint` is currently **broken**: ESLint 10 (in `package.json`) dropped `.eslintrc.*` support and needs an `eslint.config.js` flat config (only a legacy `.eslintrc.js` exists). Preexisting tooling issue, not addressed by the Fase 5 backend refactor. `build` + `test` are the reliable gates for the backend.
- `createGame` must set `createdAt: new Date()` explicitly — the `@CreateDateColumn` decorator doesn't auto-populate on `save` here (the `created_at` column has no DB default and is NOT NULL). Don't remove that line.
