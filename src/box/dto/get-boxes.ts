import { IsString } from 'class-validator';

export class GetBoxesDto {
  @IsString()
  gameId: string;
}
