import { Expose } from 'class-transformer';

export class LevelDto {
  @Expose()
  readonly id: string;
  @Expose()
  readonly name: string;
  @Expose()
  readonly description: string;
  @Expose()
  readonly rowsQuantity: number;
  @Expose()
  readonly columnsQuantity: number;
  @Expose()
  readonly minesQuantity: number;
}
