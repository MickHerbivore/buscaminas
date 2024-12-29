import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelDto } from '../../level/dto/level.dto';
import { LevelService } from '../../level/service/level.service';
import { CreateGameResponseDto } from '../dto/create-game-response.dto';
import { StartGameResponse } from '../dto/start-game-response.dto';
import { Game } from '../entity/game.entity';
import { CreateGameDto } from './../dto/create-game.dto';
import { FrameService } from './frame.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly levelService: LevelService,
    private readonly frameService: FrameService,
  ) {}

  async getGame(id: string): Promise<Game> {
    try {
      const game = await this.gameRepository.findOneBy({ id });

      if (!game) throw new NotFoundException(`Game with id ${id} not found`);

      return game;
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

      const game = {
        level: level,
        createdAt: new Date(),
        startedAt: null,
        boxes: await this.frameService.create({ level }),
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
      const game = await this.gameRepository.findOneBy({ id });

      if (!game) throw new NotFoundException(`Game with id ${id} not found`);

      game.startedAt = new Date();

      await this.gameRepository.save(game);

      return { id, startedAt: game.startedAt };
    } catch (error) {
      throw new InternalServerErrorException(`Error starting game: ${error}`);
    }
  }

  async resetGame(id: string): Promise<boolean> {
    try {
      const game = await this.gameRepository.findOneBy({ id });

      if (!game) throw new NotFoundException(`Game with id ${id} not found`);

      game.startedAt = null;

      await this.gameRepository.save(game);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(`Error resetting game: ${error}`);
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
}
