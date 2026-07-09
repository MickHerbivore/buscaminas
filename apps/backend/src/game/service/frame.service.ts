import { Injectable } from '@nestjs/common';
import { Level } from '../../level/entities/level.entity';
import { CreateBoxDto } from '../dto/create-box.dto';
import { Box } from '../entity/box.entity';
import { coordKey, neighborCoords } from './board';
import { RandomService } from './random.service';

@Injectable()
export class FrameService {
  constructor(private readonly random: RandomService) {}

  initEmptyBoxes(level: Level): CreateBoxDto[] {
    const boxes: CreateBoxDto[] = [];
    for (let row = 0; row < level.rowsQuantity; row++) {
      for (let column = 0; column < level.columnsQuantity; column++) {
        boxes.push({
          row,
          column,
          hasMine: false,
          isFlagged: false,
          isRevealed: false,
          minesAroundQuantity: 0,
        });
      }
    }
    return boxes;
  }

  placeMinesAndNumbers(grid: Box[][], level: Level, avoid: Set<string>): void {
    const total = level.rowsQuantity * level.columnsQuantity;

    let avoidSet = avoid;
    if (total - avoidSet.size < level.minesQuantity) {
      const first = [...avoid][0];
      avoidSet = first ? new Set([first]) : new Set();
    }

    let placed = 0;
    let guard = 0;
    const guardLimit = total * 50;
    while (placed < level.minesQuantity && guard < guardLimit) {
      guard++;
      const r = this.random.int(level.rowsQuantity);
      const c = this.random.int(level.columnsQuantity);
      if (avoidSet.has(coordKey(r, c))) continue;
      if (grid[r][c].hasMine) continue;
      grid[r][c].hasMine = true;
      placed++;
    }

    for (let r = 0; r < level.rowsQuantity; r++) {
      for (let c = 0; c < level.columnsQuantity; c++) {
        if (grid[r][c].hasMine) continue;
        let count = 0;
        for (const [nr, nc] of neighborCoords(
          level.rowsQuantity,
          level.columnsQuantity,
          r,
          c,
        )) {
          if (grid[nr][nc].hasMine) count++;
        }
        grid[r][c].minesAroundQuantity = count;
      }
    }
  }
}
