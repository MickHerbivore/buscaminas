# Plan: migración a monorepo con backend antitrampas

## Contexto

Queremos evitar que el usuario pueda conocer las posiciones de las minas desde el navegador. La solución pasa por trasladar toda la lógica sensible a un backend y unificar frontend + backend + tipos compartidos en un monorepo gestionado con pnpm workspaces. **Este plan no asume nada sobre el contenido actual de los repos existentes**: se parte de una fase de inventario para descubrirlo antes de actuar.

## Decisiones tomadas

| Aspecto | Decisión |
|---|---|
| Repo base | Reutilizar el repo del frontend (ya se llama `buscaminas`) |
| Importación del backend | `git subtree` (conserva historial) |
| Reestructuración frontend | `git mv` (commit de reorganización) |
| Gestor de paquetes | pnpm workspaces |
| Backend objetivo | NestJS + TypeScript |
| Persistencia | PostgreSQL (con TypeORM) |
| Frontend | Sigue siendo SPA (sin SSR) |
| Calidad día 1 | CI en GitHub Actions (sin hooks locales) |
| Repo backend antiguo | Archivar (solo lectura) |

> Si el inventario (Fase 0) revela que el backend existente **no** es NestJS/TypeScript, se abrirá una decisión: migrarlo a NestJS, o mantener su stack y ajustar el plan. Mientras tanto se asume el objetivo NestJS.

## Estructura final

```
buscaminas/
├── package.json              ← scripts agregados (build/test/lint -r)
├── pnpm-workspace.yaml
├── .gitignore
├── .github/workflows/ci.yml
├── apps/
│   ├── frontend/
│   └── backend/
└── libs/
    └── shared/               ← paquete @buscaminas/shared (DTOs y tipos)
```

## Fases

### Fase 0 — Inventario de los repos existentes

Sin tocar código, documentar para ambos repos:

- **Stack y versiones**: lenguaje, framework, runtime, gestor de paquetes, TypeScript/Node.
- **Estructura de carpetas** y puntos de entrada.
- **Lógica de juego existente**: dónde se calculan minas, adyacencias, flood-fill, victoria/derrota; qué se ejecuta en cliente vs. servidor.
- **Modelos de datos**: tipos/interfaces que representan casillas, partida, dificultad.
- **Persistencia actual** del backend (si alguna): BD, ORM, migraciones.
- **Tests**: qué framework, qué cobertura, qué comandos.
- **Build/CI existente**: scripts de `package.json`, workflows de GitHub Actions, configs de lint/format.
- **Dependencias** relevantes y posibles conflictos de versiones entre frontend y backend.
- **Secretos / variables de entorno** declarados (`.env.example`, configs).

Resultado: un breve documento (puede ser sección en este mismo `PLAN.md` o issue) que confirme o refute las decisiones de la tabla y sirva de base a las fases siguientes.

### Fase 1 — Reubicar el frontend

```bash
git clone <url-de-buscaminas> buscaminas
cd buscaminas
mkdir -p apps/frontend libs/shared
git mv -k $(ls -A | grep -vE '^(apps|libs)$') apps/frontend/
git commit -m "chore: move frontend into apps/frontend for monorepo layout"
git push origin main
```

### Fase 2 — Importar el backend con `git subtree`

```bash
git remote add backend-old https://github.com/MickHerbivore/buscaminas-v2.git
git subtree add --prefix=apps/backend backend-old main
git remote rm backend-old
git push origin main
```

El historial del backend queda preservado dentro de `apps/backend/`.

### Fase 3 — Configurar pnpm workspaces y `libs/shared`

- [ ] Crear `package.json` raíz con scripts `pnpm -r` (build, test, lint).
- [ ] Crear `pnpm-workspace.yaml`:
  ```yaml
  packages:
    - "apps/*"
    - "libs/*"
  ```
