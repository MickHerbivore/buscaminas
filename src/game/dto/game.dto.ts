import { LevelDto } from '../../level/dto/level.dto';

export class GameDto {
  readonly id: string;
  readonly startedAt: Date;
  readonly level: LevelDto;
}
