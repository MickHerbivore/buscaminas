import { Box } from '../entity/box.entity';
import {
  adjacentFlagCount,
  areAllNonMinesRevealed,
  buildGrid,
  floodReveal,
  neighborCoords,
} from './board';

function makeBox(row: number, column: number, over: Partial<Box> = {}): Box {
  return {
    id: `${row}-${column}`,
    row,
    column,
    hasMine: false,
    isFlagged: false,
    isRevealed: false,
    minesAroundQuantity: 0,
    game: null,
    ...over,
  } as Box;
}

describe('board helpers', () => {
  describe('neighborCoords', () => {
    it('returns in-bounds neighbors only', () => {
      const coords = neighborCoords(3, 3, 0, 0);
      expect(coords).toHaveLength(3);
      expect(coords).toEqual(
        expect.arrayContaining([
          [0, 1],
          [1, 0],
          [1, 1],
        ]),
      );
    });

    it('returns all 8 neighbors for a centered cell', () => {
      expect(neighborCoords(3, 3, 1, 1)).toHaveLength(8);
    });
  });

  describe('buildGrid', () => {
    it('places boxes in a 2D grid by row/column', () => {
      const boxes = [makeBox(0, 0), makeBox(1, 2)];
      const grid = buildGrid(boxes, 2, 3);
      expect(grid[0][0]).toBe(boxes[0]);
      expect(grid[1][2]).toBe(boxes[1]);
    });
  });

  describe('floodReveal', () => {
    it('reveals only the clicked numbered cell', () => {
      const boxes = [makeBox(0, 0, { minesAroundQuantity: 1 })];
      const grid = buildGrid(boxes, 1, 1);
      const revealed = floodReveal(grid, 1, 1, 0, 0);
      expect(revealed).toHaveLength(1);
      expect(revealed[0].isRevealed).toBe(true);
    });

    it('floods a connected zero-region and the numbered border', () => {
      // 3x3, all zeros except (0,2)=1 and (2,2)=1
      const cells = [
        makeBox(0, 0, { minesAroundQuantity: 0 }),
        makeBox(0, 1, { minesAroundQuantity: 0 }),
        makeBox(0, 2, { minesAroundQuantity: 1 }),
        makeBox(1, 0, { minesAroundQuantity: 0 }),
        makeBox(1, 1, { minesAroundQuantity: 0 }),
        makeBox(1, 2, { minesAroundQuantity: 0 }),
        makeBox(2, 0, { minesAroundQuantity: 0 }),
        makeBox(2, 1, { minesAroundQuantity: 0 }),
        makeBox(2, 2, { minesAroundQuantity: 1 }),
      ];
      const grid = buildGrid(cells, 3, 3);
      const revealed = floodReveal(grid, 3, 3, 1, 1);

      const revealedKeys = revealed.map((b) => `${b.row}-${b.column}`).sort();
      expect(revealedKeys).toHaveLength(9);
      expect(revealed.every((b) => b.isRevealed)).toBe(true);
    });

    it('does not reveal mines', () => {
      const cells = [
        makeBox(0, 0, { minesAroundQuantity: 0 }),
        makeBox(0, 1, { hasMine: true, minesAroundQuantity: 0 }),
        makeBox(1, 0, { minesAroundQuantity: 1 }),
      ];
      const grid = buildGrid(cells, 2, 2);
      const revealed = floodReveal(grid, 2, 2, 0, 0);
      const mine = cells.find((b) => b.hasMine);
      expect(mine.isRevealed).toBe(false);
      expect(revealed.find((b) => b.hasMine)).toBeUndefined();
    });
  });

  describe('areAllNonMinesRevealed', () => {
    it('is false when any safe cell is hidden', () => {
      const cells = [
        makeBox(0, 0, { isRevealed: true }),
        makeBox(0, 1, { hasMine: true }),
        makeBox(1, 0, { isRevealed: false }),
      ];
      const grid = buildGrid(cells, 2, 2);
      expect(areAllNonMinesRevealed(grid, 2, 2)).toBe(false);
    });

    it('is true when every safe cell is revealed', () => {
      const cells = [
        makeBox(0, 0, { isRevealed: true }),
        makeBox(0, 1, { hasMine: true }),
        makeBox(1, 0, { isRevealed: true }),
        makeBox(1, 1, { hasMine: true }),
      ];
      const grid = buildGrid(cells, 2, 2);
      expect(areAllNonMinesRevealed(grid, 2, 2)).toBe(true);
    });
  });

  describe('adjacentFlagCount', () => {
    it('counts flagged neighbors', () => {
      const cells = [
        makeBox(0, 0, { isFlagged: true }),
        makeBox(0, 1, { isFlagged: false }),
        makeBox(0, 2, { isFlagged: true }),
        makeBox(1, 0, { isFlagged: false }),
        makeBox(1, 1, { isFlagged: false }),
        makeBox(1, 2, { isFlagged: false }),
        makeBox(2, 0, { isFlagged: false }),
        makeBox(2, 1, { isFlagged: false }),
        makeBox(2, 2, { isFlagged: true }),
      ];
      const grid = buildGrid(cells, 3, 3);
      expect(adjacentFlagCount(grid, 3, 3, 1, 1)).toBe(3);
    });
  });
});
