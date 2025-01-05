import { IsBoolean } from 'class-validator';

export class UpdateBoxDto {
  @IsBoolean()
  isFlagged?: boolean;

  @IsBoolean()
  isRotated?: boolean;
}