- [ ] Crear `libs/shared/package.json` como `@buscaminas/shared`.
- [ ] **Tras el inventario**, mover a `libs/shared/src` los tipos/DTOs comunes que convenga compartir entre frontend y backend (modelos de casilla, estado de partida, dificultad, payloads de la API).
- [ ] Añadir `@buscaminas/shared` como dependencia en `apps/frontend` y `apps/backend` vía `pnpm --filter ... add @buscaminas/shared`.

### Fase 4 — Postgres + TypeORM en el backend

- [ ] En `apps/backend`: verificar la configuración existente de TypeORM y el driver `pg` (según el inventario). Alinear versiones con el resto del workspace si hace falta.
- [ ] Definir entidad objetivo:
  ```typescript
  @Entity()
  @Index(['status'])
  export class Game {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    difficulty: string;

    @Column({ default: 'idle' }) // idle | playing | won | lost
    status: string;

    @Column() rows: number;
    @Column() cols: number;
    @Column() mines: number;

    @Column({ type: 'jsonb' }) // minas + celdas reveladas (NUNCA se envía al cliente tal cual)
    boardState: unknown;

    @CreateDateColumn({ nullable: true, type: 'timestamptz' })
    startedAt: Date | null;

    @Column({ nullable: true, type: 'timestamptz' })
    endedAt: Date | null;
  }
  ```
- [ ] Crear migración inicial con TypeORM (`synchronize: false` en todos los entornos; los cambios de esquema van por migraciones).
- [ ] Añadir `.env.example` con `DATABASE_URL` (o las variables que use TypeORM: `DB_HOST`, `DB_PORT`, etc.) — nunca el `.env` real.
- [ ] Registrar `TypeOrmModule` en el `AppModule` y configurar `ConfigModule`/`ConfigService` para leer variables de entorno.

### Fase 5 — Trasladar la lógica de minas al backend

- [ ] Identificar en el frontend (gracias al inventario) toda la lógica sensible: generación del tablero, colocación de minas, cálculo de adyacentes, revelado en cascada, detección de victoria/derrota.
- [ ] Mover esa lógica al backend (módulo/servicio de juego en NestJS) y **eliminarla del frontend**.
- [ ] Implementar endpoints objetivo:
  ```
  POST   /games              → crea partida, devuelve { gameId, rows, cols, mines }
  POST   /games/:id/reveal   → { row, col } → { revealedCells, status, mineHit? }
  POST   /games/:id/chord    → { row, col } → igual que reveal
  POST   /games/:id/flag     → { row, col } → { flaggedCount }
  GET    /games/:id/state    → estado solo de celdas ya conocidas por el cliente
  ```
- [ ] **Regla crítica**: el servidor nunca devuelve `isMine` ni `adjacentMines` de celdas no reveladas, salvo al perder (entonces sí, para revelar todas).
- [ ] DTOs de request/response en `libs/shared` para no duplicar tipos.
- [ ] Validación con `class-validator`.
- [ ] CORS habilitado para el origen del frontend (dev y prod).
- [ ] Rate limiting básico con `@nestjs/throttler`.

### Fase 6 — Refactorizar el frontend

- [ ] Sustituir el servicio de juego local por llamadas HTTP (`HttpClient` de Angular o el cliente que use el frontend).
- [ ] Asegurar que el modelo de casilla del cliente **no** contiene `isMine` ni `adjacentMines` hasta que se revelan.
- [ ] Flujo: primer click → `POST /games` (el servidor crea el tablero y aplica el reveal) → guardar `gameId` → en cada jugada, llamar al endpoint correspondiente con ese `gameId`.
- [ ] Gestionar estados de carga y errores de red (toast/reintentar).
- [ ] El timer pasa a correr solo en el cliente para display; el servidor registra `startedAt`/`endedAt` para evitar trampa de tiempo.

### Fase 7 — CI en GitHub Actions

- [ ] Workflow `.github/workflows/ci.yml` que se ejecute en push/PR a `main`:
  - `pnpm install --frozen-lockfile`
  - `pnpm -r lint`
  - `pnpm -r test`
  - `pnpm -r build`
