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
  isRevealed: boolean;

  @Expose()
  minesAroundQuantity: number | null;

  @Expose()
  hasMine?: boolean;
}
