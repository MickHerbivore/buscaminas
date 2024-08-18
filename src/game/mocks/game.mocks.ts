import { levelDtoMock, levelMock } from '../../level/mocks/level.mocks';
import { CreateGameResponseDto } from '../dto/create-game-response.dto';
import { CreateGameDto } from '../dto/create-game.dto';
import { GameDto } from '../dto/game.dto';
import { StartGameResponse } from '../dto/start-game-response.dto';
import { Game } from '../entity/game.entity';

export const gameIdMock = '38f55f76-e0cc-4425-b6ab-fe91081927c5';

export const gameMock: Game = {
  id: gameIdMock,
  level: levelMock,
  createdAt: new Date(),
  startedAt: null,
  boxes: [],
};

export const createGameDtoMock: CreateGameDto = {
  levelId: levelMock.id,
};

export const createGameResponseDtoMock: CreateGameResponseDto = {
  id: gameIdMock,
};

export const startGameResponseMock: StartGameResponse = {
  id: gameIdMock,
  startedAt: new Date(),
};

export const gameDtoMock: GameDto = {
  id: gameIdMock,
  level: levelDtoMock,
  startedAt: gameMock.startedAt,
};
