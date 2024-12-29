import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { LevelDto } from '../dto/level.dto';
import { Level } from '../entities/level.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  async findAll(): Promise<LevelDto[]> {
    try {
      const levels = await this.levelRepository.find();
      return plainToInstance(LevelDto, levels, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error finding all levels: ${error}`,
      );
    }
  }

  findById(id: string): Promise<LevelDto> {
    try {
      const level = this.levelRepository.findOneBy({ id });

      if (!level) throw new Error(`Level with id ${id} not found`);

      return level;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error finding level by id: ${error}`,
      );
    }
  }
}
