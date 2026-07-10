export class CreateBoxDto {
  row: number;
  column: number;
  hasMine: boolean;
  isFlagged: boolean;
  isRevealed: boolean;
  minesAroundQuantity: number;
}
