import { Box } from './box.interface';
import { Level } from './level.interface';

export type GameStatus = 'INITIAL' | 'PLAYING' | 'WON' | 'LOST';

export interface CreateGameRequest {
    levelId: string;
}

export interface BoxActionRequest {
    boxId: string;
}

export interface GameResponse {
    id: string;
    status: GameStatus;
    startedAt: Date | null;
    endedAt: Date | null;
    wonAt: Date | null;
    level: Level;
}

export interface ActionResult {
    game: GameResponse;
    boxes: Box[];
}
