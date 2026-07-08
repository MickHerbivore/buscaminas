# AGENTS.md

Monorepo (**pnpm workspaces**) for Buscaminas (Minesweeper). Three packages:
- `apps/frontend` — Angular 21 SPA (`@buscaminas/frontend`)
- `apps/backend` — NestJS 11 + TypeORM + PostgreSQL API (`@buscaminas/backend`)
- `libs/shared` — `@buscaminas/shared`, **type-only** package (currently just `Level`)

`PLAN.md` describes the migration that produced this layout (Fases 0-8). Its appendix records the executed inventory and which phases remain. Treat un-checked items as TODO, not done.

## Commands

Package manager is **pnpm**. Don't use npm/yarn (even though `build:github` uses shell `cp`/`rm`, not `npm run`).

Run from repo root unless noted:

- `pnpm start` — Angular dev server at http://localhost:4200. Backend dev: `pnpm --filter @buscaminas/backend start:dev` (needs Postgres at localhost:5432 — `docker compose up -d` from `apps/backend/`).
- `pnpm build` — build all workspaces (`pnpm -r build`).
- `pnpm test` — run all suites. Frontend = Karma/Jasmine in **Chrome**, **watch by default**; backend = Jest one-shot.
- `pnpm lint` — runs `lint` only where present (backend; frontend has none).
- `pnpm build:github` — wipe root `docs/`, build frontend with `--base-href ./`, copy into `docs/` for GitHub Pages.
- Single-package: `pnpm --filter @buscaminas/frontend <script>` / `pnpm --filter @buscaminas/backend <script>`.
- One frontend spec: `pnpm --filter @buscaminas/frontend exec ng test --include='src/app/services/game.service.spec.ts'`. Non-interactive: add `--watch=false --browsers=ChromeHeadless`.
- Backend migrations: `pnpm --filter @buscaminas/backend migrate` / `migration:down` / `migration:create`.

There is **no `typecheck` script**. Type errors surface via `build` (frontend AoT with `strictTemplates`; backend `nest build`).

### pnpm `allowBuilds` quirk

`pnpm-workspace.yaml` declares `allowBuilds: { esbuild: false, lmdb: false, ... }` for native deps. This is intentional — they ship prebuilt binaries via `optionalDependencies`, so their build scripts are skipped. **If pnpm errors with `ERR_PNPM_IGNORED_BUILDS` after adding a new native dep, add it under `allowBuilds: false`** (don't run `pnpm approve-builds` blindly — it would try to compile native code).

## Architecture

**Frontend** (`apps/frontend`, Angular 21):
- Standalone components only (no NgModules), bootstrapped via `bootstrapApplication`. Routes lazy-load with `loadComponent`.
- Signals throughout (`signal`, `computed`, `linkedSignal`, `effect`, `resource`). No NgRx.
- Game state is split across two paths — **read both before refactoring**:
  - `src/app/store/game.store.ts` — newer signal store (`linkedSignal` + `resource` loader). Prefer for new work.
  - `src/app/services/*.service.ts` — older services (`GameService`, `BoxesService`, `LevelService`, `TimerService`). `GameService` has commented-out handlers and overlaps with the store.
- **Client-side mine logic still present** in `BoxesService` (`putMines`, `putNumbers`, `rotateNeighbours`, `initializeBoxes`), still called via `GameService.resetGame()`. This is the antichess hole pending removal (PLAN.md Fase 6). `GameComponent.boxClicked/boxRightClicked` are stubs (`console.log`) — click→API wiring not done.
- API base URLs in `src/environments/environment*.ts` (dev → `localhost:3000/api/v2/`, prod → Netlify function URL). `gameId` persisted in `localStorage` key `game-id`.
- `Level` type now lives in `@buscaminas/shared`; `src/app/interfaces/level.interface.ts` re-exports it.

**Backend** (`apps/backend`, NestJS 11):
- TypeORM + PostgreSQL, `synchronize: false` (migrations only). `DataSource` at `src/shared/utils/datasource.ts`; migrations at `src/database/migrations/`.
- Global prefix `api/v2`, `ValidationPipe` with `class-validator`, CORS enabled.
- Game logic server-side: `FrameService.buildBoxesFrame` (board+mines+adjacency), `BoxService.rotateAdjacentBoxes` (flood-fill), `GameService` (`INITIAL|PLAYING|LOST` — missing `WON`).
- **Known antitrampas leaks** (pending fix, PLAN.md Fase 5): `BoxService.findAllByGameId` nulls `minesArroundQuantiy` of unrevealed boxes but **does not strip `hasMine`** → client can see all mines via `GET /game/:id/boxes`. No full reveal on loss. No `@nestjs/throttler`. No `endedAt`.
- Entities: `Game` (status, startedAt, createdAt, level M:1, boxes 1:N cascade) and `Box`. Schema is **relational**; PLAN.md's proposed `boardState jsonb` was explicitly **not** adopted (see PLAN.md appendix).

**Shared** (`libs/shared`): type-only (interfaces). Consumed by frontend via `tsconfig.json` `paths` → `../../libs/shared/src/index.ts`. The backend declares the dep but doesn't import yet (its `Level` is a TypeORM entity with decorators — migrating is Fase 4 scope). Don't put runtime values here without a build step (the CommonJS backend can't `require` a `.ts`).

## Styling

**Tailwind CSS v4**, configured via `@import 'tailwindcss'` in `apps/frontend/src/styles.css` and `@tailwindcss/postcss` in `apps/frontend/.postcssrc.json`. **No `tailwind.config.js`** — don't assume v3 patterns.

## Gotchas

- `docs/` (repo root) is a **committed build artifact** for GitHub Pages. `pnpm build:github` wipes and regenerates it. Don't hand-edit; regenerate.
- These identifier names are part of the API contract between frontend and backend — **do not "fix" them blindly** (they match DB columns):
  - `minesArroundQuantiy` (sic: misspelled "Around" + "Quantity"; DB column `mines_arround_quantity`)
  - `isRotated` actually means "revealed" (DB column `id_rotated` — sic)
- Package names are scoped (`@buscaminas/frontend` / `@buscaminas/backend` / `@buscaminas/shared`). `build:github` and `pnpm --filter` calls rely on them — don't rename casually.
- Backend `tsconfig.json` is **non-strict** (`strictNullChecks: false`, `noImplicitAny: false`, `target: ES2021`, `module: commonjs`); frontend `tsconfig.json` is `strict: true` (`target: ES2022`, `module: ES2022`, `moduleResolution: bundler`). They differ deliberately — don't unify without checking both apps still compile.
- `apps/backend/.env` is the only place with DB creds (local `postgres/postgres`); it's gitignored. Copy from someone or set from `docker-compose.yaml` defaults.
