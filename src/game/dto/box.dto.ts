import { Expose } from 'class-transformer';

export class BoxDto {
  id: string;
  row: number;
  column: number;
  hasMine: boolean;
  isFlagged: boolean;
  isRotated: boolean;
  minesArroundQuantiy: number | null;
}

export class BoxResponseDto {
  @Expose()
  id: string;
  @Expose()
  row: number;
  @Expose()
  column: number;
  @Expose()
  isFlagged: boolean;
  @Expose()
  isRotated: boolean;
  @Expose()
  minesArroundQuantiy: number | null;
}

export class BoxSelectedDto extends BoxResponseDto {
  @Expose()
  hasMine: boolean;
}
