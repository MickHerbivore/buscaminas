import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBoxDto } from '../dto/create-box.dto';
import { Box } from '../entity/box.entity';

@Injectable()
export class BoxService {
  constructor(
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
  ) {}

  createMany(boxes: CreateBoxDto[]): Box[] {
    const entities = this.boxRepository.create(boxes);
    if (!entities || entities.length === 0) {
      throw new InternalServerErrorException('Error creating boxes');
    }
    return entities;
  }

  async findByGameId(gameId: string): Promise<Box[]> {
    return this.boxRepository.find({
      where: { game: { id: gameId } },
      order: { row: 'ASC', column: 'ASC' },
    });
  }

  async findByGameIdAndId(gameId: string, boxId: string): Promise<Box> {
    const box = await this.boxRepository.findOneBy({
      id: boxId,
      game: { id: gameId },
    });
    if (!box) {
      throw new NotFoundException(`Box with id ${boxId} not found`);
    }
    return box;
  }

  async save(box: Box): Promise<Box> {
    return this.boxRepository.save(box);
  }

  async saveMany(boxes: Box[]): Promise<Box[]> {
    if (boxes.length === 0) return [];
    return this.boxRepository.save(boxes);
  }
}
