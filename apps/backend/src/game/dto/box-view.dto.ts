import { Expose } from 'class-transformer';

export class BoxViewDto {
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
  minesAroundQuantity: number | null;

  @Expose()
  hasMine?: boolean;
}