- [ ] Para el backend, arrancar un contenedor Postgres en el job y pasar `DATABASE_URL`.
- [ ] Proteger `main`: requerir CI verde + 1 aprobación (si hay equipo).

### Fase 8 — Cerrar el repo backend antiguo

- [ ] En el repo backend original: actualizar README apuntando al nuevo monorepo.
- [ ] **Settings → Archive** (lo deja solo lectura, conserva issues/PRs/historial).

## Checklist final

- [ ] Inventario completado y decisiones confirmadas.
- [ ] Frontend reubicado bajo `apps/frontend/`.
- [ ] Backend importado con `git subtree` (historial preservado).
- [ ] `pnpm install` desde la raíz funciona.
- [ ] `@buscaminas/shared` referenciado por ambas apps.
- [ ] Postgres + TypeORM con migración aplicada.
- [ ] Endpoints del juego operativos; cliente nunca recibe `isMine` de celdas ocultas.
- [ ] Frontend consume API, no calcula minas.
- [ ] CI verde en `main`.
- [ ] Repo backend antiguo archivado.

## Riesgos y consideraciones

- **Stack del backend desconocido**: si no es NestJS/TS, la Fase 0 fuerza una decisión (migrar vs. mantener) que puede cambiar el cronograma.
- **Versiones de TypeScript**: mantener Angular y NestJS en TS compatibles para no romper `libs/shared`.
- **Conflictos de dependencias** entre frontend y backend al unificar workspaces (detectar en Fase 0).
- **CORS en desarrollo**: frontend en `:4200`, backend en `:3000`; configurar orígenes permitidos.
- **Esquema TypeORM**: mantener `synchronize: false` en todos los entornos; cualquier cambio de esquema debe ir por migración para evitar derivas entre local/CI/prod.
- **Latencia por jugada**: añadir feedback de carga para evitar dobles clicks.
- **Trampa de tiempo**: usar `startedAt`/`endedAt` del servidor para puntuaciones, no el timer del cliente.
- **Sesiones huérfanas**: definir una política de limpieza (`endedAt` o expiración por inactividad).
- **Secretos**: nunca commitear `.env`; usar secretos del proveedor de despliegue.

## Fuera de alcance (futuras iteraciones)

- SSR Angular (solo si se necesita SEO/landing).
- Autenticación de usuarios (si se quieren rankings o partidas multi-dispositivo).
- Cacheo distribuido (Redis) si se añade escalado horizontal.

---

## Apéndice — Fase 0: Resultado del inventario (ejecutado)

Inventario ejecutado contra el frontend (`buscaminas`, este repo) y el backend (`buscaminas-v2`, clonado en `../buscaminas-v2`, HEAD `39bdca5`). **Refuta varias decisiones de la tabla** y redefine el alcance de las fases posteriores.

### Backend (`buscaminas-v2`) — confirmaciones y desviaciones

- **Stack confirmado**: NestJS 11 + TypeScript 5.9 + TypeORM 0.3 + PostgreSQL (`pg`) + Jest 30. La decisión "NestJS + TS" de la tabla queda confirmada; no hay que migrar de stack.
- **TypeORM ya configurado correctamente**: `synchronize: false` + tabla `typeorm_migrations` + CLI de migraciones (`migration:create`, `migrate`, `migration:down`) + `DataSource` en `src/shared/utils/datasource.ts`. Migraciones existentes bajo `src/database/migrations/v0.0.1/{DDL,DML}/` (tablas `levels`, `games`, `boxes` + seed de levels).
- **Esquema RELACIONAL, no jsonb**: el backend usa `games` + `boxes` (One-To-Many con `onDelete: CASCADE`). **Decisión**: mantener el modelo relacional; la Fase 4 queda como hardening, **no** como migración al `boardState jsonb` de una sola fila que propone el plan. Motivo: el modelo actual funciona, está normalizado y la regla antitrampas se puede cumplir con proyección de DTOs.
- **La Fase 5 ya está implementada en el backend**:
  - `FrameService.buildBoxesFrame` → genera tablero, coloca minas, calcula adyacentes.
  - `BoxService.rotateAdjacentBoxes` → flood-fill recursivo sobre celdas con `minesAroundQuantity === 0`.
  - `GameService` → `INITIAL | PLAYING | LOST` (falta `WON`), arranca timer con `startedAt`.
  - `class-validator` vía `ValidationPipe` global; CORS habilitado (`app.enableCors()`).
