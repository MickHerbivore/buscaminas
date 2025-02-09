import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { LevelDto } from '../../level/dto/level.dto';
import { LevelService } from '../../level/service/level.service';
import { BoxDto, BoxResponseDto, BoxSelectedDto } from '../dto/box.dto';
import { CreateGameResponseDto } from '../dto/create-game-response.dto';
import { GameDto } from '../dto/game.dto';
import { StartGameResponse } from '../dto/start-game-response.dto';
import { UpdateBoxDto } from '../dto/update-box.dto';
import { Game } from '../entity/game.entity';
import { Action } from '../enum/action.enum';
import { GameStatus } from '../enum/game-status.enum';
import { GameStatusType } from '../types/game-status';
import { CreateGameDto } from './../dto/create-game.dto';
import { BoxService } from './box.service';
import { FrameService } from './frame.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,

    private readonly levelService: LevelService,
    private readonly frameService: FrameService,
    private readonly boxService: BoxService,
  ) {}

  private async findGameById(id: string): Promise<Game> {
    const game = await this.gameRepository.findOneBy({ id });
    if (!game) throw new NotFoundException(`Game with id ${id} not found`);
    return game;
  }

  async getGame(id: string): Promise<GameDto> {
    try {
      const game = await this.gameRepository.findOne({
        where: { id },
        relations: ['level'],
      });

      if (!game) throw new NotFoundException(`Game with id ${id} not found`);

      const gameDto = plainToInstance(GameDto, game, {
        excludeExtraneousValues: true,
      });

      gameDto.level = plainToInstance(LevelDto, game.level, {
        excludeExtraneousValues: true,
      });

      return gameDto;
    } catch (error) {
      throw new InternalServerErrorException(`Error getting game: ${error}`);
    }
  }

  async createGame(
    createGameDto: CreateGameDto,
  ): Promise<CreateGameResponseDto> {
    try {
      const level: LevelDto = await this.levelService.findById(
        createGameDto.levelId,
      );

      const boxes = this.frameService.buildBoxesFrame(level);
      const boxesEntity = await this.boxService.createBoxes(boxes);

      const game = {
        status: GameStatus.INITIAL,
        level: level,
        createdAt: new Date(),
        startedAt: null,
        boxes: boxesEntity,
      };

      const savedGame = await this.gameRepository.save(game);

      return plainToInstance(CreateGameResponseDto, savedGame, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error creating game: ${error}`);
    }
  }

  async startGame(id: string): Promise<StartGameResponse> {
    try {
      const game = await this.findGameById(id);
      game.startedAt = new Date();
      game.status = GameStatus.PLAYING;

      await this.gameRepository.save(game);

      return { id, startedAt: game.startedAt };
    } catch (error) {
      throw new InternalServerErrorException(`Error starting game: ${error}`);
    }
  }

  private async updateStatus(
    id: string,
    status: GameStatusType,
  ): Promise<boolean> {
    try {
      const game = await this.findGameById(id);
      game.status = status;

      await this.gameRepository.save(game);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(`Error updating game: ${error}`);
    }
  }

  async deleteGame(id: string): Promise<boolean> {
    try {
      const deleted = await this.gameRepository.delete(id);

      if (deleted.affected === 0) return false;

      return true;
    } catch (error) {
      throw new InternalServerErrorException(`Error deleting game: ${error}`);
    }
  }

  async findBoxes(gameId: string): Promise<BoxResponseDto[]> {
    try {
      return this.boxService.findAllByGameId(gameId);
    } catch (error) {
      throw new InternalServerErrorException(`Error finding boxes: ${error}`);
    }
  }

  async updateBox(
    gameId: string,
    boxId: string,
    updateBoxDto: UpdateBoxDto,
  ): Promise<BoxSelectedDto[]> {
    try {
      const game = await this.findGameById(gameId);
      if (game.status === GameStatus.INITIAL) this.startGame(gameId);

      const box = await this.boxService.findByGameIdAndId(gameId, boxId);

      if (updateBoxDto.action === Action.FLAG) return this.flagBox(box);
      else if (updateBoxDto.action === Action.ROTATE)
        return this.rotateBox(gameId, box);
    } catch (error) {
      throw new InternalServerErrorException(`Error updating box: ${error}`);
    }
  }

  private async flagBox(box: BoxDto): Promise<BoxSelectedDto[]> {
    try {
      box.isFlagged = !box.isFlagged;

      const boxEntity = await this.boxService.save(box);

      return plainToInstance(BoxSelectedDto, [boxEntity], {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error flaging box: ${error}`);
    }
  }

  private async rotateBox(
    gameId: string,
    box: BoxDto,
  ): Promise<BoxSelectedDto[]> {
    try {
      box.isRotated = true;

      await this.boxService.save(box);

      if (box.hasMine) {
        this.updateStatus(gameId, GameStatus.LOST);

        return plainToInstance(BoxSelectedDto, [box], {
          excludeExtraneousValues: true,
        });
      }

      const otherRotatedBoxes: BoxDto[] =
        await this.boxService.rotateAdjacentBoxes(gameId, box, new Set());

      return plainToInstance(BoxSelectedDto, [box, ...otherRotatedBoxes], {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error rotating box: ${error}`);
    }
  }
}
