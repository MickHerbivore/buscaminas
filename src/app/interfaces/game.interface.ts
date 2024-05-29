import { Box } from "./box.interface";

export interface Game {
    gameId: string;
    startDate: Date;
    level: string;
}

export interface InitGame {
    level: string;
    rows: number;
    cols: number;
    boxes: Box[][];
}

export interface GameResponse extends Game {
    currentTime: Date;
}