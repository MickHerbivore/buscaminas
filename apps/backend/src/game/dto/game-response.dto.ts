import { Expose, Type } from 'class-transformer';
import { LevelDto } from '../../level/dto/level.dto';
import { GameStatusType } from '../types/game-status';

export class GameResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: GameStatusType;

  @Expose()
  startedAt: Date;

  @Expose()
  endedAt: Date;

  @Expose()
  wonAt: Date;

  @Expose()
  @Type(() => LevelDto)
  level: LevelDto;
}
