import { IsUUID } from 'class-validator';

export class CreateGameResponseDto {
  @IsUUID()
  readonly id: string;
}
