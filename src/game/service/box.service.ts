import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { BoxDto, BoxResponseDto } from '../dto/box.dto';
import { CreateBoxDto } from '../dto/create-box.dto';
import { Box } from '../entity/box.entity';

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

  async rotateAdjacentBoxes(
    gameId: string,
    box: BoxDto,
    touchedRowCols: Set<number[]>,
  ): Promise<Box[]> {
    try {
      if (box.minesArroundQuantiy !== 0) return [];

      touchedRowCols.add([box.row, box.column]);

      const adjacentRowCols = this.getAdjacentRowCols(box);
      const adjacentBoxes = await this.findAdjacentBoxes(
        gameId,
        adjacentRowCols,
      );

      adjacentBoxes.map((adjacentBox) => {
        adjacentBox.isRotated = true;
        return adjacentBox;
      });

      const updateBoxes = await this.boxRepository.save(adjacentBoxes);

      const subAdjacents: Box[] = [];

      for (const adjacentBox of updateBoxes) {
        if (adjacentBox.minesArroundQuantiy === 0) {
          const newAdjacents = await this.rotateAdjacentBoxes(
            gameId,
            adjacentBox,
            touchedRowCols,
          );

          subAdjacents.push(...newAdjacents);
        }
      }

      return [...updateBoxes, ...subAdjacents];
    } catch (error) {
      throw new InternalServerErrorException(
        `Error finding adjacent boxes: ${error}`,
      );
    }
  }

  private getAdjacentRowCols(box: BoxDto): number[][] {
    const row = box.row;
    const column = box.column;

    const adjacentRowCols = [];
    const moves = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    moves.forEach(([dRow, dCol]) => {
      const newRow = row + dRow;
      const newCol = column + dCol;

      if (newRow >= 0 && newCol >= 0) {
        adjacentRowCols.push([newRow, newCol]);
      }
    });

    return adjacentRowCols;
  }

  private async findAdjacentBoxes(
    gameId: string,
    rowCols: number[][],
  ): Promise<Box[]> {
    try {
      const conditions = rowCols.map(([row, column]) => ({
        row,
        column,
      }));

      const boxes = await this.boxRepository
        .createQueryBuilder('box')
        .where('box.game.id = :gameId', { gameId })
        .andWhere(conditions)
        .andWhere('box.isRotated = false')
        .getMany();

      return boxes;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error finding adjacent boxes: ${error}`,
      );
    }
  }

  async findAllByGameId(gameId: string): Promise<BoxResponseDto[]> {
    try {
      const boxes = await this.boxRepository.find({
        where: { game: { id: gameId } },
        order: { row: 'ASC', column: 'ASC' },
      });

      if (boxes.length === 0)
        throw new InternalServerErrorException(`Error finding boxes`);

      boxes.map((box) => {
        box.minesArroundQuantiy = box.isRotated
          ? box.minesArroundQuantiy
          : null;
      });

      return plainToInstance(BoxResponseDto, boxes, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error finding boxes: ${error}`);
    }
  }

  async findByGameIdAndId(gameId: string, boxId: string): Promise<BoxDto> {
    try {
      const box = await this.boxRepository.findOneBy({
        id: boxId,
        game: { id: gameId },
      });

      if (!box) throw new NotFoundException(`Box with id ${boxId} not found`);

      return box;
    } catch (error) {
      throw new InternalServerErrorException(`Error finding box: ${error}`);
    }
  }

  async save(box: BoxDto): Promise<BoxDto> {
    try {
      const savedBox = await this.boxRepository.save(box);

      return plainToInstance(BoxDto, savedBox, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error saving box: ${error}`);
    }
  }
}
