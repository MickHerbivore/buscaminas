import { Injectable } from '@nestjs/common';
import { Level } from '../../level/entities/level.entity';
import { CreateBoxDto } from '../dto/create-box.dto';

@Injectable()
export class FrameService {
  buildBoxesFrame(level: Level): CreateBoxDto[] {
    const boxes = this.initBoxes(level);
    this.putMines(level, boxes);
    this.putNumbers(level, boxes);
    return boxes.flat();
  }

  private initBoxes(level: Level): CreateBoxDto[][] {
    const boxes: CreateBoxDto[][] = [];
    for (let row = 0; row < level.rowsQuantity; row++) {
      boxes[row] = [];
      for (let col = 0; col < level.columnsQuantity; col++) {
        boxes[row][col] = {
          row: row,
          column: col,
          hasMine: false,
          isFlagged: false,
          isRotated: false,
          minesArroundQuantiy: 0,
        };
      }
    }

    return boxes;
  }

  private putMines(level: Level, boxes: CreateBoxDto[][]): CreateBoxDto[][] {
    for (let i = 0; i < level.minesQuantity; i++) {
      const row = Math.floor(Math.random() * level.rowsQuantity);
      const col = Math.floor(Math.random() * level.columnsQuantity);

      if (boxes[row][col].hasMine) i--;

      boxes[row][col].hasMine = true;
    }

    return boxes;
  }

  private putNumbers(level: Level, boxes: CreateBoxDto[][]): CreateBoxDto[][] {
    for (let row = 0; row < level.rowsQuantity; row++) {
      for (let col = 0; col < level.columnsQuantity; col++) {
        if (!boxes[row][col].hasMine) {
          boxes[row][col].minesArroundQuantiy = this.getNumberOfMinesAround(
            level,
            boxes,
            boxes[row][col],
          );
        }
      }
    }

    return boxes;
  }

  private getNumberOfMinesAround(
    level: Level,
    boxes: CreateBoxDto[][],
    box: CreateBoxDto,
  ): number {
    let numberOfMines = 0;

    for (let i = box.row - 1; i <= box.row + 1; i++) {
      for (let j = box.column - 1; j <= box.column + 1; j++) {
        if (
          i >= 0 &&
          i < level.rowsQuantity &&
          j >= 0 &&
          j < level.columnsQuantity &&
          boxes[i][j].hasMine
        ) {
          numberOfMines++;
        }
      }
    }

    return numberOfMines;
  }
}
