import { Expose, Type } from 'class-transformer';
import { BoxViewDto } from './box-view.dto';
import { GameResponseDto } from './game-response.dto';

export class ActionResultDto {
  @Expose()
  @Type(() => GameResponseDto)
  game: GameResponseDto;

  @Expose()
  @Type(() => BoxViewDto)
  boxes: BoxViewDto[];
}
