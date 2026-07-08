import { IsUUID } from 'class-validator';

export class RevealDto {
  @IsUUID()
  readonly boxId: string;
}

export class FlagDto {
  @IsUUID()
  readonly boxId: string;
}

export class ChordDto {
  @IsUUID()
  readonly boxId: string;
}
