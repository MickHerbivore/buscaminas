
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