import { Test } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from '../service/game.service';

describe('GameController', () => {
  let controller: GameController;

  const mockGameService = {
    getGame: jest.fn(),
    createGame: jest.fn(),
    deleteGame: jest.fn(),
    findBoxes: jest.fn(),
    reveal: jest.fn(),
    flag: jest.fn(),
    chord: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      controllers: [GameController],
      providers: [{ provide: GameService, useValue: mockGameService }],
    }).compile();
    controller = module.get(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createGame delegates to the service', async () => {
    mockGameService.createGame.mockResolvedValue({ id: 'g1' });
    const result = await controller.createGame({ levelId: 'l1' });
    expect(mockGameService.createGame).toHaveBeenCalledWith({ levelId: 'l1' });
    expect(result).toEqual({ id: 'g1' });
  });

  it('getGame delegates to the service', async () => {
    mockGameService.getGame.mockResolvedValue({ id: 'g1' });
    await controller.getGame('g1');
    expect(mockGameService.getGame).toHaveBeenCalledWith('g1');
  });

  it('deleteGame delegates to the service', async () => {
    mockGameService.deleteGame.mockResolvedValue(undefined);
    await controller.deleteGame('g1');
    expect(mockGameService.deleteGame).toHaveBeenCalledWith('g1');
  });

  it('findBoxes delegates to the service', async () => {
    mockGameService.findBoxes.mockResolvedValue([]);
    await controller.findBoxes('g1');
    expect(mockGameService.findBoxes).toHaveBeenCalledWith('g1');
  });

  it('reveal delegates to the service', async () => {
    mockGameService.reveal.mockResolvedValue({ game: {}, boxes: [] });
    await controller.reveal('g1', { boxId: 'b1' });
    expect(mockGameService.reveal).toHaveBeenCalledWith('g1', { boxId: 'b1' });
  });

  it('flag delegates to the service', async () => {
    mockGameService.flag.mockResolvedValue({ game: {}, boxes: [] });
    await controller.flag('g1', { boxId: 'b1' });
    expect(mockGameService.flag).toHaveBeenCalledWith('g1', { boxId: 'b1' });
  });

  it('chord delegates to the service', async () => {
    mockGameService.chord.mockResolvedValue({ game: {}, boxes: [] });
    await controller.chord('g1', { boxId: 'b1' });
    expect(mockGameService.chord).toHaveBeenCalledWith('g1', { boxId: 'b1' });
  });
});
