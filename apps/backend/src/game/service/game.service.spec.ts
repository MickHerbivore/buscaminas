import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UuidService } from '../../common/uuid/service/uuid.service';
import { LevelService } from '../../level/service/level.service';
import { StartGameResponse } from '../dto/start-game-response.dto';
import { Game } from '../entity/game.entity';
import {
  createGameDtoMock,
  gameIdMock,
  gameMock,
  startGameResponseMock,
} from '../mocks/game.mocks';
import { FrameService } from './frame.service';
import { GameService } from './game.service';

describe('GameService', () => {
  let service: GameService;
  const mockRepository = {
    save: jest.fn(),
    findOneBy: jest.fn(),
    delete: jest.fn(),
  };
  const mockLevelService = {
    findById: jest.fn(),
  };
  const mockUuidService = {
    generate: jest.fn(),
  };
  const mockFrameService = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: LevelService, useValue: mockLevelService },
        { provide: UuidService, useValue: mockUuidService },
        { provide: getRepositoryToken(Game), useValue: mockRepository },
        { provide: FrameService, useValue: mockFrameService },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be able to get a game', async () => {
    jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(gameMock);

    const response = await service.getGame(gameIdMock);

    expect(response).toBe(gameMock);
    expect(response.id).toBe(gameIdMock);
  });

  it('should be able to create a game', async () => {
    jest.spyOn(mockRepository, 'save').mockResolvedValue(gameMock);

    const response = await service.createGame(createGameDtoMock);

    expect(response).toBeDefined();
    expect(response.id).toBe(gameMock.id);
  });

  it('should be able to start a game', async () => {
    const startDate = new Date();
    const result: StartGameResponse = {
      ...startGameResponseMock,
      startedAt: startDate,
    };

    jest.spyOn(mockRepository, 'findOneBy').mockResolvedValue(gameMock);

    const response = await service.startGame(gameIdMock);

    expect(response.id).toBe(result.id);
    expect(response.startedAt).toBeTruthy();
  });

  it('should be able to delete a game', async () => {
    jest.spyOn(mockRepository, 'delete').mockResolvedValue(true);

    const response = await service.deleteGame(gameIdMock);

    expect(response).toBe(true);
  });
});
