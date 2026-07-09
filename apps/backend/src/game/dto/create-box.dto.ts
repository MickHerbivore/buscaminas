export class CreateBoxDto {
  row: number;
  column: number;
  hasMine: boolean;
  isFlagged: boolean;
  isRotated: boolean;
  minesAroundQuantity: number;
}