- **Fugas antitrampas reales a corregir (Fase 5 hardening)**:
  - `BoxService.findAllByGameId` solo nullea `minesAroundQuantity` de celdas no reveladas; **no strip-ea `hasMine`** → el cliente ve todas las minas vía `GET /game/:id/boxes`.
  - No revela todas las minas al perder.
  - No hay `@nestjs/throttler`.
  - Falta `endedAt` en la entidad `Game` (la tabla `games` tampoco tiene esa columna).
- **Endpoints actuales vs. objetivo del plan**: hoy son `POST /game`, `GET /game/:id`, `DELETE /game/:id`, `GET /game/:id/boxes`, `PATCH /game/:id/boxes/:boxId`. El plan propone `/games/:id/{reveal,chord,flag,state}`. Es una refactorización de API, no una creación desde cero.
- Identificadores contractuales antes sic, **ya corregidos** en la pila completa (entidad, DTOs, mapper, servicios, tests, frontend y DDL `v0.0.1` editada in situ): `minesAroundQuantity`/`mines_around_quantity` (desde `Arround…Quantiy`) y `isRevealed`/`is_revealed` (desde `isRotated`/`id_rotated` — el campo siempre significó "revealed"). Ver apéndice Fase 6.

### Frontend (`buscaminas`) — la Fase 6 está en curso

- 3 commits locales sin push (`1101d43`, `3bd41da`, `834ca8b`) ya implementan parte de la Fase 6: `GameStore` nuevo (signals + `resource`), carga de `Game` y boxes desde la API, redirección por `gameId` persistido.
- **Lógica sensible aún viva en el cliente** (objetivo de eliminación de la Fase 6): `BoxesService.initializeBoxes/putMines/putNumbers/rotateNeighbours/getNumberOfMinesAround`, y `initializeBoxes()` sigue siendo invocado desde `GameService.resetGame()` → `prepareGame()`.
- **Wiring click→API incompleto**: `GameComponent.boxClicked/boxRightClicked` son stubs (`console.log`). Falta llamar a `PATCH /game/:id/boxes/:boxId`.

### Decisiones derivadas (registradas)

| Decisión del plan | Resolución tras inventario |
|---|---|
| Fase 4: entidad `Game` con `boardState jsonb` | **Desestimado** — mantener esquema relacional. Fase 4 = hardening (`endedAt`, fix fuga `hasMine`, `WON`, throttler). |
| Fase 5: trasladar lógica de minas al backend | **Ya hecho** en el backend. Pendiente solo hardening + eliminación de la lógica espejo en el frontend (Fase 6). |
| `git push origin main` en Fases 1-2 | **Sustituido** por rama `chore/monorepo-migration` sin push (revisión previa). |
| Alcance de esta ejecución | **Fases 1-3** (restructure monorepo) + este inventario. Fases 4-8 fuera de esta pasada. |
| Fase 8: archivar `buscaminas-v2` | Pendiente (operación manual en GitHub UI). |

## Apéndice — Fase 5 (hardening backend): Ejecutado

Refactor del backend para que la API funcione como un Buscaminas antitrampas completo. **Alcance: solo backend** (la adaptación del frontend se registró después en la Fase 6 — ver su apéndice).

### API nueva (`/api/v2/games`)

| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| POST | `/games` | `{ levelId }` | `GameResponseDto` (201) |
| GET | `/games/:id` | — | `GameResponseDto` |
| GET | `/games/:id/boxes` | — | `BoxViewDto[]` |
| PATCH | `/games/:id/reveal` | `{ boxId }` | `ActionResultDto` |
| PATCH | `/games/:id/flag` | `{ boxId }` | `ActionResultDto` |
| PATCH | `/games/:id/chord` | `{ boxId }` | `ActionResultDto` |
| DELETE | `/games/:id` | — | 204 (404 si no existe) |

Eliminados: `POST /game`, `GET /game/:id`, `DELETE /game/:id`, `GET /game/:id/boxes`, `PATCH /game/:id/boxes/:boxId`, `/game/start/`, `/game/reset-timer/`.

### Reglas de juego implementadas
- **First-click safe**: las minas se generan en el primer `reveal` (no en `createGame`), excluyendo la celda clicada y sus 8 vecinas. `createGame` crea celdas vacías.
- **Victoria**: todas las no-minas reveladas → `status=WON`, `endedAt` y `wonAt`.
- **Derrota**: revelar una mina → `status=LOST`, `endedAt`, y se devuelven **todas las minas** (snapshot final completo).
- **Chord**: celda revelada con N banderas adyacentes (N = su número) abre el resto de adyacentes; si una bandera está mal puesta → derrota.
- `ensurePlayable`: 409 si la partida ya está `LOST`/`WON`.

### Antitrampas (capa `game-mapper.ts`)
- `hasMine` **solo** se serializa si el juego terminó (`LOST`/`WON`) o la celda ya está revelada. Antes, `PATCH .../boxes/:boxId` tras un `FLAG` devolvía `hasMine` → leak explotable (cerrado).
- `minesAroundQuantity` solo en celdas reveladas; `null` en el resto.
- Verificado en vivo: `flag` sobre celda no revelada no filtra `hasMine`; al perder se exponen las 99 minas (Expert).

### Schema — migración `v0.0.2`
- `games.ended_at`, `games.won_at` (nullable).
- `UNIQUE (game_id, row, column)` en `boxes`.
- No se añadió índice redundante `boxes(game_id)` (el unique compuesto ya cubre el prefijo en PG).
- Entidad `Game.status` anotada con `type: 'varchar'` (el union `GameStatusType` reflejaba como `Object` y rompía TypeORM).

### Hardening transversal
- `@nestjs/throttler` con `APP_GUARD` (`THROTTLE_TTL`/`THROTTLE_LIMIT` por env, default 60 req/min).
- `ValidationPipe` con `forbidNonWhitelisted: true`.
- CORS por `CORS_ORIGINS` (csv); puerto por `PORT` (default 3000).
- `LevelService.findById` con `await` + `NotFoundException`.

### Fixes preexistentes descubiertos al arrancar
- **Orden de migraciones**: `CreateTableBoxes` tenía un timestamp de clase (`1772566143263`) menor que `CreateTableGames`, por lo que `boxes` se creaba antes que `games` y fallaba la FK. Alineado el nombre de clase al filename (`1772566539522`).
- **CLI de migraciones roto**: TypeORM 0.3.30 carga el datasource vía `import()` ESM, donde `__dirname` no existe. Reescrito `datasource.ts` con `process.cwd()`. Además, `ts-node` no aplicaba `experimentalDecorators` en esa carga ESM; los scripts `migrate`/`migration:down` ahora usan `ts-node --transpile-only -P tsconfig.json`.
- **`entities` glob** del datasource original apuntaba a `src/shared/**` (no encontraba entidades); corregido a `src/**/*.entity`.

### Verificación
- `pnpm --filter @buscaminas/backend build` ✔
- Tests unitarios: 45 OK (board, frame, box, game, controller, level).
- E2E: 7 OK (contrato HTTP + validación).
- Smoke en vivo contra Postgres: `level → create → reveal (first-click safe) → flag (sin leak) → loss (reveal de 99 minas)` ✔.

