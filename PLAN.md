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
  - `BoxService.rotateAdjacentBoxes` → flood-fill recursivo sobre celdas con `minesArroundQuantiy === 0`.
  - `GameService` → `INITIAL | PLAYING | LOST` (falta `WON`), arranca timer con `startedAt`.
  - `class-validator` vía `ValidationPipe` global; CORS habilitado (`app.enableCors()`).
- **Fugas antitrampas reales a corregir (Fase 5 hardening)**:
  - `BoxService.findAllByGameId` solo nullea `minesArroundQuantiy` de celdas no reveladas; **no strip-ea `hasMine`** → el cliente ve todas las minas vía `GET /game/:id/boxes`.
  - No revela todas las minas al perder.
  - No hay `@nestjs/throttler`.
  - Falta `endedAt` en la entidad `Game` (la tabla `games` tampoco tiene esa columna).
- **Endpoints actuales vs. objetivo del plan**: hoy son `POST /game`, `GET /game/:id`, `DELETE /game/:id`, `GET /game/:id/boxes`, `PATCH /game/:id/boxes/:boxId`. El plan propone `/games/:id/{reveal,chord,flag,state}`. Es una refactorización de API, no una creación desde cero.
- Identificadores contractuales a **no "corregir"**: `minesArroundQuantiy` (sic), `isRotated` (= "revealed"), columna `id_rotated` (sic en DB). Coinciden frontend y backend.

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
