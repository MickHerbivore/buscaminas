import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { BoxDto } from '../dto/box.dto';
import { CreateBoxDto } from '../dto/create-box.dto';
import { UpdateBoxDto } from '../dto/update-box.dto';
import { Box } from '../entities/box.entity';

@Injectable()
export class BoxService {
  constructor(
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
  ) {}

  async createBoxes(boxes: CreateBoxDto[]): Promise<Box[]> {
    try {
      const result = await this.boxRepository.save(boxes);

      if (result.length === 0)
        throw new InternalServerErrorException(`Error creating boxes`);

      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Error creating boxes: ${error}`);
    }
  }

  async findAllByGameId(gameId: string): Promise<BoxDto[]> {
    try {
      const boxes = await this.boxRepository.find({
        where: { game: { id: gameId } },
        order: { row: 'ASC', column: 'ASC' },
      });

      if (boxes.length === 0)
        throw new InternalServerErrorException(`Error finding boxes`);

      return plainToInstance(BoxDto, boxes, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error finding boxes: ${error}`);
    }
  }

  async update(id: string, updateBoxDto: UpdateBoxDto): Promise<BoxDto> {
    try {
      if (!updateBoxDto.isFlagged && !updateBoxDto.isRotated)
        throw new BadRequestException(`Update box dto is empty`);

      const box = await this.boxRepository.findOneBy({ id });

      if (!box) throw new NotFoundException(`Box with id ${id} not found`);

      box.isFlagged = updateBoxDto.isFlagged;
      box.isRotated = box.isRotated || updateBoxDto.isRotated;

      const savedBox = await this.boxRepository.save(box);

      return plainToInstance(BoxDto, savedBox, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error updating box: ${error}`);
    }
  }
}
