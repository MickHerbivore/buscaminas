
export interface Game {
    gameId: string;
    startDate: Date;
    level: string;
}

export interface CreateGameRequest {
    levelId: string;
}

export interface CreateGameResponse {
    id: string;
}

export interface GameResponse extends Game {
    currentTime: Date;
}

export interface GameState {
    gameId: string | null;
    levelId: string | null;
    status: 'idle' | 'loading' | 'active' | 'error';
    error: string | null;
}

export const INITIAL_GAME_STATE: GameState = {
    gameId: null,
    levelId: null,
    status: 'idle',
    error: null,
};