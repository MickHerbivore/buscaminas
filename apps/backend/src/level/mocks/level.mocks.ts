import { Level } from '../entities/level.entity';

export const levelIdMock = '38f55f76-e0cc-4425-b6ab-fe91081927c5';

export const levelMock: Level = {
  id: levelIdMock,
  name: 'level',
  description: 'level',
  columnsQuantity: 1,
  rowsQuantity: 1,
  minesQuantity: 0,
};

export const levelDtoMock: Level = {
  id: levelIdMock,
  name: levelMock.name,
  description: levelMock.description,
  columnsQuantity: levelMock.columnsQuantity,
  rowsQuantity: levelMock.rowsQuantity,
  minesQuantity: levelMock.minesQuantity,
};
