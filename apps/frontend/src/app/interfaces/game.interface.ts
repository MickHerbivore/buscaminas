import { Box } from "./box.interface";
import { Level } from "./level.interface";

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

export interface GameResponse {
    id: string;
    startedAt: Date;
    level: Level;
    boxes: Box[];
}

export interface GameState {
    gameId: string | null;
    level: Level | null;
    status: 'idle' | 'loading' | 'active' | 'error';
    error: string | null;
}

export const INITIAL_GAME_STATE: GameState = {
    gameId: null,
    level: null,
    status: 'idle',
    error: null,
};