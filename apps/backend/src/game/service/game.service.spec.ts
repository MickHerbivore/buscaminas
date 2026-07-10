import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { LevelService } from '../../level/service/level.service';
import { Box } from '../entity/box.entity';
import { Game } from '../entity/game.entity';
import { GameStatus } from '../enum/game-status.enum';
import { BoxService } from './box.service';
import { FrameService } from './frame.service';
import { GameService } from './game.service';
import { RandomService } from './random.service';

type BoxOverride = Partial<Box>;

function box(
  id: string,
  row: number,
  column: number,
  over: BoxOverride = {},
): Box {
  return {
    id,
    row,
    column,
    hasMine: false,
    isFlagged: false,
    isRevealed: false,
    minesAroundQuantity: 0,
    game: null,
    ...over,
  } as Box;
}

function level3x3(mines = 1) {
  return {
    id: 'level-1',
    name: 'test',
    description: 'test',
    rowsQuantity: 3,
    columnsQuantity: 3,
    minesQuantity: mines,
  } as any;
}

function buildGame(boxes: Box[], status: GameStatus, level: any): Game {
  return {
    id: 'game-1',
    status,
    level,
    createdAt: new Date(),
    startedAt: status === GameStatus.INITIAL ? null : new Date(),
    endedAt: null,
    wonAt: null,
    boxes,
  } as Game;
}