### Pendiente / fuera de esta pasada
- **Fase 6 (frontend)**: ✅ completada después — ver apéndice "Fase 6 (frontend)".
- **Lint**: `pnpm lint` está roto por ESLint 10 (requiere `eslint.config.js` flat; hay `.eslintrc.js` legacy). Preexistente, no abordado en este refactor.
- `uuid` y `dotenv` siguen en `package.json` aunque `UuidService` (que usaba `uuid`) se eliminó por ser código muerto. `dotenv` sí se usa en `datasource.ts`.

## Apéndice — Fase 6 (frontend): Ejecutado

Migración del frontend a la API `/games` y eliminación de toda la lógica de minas client-side. El frontend queda como cliente fino sobre el backend.

### Cambios principales
- **`GameStore`** es la única fuente de verdad: signals `currentGame`/`currentBoxes`, selectors derivados (`status`, `isGameOver`, `hasWon`, `flagsPlaced`, `numberOfMines`, `level`), y acciones `createGame`/`reveal`/`flag`/`chord`/`newGame`/`changeLevel`. Tras cada acción hace merge (por `id`) de las boxes devueltas en `ActionResultDto` y actualiza el game.
- **`GameService`** pasa a ser un wrapper HTTP puro (sin estado) sobre `/games`: `create`/`get`/`delete`/`getBoxes`/`reveal`/`flag`/`chord`.
- **`TimerService`** es solo display: derivado del `startedAt`/`endedAt` del store; hace tick únicamente mientras `status === PLAYING`.
- **Wiring de clicks**: `GameComponent.boxClicked` → `store.reveal(boxId)` (o `store.chord(boxId)` si la celda revelada tiene número) y `boxRightClicked` → `store.flag(boxId)`. Bindings de `flagsPlaced`/`numberOfMines`/`isGameOver`/`hasWon` desde el store.
- **Eliminados**: `BoxesService` (`putMines`/`putNumbers`/`rotateNeighbours`/`initializeBoxes`/`patchBoxes`/`putBoxes`) y `GameStateService` (derivación client-side de win/loss).
- **`ResetButton`/`ChangeLevelButton`** delegan al store (`newGame` / `changeLevel`).
- **Tipos/contract**: `Box` con `hasMine?` y `minesAroundQuantity: number | null`; `GameResponse` con `status`/`startedAt`/`endedAt`/`wonAt` (sin boxes); `ActionResult { game, boxes }`. Environments simplificados a `gamesUri`/`levelsUri`.
- Limpieza de `properties` (`LEVELS` y `ACTION_*` ya sin uso).
- **Corrección de typo cross-cutting**: `minesArroundQuantiy`/`mines_arround_quantity` → `minesAroundQuantity`/`mines_around_quantity` en toda la pila (entidad, DTOs, mapper, servicios, tests, contract del frontend, y DDL de la migración `v0.0.1`). Al ser pre-producción con DB solo de dev, se editó la migración original in situ (siguiendo el mismo criterio que la corrección de orden de `CreateTableBoxes`).
- **Corrección de concepto cross-cutting**: `isRotated`/`id_rotated` → `isRevealed`/`is_revealed` en toda la pila. El campo siempre significó "revealed" (nunca "rotated"); además el prefijo `id_` pasaba a `is_` para coincidir con `is_flagged`. Mismo criterio: DDL `v0.0.1` editada in situ.

### Verificación
- `pnpm --filter @buscaminas/frontend build` ✔ (AoT con `strictTemplates`).
- `ng test`: 15/15 ✔ (ChromeHeadless). Se arreglaron además specs scaffold preexistentes que fallaban por `input.required` no provisto y un `<h1>` obsoleto.

### Pendiente
- Smoke runtime conjunto no re-ejecutable en el sandbox de desarrollo (Postgres se cayó; docker requiere sudo). El contrato HTTP ya estaba validado en la Fase 5 con los mismos endpoints que el frontend ahora consume. Para jugar: `docker compose up -d` desde `apps/backend/`, `pnpm --filter @buscaminas/backend migrate`, y `pnpm start`.

