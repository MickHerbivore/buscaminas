export class CreateBoxDto {
  row: number;
  column: number;
  hasMine: boolean;
  isFlagged: boolean;
  isRotated: boolean;
  minesArroundQunatiy: number;
}
