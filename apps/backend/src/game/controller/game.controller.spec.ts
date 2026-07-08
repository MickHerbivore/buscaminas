import { Test, TestingModule } from '@nestjs/testing';
import { levelIdMock } from '../../level/mocks/level.mocks';
import {
  createGameDtoMock,
  createGameResponseDtoMock,
  gameDtoMock,
  gameIdMock,
} from '../mocks/game.mocks';
import { GameService } from '../service/game.service';
import { GameController } from './game.controller';

describe('GameController', () => {
  let controller: GameController;

  const mockGameService = {
    getGame: jest.fn(),
    createGame: jest.fn(),
    startGame: jest.fn(),
    resetGame: jest.fn(),
    deleteGame: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: mockGameService }],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to get a game', async () => {
    jest.spyOn(mockGameService, 'getGame').mockResolvedValue(gameDtoMock);

    const response = await controller.getGame(gameIdMock);

    expect(response).toBe(gameDtoMock);
    expect(response.id).toBe(gameIdMock);
    expect(response.level.id).toBe(levelIdMock);
  });

  it('should be able to create a game', async () => {
    jest
      .spyOn(mockGameService, 'createGame')
      .mockResolvedValue(createGameResponseDtoMock);

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnValue(createGameResponseDtoMock),
    };

    const game = await controller.createGame(createGameDtoMock, res as any);

    expect(mockGameService.createGame).toHaveBeenCalledWith(createGameDtoMock);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createGameResponseDtoMock);
    expect(game).toEqual(createGameResponseDtoMock);
  });

  it('should be able to delete a game', async () => {
    jest.spyOn(mockGameService, 'deleteGame').mockResolvedValue(true);

    const response = await controller.deleteGame(gameIdMock);

    expect(mockGameService.deleteGame).toHaveBeenCalledWith(gameIdMock);
    expect(response).toBe(true);
  });
});