describe('GameService', () => {
  let service: GameService;

  const gameRepo = {
    findOne: jest.fn(),
    create: jest.fn((entity) => ({ id: 'game-1', ...entity })),
    save: jest.fn(async (entity) => entity),
    delete: jest.fn(),
  };
  const levelService = { findById: jest.fn() };
  const boxService = {
    createMany: jest.fn((dtos) => dtos),
    findByGameId: jest.fn(),
    save: jest.fn(async (b: Box) => b),
    saveMany: jest.fn(async (bs: Box[]) => bs),
  };
  const random = { int: jest.fn(() => 0) };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: getRepositoryToken(Game), useValue: gameRepo },
        { provide: LevelService, useValue: levelService },
        { provide: BoxService, useValue: boxService },
        FrameService,
        { provide: RandomService, useValue: random },
      ],
    }).compile();
    service = module.get(GameService);
  });

  describe('createGame', () => {
    it('creates an INITIAL game with empty boxes (no mines yet)', async () => {
      levelService.findById.mockResolvedValue(level3x3());

      const result = await service.createGame({ levelId: 'level-1' });

      expect(result.status).toBe(GameStatus.INITIAL);
      expect(result.startedAt).toBeNull();
      expect(result.endedAt).toBeNull();
      expect(boxService.createMany).toHaveBeenCalled();
      expect(gameRepo.save).toHaveBeenCalled();
    });
  });

  describe('getGame / deleteGame', () => {
    it('getGame throws NotFound when missing', async () => {
      gameRepo.findOne.mockResolvedValue(null);
      await expect(service.getGame('x')).rejects.toThrow(NotFoundException);
    });

    it('deleteGame throws NotFound when affected is 0', async () => {
      gameRepo.delete.mockResolvedValue({ affected: 0 });
      await expect(service.deleteGame('x')).rejects.toThrow(NotFoundException);
    });

    it('deleteGame resolves when a row is removed', async () => {
      gameRepo.delete.mockResolvedValue({ affected: 1 });
      await expect(service.deleteGame('x')).resolves.toBeUndefined();
    });
  });

  describe('findBoxes (antitrampas)', () => {
    it('hides minesAroundQuantity and hasMine for unrevealed cells', async () => {
      const level = level3x3();
      const game = buildGame(
        [
          box('b0', 0, 0, { hasMine: true }),
          box('b1', 0, 1, { isRevealed: true, minesAroundQuantity: 1 }),
        ],
        GameStatus.PLAYING,
        level,
      );
      gameRepo.findOne.mockResolvedValue(game);
      boxService.findByGameId.mockResolvedValue(game.boxes);

      const result = await service.findBoxes('game-1');

      const hidden = result.find((b) => b.id === 'b0');
      expect(hidden.isRevealed).toBe(false);
      expect(hidden.minesAroundQuantity).toBeNull();
      expect(hidden.hasMine).toBeUndefined();
      const revealed = result.find((b) => b.id === 'b1');
      expect(revealed.minesAroundQuantity).toBe(1);
    });
  });

  describe('reveal', () => {
    it('first click is safe: avoids the clicked region and starts the game', async () => {
      const level = level3x3(1);
      const boxes = [
        box('00', 0, 0),
        box('01', 0, 1),
        box('02', 0, 2),
        box('10', 1, 0),
        box('11', 1, 1),
        box('12', 1, 2),
        box('20', 2, 0),
        box('21', 2, 1),
        box('22', 2, 2),
      ];
      const game = buildGame(boxes, GameStatus.INITIAL, level);
      gameRepo.findOne.mockResolvedValue(game);
      // place the single mine at (0,0), clicked cell is (2,2)
      random.int.mockReturnValueOnce(0).mockReturnValueOnce(0);

      const result = await service.reveal('game-1', { boxId: '22' });

      expect(result.game.startedAt).toBeTruthy();
      expect(result.game.status).not.toBe(GameStatus.INITIAL);
      // the clicked box and its neighbors were avoided -> no mine in that region
      const safeRegion = game.boxes.filter(
        (b) => b.row >= 1 && b.row <= 2 && b.column >= 1 && b.column <= 2,
      );
      expect(safeRegion.every((b) => !b.hasMine)).toBe(true);
      // the mine ended up outside the safe region
      const mine = game.boxes.find((b) => b.hasMine);
      expect(mine.id).toBe('00');
    });

    it('revealing a single numbered cell keeps the game PLAYING', async () => {
      const level = level3x3(1);
      const boxes = [
        box('00', 0, 0, { hasMine: true }),
        box('01', 0, 1, { minesAroundQuantity: 1 }),
        box('02', 0, 2, { minesAroundQuantity: 0 }),
        box('10', 1, 0, { minesAroundQuantity: 1 }),
        box('11', 1, 1, { minesAroundQuantity: 1 }),
        box('12', 1, 2, { minesAroundQuantity: 0 }),
        box('20', 2, 0, { minesAroundQuantity: 0 }),
        box('21', 2, 1, { minesAroundQuantity: 0 }),
        box('22', 2, 2, { minesAroundQuantity: 0 }),
      ];
      const game = buildGame(boxes, GameStatus.PLAYING, level);
      gameRepo.findOne.mockResolvedValue(game);

      const result = await service.reveal('game-1', { boxId: '11' });

      expect(result.game.status).toBe(GameStatus.PLAYING);
      expect(result.game.endedAt).toBeNull();
      expect(result.boxes).toHaveLength(1);
      expect(result.boxes[0].id).toBe('11');
      expect(result.boxes[0].hasMine).toBe(false);
    });

    it('revealing a mine ends the game as LOST and exposes all mines', async () => {
      const level = level3x3(1);
      const boxes = [
        box('00', 0, 0, { hasMine: true }),
        box('01', 0, 1, { minesAroundQuantity: 1 }),
        box('02', 0, 2),
        box('10', 1, 0, { minesAroundQuantity: 1 }),
        box('11', 1, 1, { minesAroundQuantity: 1 }),
        box('12', 1, 2),
        box('20', 2, 0),
        box('21', 2, 1),
        box('22', 2, 2),
      ];
      const game = buildGame(boxes, GameStatus.PLAYING, level);
      gameRepo.findOne.mockResolvedValue(game);

      const result = await service.reveal('game-1', { boxId: '00' });

      expect(result.game.status).toBe(GameStatus.LOST);
      expect(result.game.endedAt).toBeTruthy();
      const mine = result.boxes.find((b) => b.id === '00');
      expect(mine.hasMine).toBe(true);
    });

    it('revealing the last safe cell wins the game', async () => {
      const level = level3x3(1);
      const boxes = [
        box('00', 0, 0, { hasMine: true }),
        box('01', 0, 1, { isRevealed: true, minesAroundQuantity: 1 }),
        box('02', 0, 2, { isRevealed: true, minesAroundQuantity: 0 }),
        box('10', 1, 0, { isRevealed: true, minesAroundQuantity: 1 }),
        box('11', 1, 1, { isRevealed: true, minesAroundQuantity: 1 }),
        box('12', 1, 2, { isRevealed: true, minesAroundQuantity: 0 }),
        box('20', 2, 0, { isRevealed: true, minesAroundQuantity: 0 }),
        box('21', 2, 1, { isRevealed: true, minesAroundQuantity: 0 }),
        box('22', 2, 2, { minesAroundQuantity: 0 }), // last unrevealed safe cell
      ];
      const game = buildGame(boxes, GameStatus.PLAYING, level);
      gameRepo.findOne.mockResolvedValue(game);

      const result = await service.reveal('game-1', { boxId: '22' });

      expect(result.game.status).toBe(GameStatus.WON);
      expect(result.game.wonAt).toBeTruthy();
      expect(result.game.endedAt).toBeTruthy();
    });

    it('rejects a reveal on a finished game with Conflict', async () => {
      const game = buildGame(
        [box('b', 0, 0)],
        GameStatus.LOST,
        level3x3(),
      );
      gameRepo.findOne.mockResolvedValue(game);
      await expect(service.reveal('g', { boxId: 'b' })).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('flag', () => {
    it('toggles isFlagged without leaking hasMine', async () => {
      const level = level3x3(1);
      const boxes = [box('00', 0, 0, { hasMine: true, isFlagged: false })];
      const game = buildGame(boxes, GameStatus.PLAYING, level);
      gameRepo.findOne.mockResolvedValue(game);

      const result = await service.flag('game-1', { boxId: '00' });

      expect(boxService.save).toHaveBeenCalled();
      const flagged = result.boxes[0];
      expect(flagged.isFlagged).toBe(true);
      expect(flagged.hasMine).toBeUndefined();
    });
  });

  describe('chord', () => {
    it('loses when the flagged count matches but a flag is misplaced on a safe cell', async () => {
      const level = level3x3(1);
      const boxes = [
        box('00', 0, 0, { hasMine: true }),
        box('01', 0, 1, { isFlagged: true }), // wrong flag (safe cell flagged)
        box('02', 0, 2),
        box('10', 1, 0),
        box('11', 1, 1, { isRevealed: true, minesAroundQuantity: 1 }),
        box('12', 1, 2),
        box('20', 2, 0),
        box('21', 2, 1),
        box('22', 2, 2),
      ];
      const game = buildGame(boxes, GameStatus.PLAYING, level);
      gameRepo.findOne.mockResolvedValue(game);

      const result = await service.chord('game-1', { boxId: '11' });

      expect(result.game.status).toBe(GameStatus.LOST);
    });

    it('wins when chord reveals the remaining safe cells with a correct flag', async () => {
      const level = level3x3(1);
      const boxes = [
        box('00', 0, 0, { hasMine: true, isFlagged: true }),
        box('01', 0, 1, { minesAroundQuantity: 1 }),
        box('02', 0, 2, { minesAroundQuantity: 0 }),
        box('10', 1, 0, { minesAroundQuantity: 1 }),
        box('11', 1, 1, { isRevealed: true, minesAroundQuantity: 1 }),
        box('12', 1, 2, { minesAroundQuantity: 0 }),
        box('20', 2, 0, { minesAroundQuantity: 0 }),
        box('21', 2, 1, { minesAroundQuantity: 0 }),
        box('22', 2, 2, { minesAroundQuantity: 0 }),
      ];
      const game = buildGame(boxes, GameStatus.PLAYING, level);
      gameRepo.findOne.mockResolvedValue(game);

      const result = await service.chord('game-1', { boxId: '11' });

      expect(result.game.status).toBe(GameStatus.WON);
    });

    it('rejects chord on an unrevealed cell', async () => {
      const game = buildGame(
        [box('00', 0, 0, { isRevealed: false })],
        GameStatus.PLAYING,
        level3x3(),
      );
      gameRepo.findOne.mockResolvedValue(game);
      await expect(service.chord('g', { boxId: '00' })).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
