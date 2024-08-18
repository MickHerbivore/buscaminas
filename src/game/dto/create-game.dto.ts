import { IsUUID } from 'class-validator';

export class CreateGameDto {
  @IsUUID()
  readonly levelId: string;
}
