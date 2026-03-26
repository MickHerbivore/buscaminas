import { computed, inject, Injectable, linkedSignal } from "@angular/core";
import { Router } from "@angular/router";
import { take } from "rxjs";
import { GameState, INITIAL_GAME_STATE } from "../interfaces/game.interface";
import { STORAGE_GAME_ID } from "../properties/properties";
import { GameService } from "../services/game.service";


@Injectable({ providedIn: 'root' })
export class GameStore {
    private readonly _gameService = inject(GameService);
    private readonly _router = inject(Router);

    private readonly _state = linkedSignal<GameState>(() => ({
        ...INITIAL_GAME_STATE,
        gameId: localStorage.getItem(STORAGE_GAME_ID),
    }));

    // Selectors
    readonly gameId = computed(() => this._state().gameId);
    readonly levelId = computed(() => this._state().levelId);
    readonly status = computed(() => this._state().status);
    readonly error = computed(() => this._state().error);

    readonly isLoading = computed(() => this._state().status === 'loading');
    readonly isActive = computed(() => this._state().status === 'active');

    // Actions
    createGame(levelId: string): void {
        this._patch({ status: 'loading', error: null, levelId });

        this._gameService.createGame(levelId).pipe(take(1)).subscribe({
            next: ({ id: gameId }) => {
                this._patch({ gameId, status: 'active' });
                localStorage.setItem(STORAGE_GAME_ID, gameId);
                this._router.navigate(['game']);
            },
            error: (err) => {
                this._patch({ status: 'error', error: err.message });
            },
        });
    }

    resetGame(): void {
        this._state.set(INITIAL_GAME_STATE);
        localStorage.removeItem(STORAGE_GAME_ID);
    }

    // Helpers
    private _patch(partial: Partial<GameState>): void {
        this._state.update((current) => ({ ...current, ...partial }));
    }
}