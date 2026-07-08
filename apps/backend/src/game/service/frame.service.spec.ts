import { Test } from '@nestjs/testing';
import { Box } from '../entity/box.entity';
import { FrameService } from './frame.service';
import { RandomService } from './random.service';

function makeBox(row: number, column: number): Box {
  return {
    id: `${row}-${column}`,
    row,
    column,
    hasMine: false,
    isFlagged: false,
    isRotated: false,
    minesArroundQuantiy: 0,
    game: null,
  } as Box;
}

function grid(rows: number, cols: number): Box[][] {
  const g: Box[][] = [];
  for (let r = 0; r < rows; r++) {
    g[r] = [];
    for (let c = 0; c < cols; c++) g[r][c] = makeBox(r, c);
  }
  return g;
}

describe('FrameService', () => {
  let service: FrameService;
  let random: { int: jest.Mock };

  beforeEach(async () => {
    random = { int: jest.fn(() => 0) };
    const module = await Test.createTestingModule({
      providers: [
        FrameService,
        { provide: RandomService, useValue: random },
      ],
    }).compile();
    service = module.get(FrameService);
  });

  describe('initEmptyBoxes', () => {
    it('creates rows*cols empty boxes with no mines and zero numbers', () => {
      const level = { rowsQuantity: 2, columnsQuantity: 3 } as any;
      const boxes = service.initEmptyBoxes(level);
      expect(boxes).toHaveLength(6);
      expect(
        boxes.every(
          (b) =>
            b.hasMine === false &&
            b.isRotated === false &&
            b.isFlagged === false &&
            b.minesArroundQuantiy === 0,
        ),
      ).toBe(true);
    });
  });

  describe('placeMinesAndNumbers', () => {
    it('places mines at the generated coordinates', () => {
      const level = { rowsQuantity: 3, columnsQuantity: 3, minesQuantity: 2 } as any;
      const g = grid(3, 3);
      // mine 1 -> (0,0), mine 2 -> (2,2)
      random.int
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(2);

      service.placeMinesAndNumbers(g, level, new Set());

      const mineKeys = g.flat()
        .filter((b) => b.hasMine)
        .map((b) => `${b.row}-${b.column}`)
        .sort();
      expect(mineKeys).toEqual(['0-0', '2-2']);
    });

    it('computes adjacency numbers for non-mine cells', () => {
      const level = { rowsQuantity: 3, columnsQuantity: 3, minesQuantity: 2 } as any;
      const g = grid(3, 3);
      random.int
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(2)
        .mockReturnValueOnce(2);

      service.placeMinesAndNumbers(g, level, new Set());

      expect(g[0][0].minesArroundQuantiy).toBe(0); // mine keeps 0
      expect(g[1][1].minesArroundQuantiy).toBe(2);
      expect(g[0][1].minesArroundQuantiy).toBe(1);
      expect(g[1][2].minesArroundQuantiy).toBe(1);
    });

    it('keeps the first-click region mine-free', () => {
      const level = {
        rowsQuantity: 5,
        columnsQuantity: 5,
        minesQuantity: 5,
      } as any;
      const g = grid(5, 5);
      // avoid the 3x3 region around (2,2)
      const avoid = new Set<string>();
      for (let r = 1; r <= 3; r++)
        for (let c = 1; c <= 3; c++) avoid.add(`${r}:${c}`);

      // place mines in the corners / edges outside the avoid region
      random.int
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(0) // (0,0)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(4) // (0,4)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(0) // (4,0)
        .mockReturnValueOnce(4)
        .mockReturnValueOnce(4) // (4,4)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(2); // (0,2)

      service.placeMinesAndNumbers(g, level, avoid);

      for (let r = 1; r <= 3; r++)
        for (let c = 1; c <= 3; c++) expect(g[r][c].hasMine).toBe(false);
      expect(g.flat().filter((b) => b.hasMine)).toHaveLength(5);
    });
  });
});
