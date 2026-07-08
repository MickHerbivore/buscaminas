import { GameStatus } from '../enum/game-status.enum';

export type GameStatusType =
  | GameStatus.INITIAL
  | GameStatus.PLAYING
  | GameStatus.WON
  | GameStatus.LOST;
