import { Expose } from 'class-transformer';

export class BoxDto {
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
  minesArroundQuantiy: number;
}
