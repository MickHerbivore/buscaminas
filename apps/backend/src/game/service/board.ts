import { Box } from '../entity/box.entity';

export interface Cell {
  row: number;
  column: number;
  hasMine: boolean;
  minesAroundQuantity: number;
}

export interface RevealableCell extends Cell {
  isRotated: boolean;
}

export function neighborCoords(
  rows: number,
  cols: number,
  row: number,
  column: number,
): Array<[number, number]> {
  const result: Array<[number, number]> = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = column + dc;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        result.push([r, c]);
      }
    }
  }
  return result;
}

export function buildGrid(boxes: Box[], rows: number, cols: number): Box[][] {
  const grid: Box[][] = Array.from({ length: rows }, () =>
    new Array<Box>(cols),
  );
  for (const box of boxes) {
    grid[box.row][box.column] = box;
  }
  return grid;
}

export function coordKey(row: number, column: number): string {
  return `${row}:${column}`;
}

export function floodReveal(
  grid: Box[][],
  rows: number,
  cols: number,
  startRow: number,
  startCol: number,
): Box[] {
  const revealed: Box[] = [];
  const startCell = grid[startRow][startCol];
  if (!startCell || startCell.hasMine || startCell.isRotated) {
    return revealed;
  }

  const visited = new Set<string>();
  const stack: Array<[number, number]> = [[startRow, startCol]];

  while (stack.length > 0) {
    const [r, c] = stack.pop();
    const key = coordKey(r, c);
    if (visited.has(key)) continue;
    visited.add(key);

    const cell = grid[r][c];
    if (!cell || cell.hasMine || cell.isRotated) continue;

    cell.isRotated = true;
    revealed.push(cell);

    if (cell.minesAroundQuantity === 0) {
      for (const [nr, nc] of neighborCoords(rows, cols, r, c)) {
        stack.push([nr, nc]);
      }
    }
  }

  return revealed;
}

export function areAllNonMinesRevealed(
  grid: Box[][],
  rows: number,
  cols: number,
): boolean {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (!cell) continue;
      if (!cell.hasMine && !cell.isRotated) return false;
    }
  }
  return true;
}

export function adjacentFlagCount(
  grid: Box[][],
  rows: number,
  cols: number,
  row: number,
  column: number,
): number {
  let count = 0;
  for (const [nr, nc] of neighborCoords(rows, cols, row, column)) {
    if (grid[nr][nc].isFlagged) count++;
  }
  return count;
}
