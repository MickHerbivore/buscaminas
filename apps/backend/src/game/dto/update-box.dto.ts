import { IsString } from 'class-validator';
import { ActionType } from '../types/action';

export class UpdateBoxDto {
  @IsString()
  action: ActionType;
}
