import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelService } from '../../level/service/level.service';
import { ActionResultDto } from '../dto/action-result.dto';
import { BoxViewDto } from '../dto/box-view.dto';
import { ChordDto } from '../dto/box-action.dto';
import { CreateGameDto } from '../dto/create-game.dto';
import { FlagDto } from '../dto/box-action.dto';
import { GameResponseDto } from '../dto/game-response.dto';
import { RevealDto } from '../dto/box-action.dto';
import { Box } from '../entity/box.entity';
import { Game } from '../entity/game.entity';
import { GameStatus } from '../enum/game-status.enum';
import {
  adjacentFlagCount,
  areAllNonMinesRevealed,
  buildGrid,
  coordKey,
  floodReveal,
  neighborCoords,
} from './board';
import { BoxService } from './box.service';
import { FrameService } from './frame.service';
import { toBoxView, toBoxViews, toGameResponse } from './game-mapper';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly levelService: LevelService,
    private readonly frameService: FrameService,
    private readonly boxService: BoxService,
  ) {}

  async getGame(id: string): Promise<GameResponseDto> {
    const game = await this.loadGame(id);
    return toGameResponse(game);
  }

  async createGame(dto: CreateGameDto): Promise<GameResponseDto> {
    const level = await this.levelService.findById(dto.levelId);

    const boxes = this.boxService.createMany(
      this.frameService.initEmptyBoxes(level),
    );

    const game = this.gameRepository.create({
      status: GameStatus.INITIAL,
      level,
      createdAt: new Date(),
      startedAt: null,
      endedAt: null,
      wonAt: null,
      boxes,
    });

    const saved = await this.gameRepository.save(game);
    return toGameResponse(saved);
  }

  async deleteGame(id: string): Promise<void> {
    const result = await this.gameRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
  }

  async findBoxes(gameId: string): Promise<BoxViewDto[]> {
    const game = await this.loadGame(gameId);
    const boxes = await this.boxService.findByGameId(gameId);
    return toBoxViews(boxes, game);
  }

  async reveal(gameId: string, dto: RevealDto): Promise<ActionResultDto> {
    const game = await this.loadGameWithBoxes(gameId);
    this.ensurePlayable(game);

    const level = game.level;
    const startBox = this.findBox(game, dto.boxId);
    if (startBox.isFlagged) {
      throw new BadRequestException('Cannot reveal a flagged cell');
    }
    const grid = buildGrid(game.boxes, level.rowsQuantity, level.columnsQuantity);

    const changed: Box[] = [];

    if (game.status === GameStatus.INITIAL) {
      const avoid = this.buildAvoidSet(level, startBox.row, startBox.column);
      this.frameService.placeMinesAndNumbers(grid, level, avoid);
      changed.push(...game.boxes);
      game.status = GameStatus.PLAYING;
      game.startedAt = new Date();
    }

    if (startBox.hasMine) {
      startBox.isRevealed = true;
      changed.push(startBox);
      game.status = GameStatus.LOST;
      game.endedAt = new Date();
      await this.persist(game, changed);
      return this.buildResult(game, game.boxes);
    }

    const revealed = floodReveal(
      grid,
      level.rowsQuantity,
      level.columnsQuantity,
      startBox.row,
      startBox.column,
    );
    changed.push(...revealed);

    if (
      areAllNonMinesRevealed(grid, level.rowsQuantity, level.columnsQuantity)
    ) {
      game.status = GameStatus.WON;
      game.endedAt = new Date();
      game.wonAt = new Date();
    }

    await this.persist(game, changed);

    const resultBoxes = revealed.length > 0 ? revealed : [startBox];
    return this.buildResult(game, resultBoxes);
  }

  async flag(gameId: string, dto: FlagDto): Promise<ActionResultDto> {
    const game = await this.loadGameWithBoxes(gameId);
    this.ensurePlayable(game);

    const box = this.findBox(game, dto.boxId);
    box.isFlagged = !box.isFlagged;
    await this.boxService.save(box);

    return this.buildResult(game, [box]);
  }

  async chord(gameId: string, dto: ChordDto): Promise<ActionResultDto> {
    const game = await this.loadGameWithBoxes(gameId);
    this.ensurePlayable(game);

    if (game.status === GameStatus.INITIAL) {
      throw new BadRequestException('Cannot chord before the first reveal');
    }

    const level = game.level;
    const box = this.findBox(game, dto.boxId);

    if (!box.isRevealed) {
      throw new BadRequestException('Chord requires a revealed cell');
    }
    if (box.minesAroundQuantity <= 0) {
      throw new BadRequestException('Chord requires a numbered cell');
    }

    const grid = buildGrid(game.boxes, level.rowsQuantity, level.columnsQuantity);
    const flagCount = adjacentFlagCount(
      grid,
      level.rowsQuantity,
      level.columnsQuantity,
      box.row,
      box.column,
    );

    if (flagCount !== box.minesAroundQuantity) {
      return this.buildResult(game, [box]);
    }

    const targets = neighborCoords(
      level.rowsQuantity,
      level.columnsQuantity,
      box.row,
      box.column,
    )
      .map(([r, c]) => grid[r][c])
      .filter((neighbor) => !neighbor.isFlagged && !neighbor.isRevealed);

    const changed: Box[] = [];
    let hitMine = false;

    for (const target of targets) {
      if (target.hasMine) {
        target.isRevealed = true;
        changed.push(target);
        hitMine = true;
        break;
      }
      const revealed = floodReveal(
        grid,
        level.rowsQuantity,
        level.columnsQuantity,
        target.row,
        target.column,
      );
      changed.push(...revealed);
    }

    if (hitMine) {
      game.status = GameStatus.LOST;
      game.endedAt = new Date();
      await this.persist(game, changed);
      return this.buildResult(game, game.boxes);
    }

    if (
      areAllNonMinesRevealed(grid, level.rowsQuantity, level.columnsQuantity)
    ) {
      game.status = GameStatus.WON;
      game.endedAt = new Date();
      game.wonAt = new Date();
    }

    await this.persist(game, changed);
    return this.buildResult(game, changed);
  }

  private async loadGame(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['level'],
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    return game;
  }

  private async loadGameWithBoxes(id: string): Promise<Game> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: ['level', 'boxes'],
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    return game;
  }

  private findBox(game: Game, boxId: string): Box {
    const box = game.boxes.find((b) => b.id === boxId);
    if (!box) {
      throw new NotFoundException(
        `Box with id ${boxId} not found in game ${game.id}`,
      );
    }
    return box;
  }

  private ensurePlayable(game: Game): void {
    if (
      game.status === GameStatus.LOST ||
      game.status === GameStatus.WON
    ) {
      throw new ConflictException(
        `Game ${game.id} is already finished (status=${game.status})`,
      );
    }
  }

  private buildAvoidSet(level: Game['level'], row: number, column: number): Set<string> {
    const avoid = new Set<string>();
    avoid.add(coordKey(row, column));
    for (const [r, c] of neighborCoords(
      level.rowsQuantity,
      level.columnsQuantity,
      row,
      column,
    )) {
      avoid.add(coordKey(r, c));
    }
    return avoid;
  }

  private async persist(game: Game, changedBoxes: Box[]): Promise<void> {
    const unique = Array.from(
      new Map(changedBoxes.map((b) => [b.id, b])).values(),
    );
    if (unique.length > 0) {
      await this.boxService.saveMany(unique);
    }
    await this.gameRepository.save({
      id: game.id,
      status: game.status,
      startedAt: game.startedAt,
      endedAt: game.endedAt,
      wonAt: game.wonAt,
    });
  }

  private buildResult(game: Game, boxes: Box[]): ActionResultDto {
    const result = new ActionResultDto();
    result.game = toGameResponse(game);
    result.boxes = boxes.map((b) => toBoxView(b, game));
    return result;
  }
}
