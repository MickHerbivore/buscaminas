import { computed, effect, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { ActionResult, GameResponse } from '../interfaces/game.interface';
import { Box } from '../interfaces/box.interface';
import { STORAGE_GAME_ID } from '../properties/properties';
import { GameService } from '../services/game.service';

@Injectable({ providedIn: 'root' })
export class GameStore {
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  private readonly _gameId = linkedSignal<string | null>(() =>
    localStorage.getItem(STORAGE_GAME_ID),
  );

  private readonly _game = signal<GameResponse | null>(null);
  private readonly _boxes = signal<Box[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly gameId = this._gameId.asReadonly();
  readonly currentGame = this._game.asReadonly();
  readonly currentBoxes = this._boxes.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly errorMessage = this._error.asReadonly();

  readonly level = computed(() => this._game()?.level ?? null);
  readonly status = computed(() => this._game()?.status ?? null);
  readonly isGameOver = computed(
    () => this.status() === 'LOST',
  );
  readonly hasWon = computed(() => this.status() === 'WON');
  readonly flagsPlaced = computed(() =>
    this._boxes().filter((b) => b.isFlagged).length,
  );
  readonly numberOfMines = computed(
    () => this._game()?.level?.minesQuantity ?? 0,
  );

  constructor() {
    effect(() => {
      const id = this._gameId();
      if (id) void this.loadGame(id);
    });
  }

  async createGame(levelId: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const game = await firstValueFrom(
        this.gameService.createGame({ levelId }),
      );
      localStorage.setItem(STORAGE_GAME_ID, game.id);
      this._gameId.set(game.id);
      this.router.navigate(['game']);
    } catch (err) {
      this.handleError(err);
      this._loading.set(false);
    }
  }

  reveal(boxId: string): void {
    void this.act((id) => this.gameService.reveal(id, { boxId }));
  }

  flag(boxId: string): void {
    void this.act((id) => this.gameService.flag(id, { boxId }));
  }

  chord(boxId: string): void {
    void this.act((id) => this.gameService.chord(id, { boxId }));
  }

  async newGame(): Promise<void> {
    const levelId = this._game()?.level?.id;
    const currentId = this._gameId();
    if (!levelId) return;
    if (currentId) {
      try {
        await firstValueFrom(this.gameService.deleteGame(currentId));
      } catch {
        // ignore delete errors: still create a new game
      }
    }
    await this.createGame(levelId);
  }

  async changeLevel(): Promise<void> {
    const id = this._gameId();
    if (id) {
      try {
        await firstValueFrom(this.gameService.deleteGame(id));
      } catch {
        // ignore delete errors: proceed to clear regardless
      }
    }
    this.clearStoredGame();
    this.router.navigate(['/']);
  }

  private async act(
    call: (id: string) => Observable<ActionResult>,
  ): Promise<void> {
    const id = this._gameId();
    if (!id || this.isGameOver()) return;
    try {
      const result = await firstValueFrom(call(id));
      this._game.set(result.game);
      this.mergeBoxes(result.boxes);
    } catch (err) {
      this.handleError(err);
    }
  }

  private async loadGame(id: string): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const game = await firstValueFrom(this.gameService.getGame(id));
      const boxes = await firstValueFrom(this.gameService.getBoxes(id));
      this._game.set(game);
      this._boxes.set(boxes);
    } catch {
      this.clearStoredGame();
    } finally {
      this._loading.set(false);
    }
  }

  private mergeBoxes(updates: Box[]): void {
    this._boxes.update((current) => {
      const byId = new Map(current.map((b) => [b.id, b]));
      for (const u of updates) byId.set(u.id, u);
      return [...byId.values()].sort(
        (a, b) => a.row - b.row || a.column - b.column,
      );
    });
  }

  private clearStoredGame(): void {
    this._game.set(null);
    this._boxes.set([]);
    this._error.set(null);
    localStorage.removeItem(STORAGE_GAME_ID);
    this._gameId.set(null);
  }

  private handleError(err: unknown): void {
    this._error.set(err instanceof Error ? err.message : 'Unexpected error');
  }
}
