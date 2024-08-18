import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  async findAllByFrameId(frameId: string): Promise<BoxDto[]> {
    try {
      const result = await this.boxRepository.find({
        where: { game: { id: frameId } },
      });

      if (result.length === 0)
        throw new InternalServerErrorException(`Error finding boxes`);

      return result;
    } catch (error) {
      throw new InternalServerErrorException(`Error finding boxes: ${error}`);
    }
  }

  async update(id: string, updateBoxDto: UpdateBoxDto): Promise<boolean> {
    try {
      if (!updateBoxDto.isFlagged && !updateBoxDto.isRotated)
        throw new BadRequestException(`Update box dto is empty`);

      const box = await this.boxRepository.findOneBy({ id });

      if (!box) throw new NotFoundException(`Box with id ${id} not found`);

      box.isFlagged = updateBoxDto.isFlagged;
      box.isRotated = box.isRotated || updateBoxDto.isRotated;

      await this.boxRepository.save(box);

      return true;
    } catch (error) {
      throw new InternalServerErrorException(`Error updating box: ${error}`);
    }
  }
}
