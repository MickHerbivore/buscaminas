import { Expose } from 'class-transformer';

export class CreateGameResponseDto {
  @Expose()
  id: string;
}
