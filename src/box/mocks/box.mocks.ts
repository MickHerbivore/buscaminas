import { BoxDto } from '../dto/box.dto';
import { CreateBoxDto } from '../dto/create-box.dto';
import { UpdateBoxDto } from '../dto/update-box.dto';
import { Box } from '../entities/box.entity';

export const boxIdMock = '38f55f76-e0cc-4425-b6ab-fe91081927c5';

export const createBoxDtoMock: CreateBoxDto = {
  row: 1,
  column: 1,
  hasMine: false,
  isFlagged: false,
  isRotated: false,
  minesArroundQuantiy: 0,
};

export const createBoxesDtoMock: CreateBoxDto[] = [createBoxDtoMock];

export const boxMock: Box = {
  id: boxIdMock,
  row: createBoxDtoMock.row,
  column: createBoxDtoMock.column,
  hasMine: createBoxDtoMock.hasMine,
  isFlagged: createBoxDtoMock.isFlagged,
  isRotated: createBoxDtoMock.isRotated,
  minesArroundQuantiy: createBoxDtoMock.minesArroundQuantiy,
  game: null,
};

export const boxesMock: Box[] = [boxMock];

export const updateBoxDtoMock: UpdateBoxDto = {
  isFlagged: true,
  isRotated: false,
};

export const boxesDtoMock: BoxDto[] = [
  {
    id: boxIdMock,
    row: 1,
    column: 1,
    isFlagged: false,
    isRotated: false,
    minesArroundQuantiy: 0,
  },
];
