import { Expose } from 'class-transformer';
import { LevelDto } from '../../level/dto/level.dto';

export class GameDto {
  @Expose()
  readonly id: string;
  @Expose()
  readonly startedAt: Date;
  @Expose()
  level: LevelDto;
}
