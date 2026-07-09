import { LevelDto } from '../../level/dto/level.dto';
import { BoxViewDto } from '../dto/box-view.dto';
import { GameResponseDto } from '../dto/game-response.dto';
import { Box } from '../entity/box.entity';
import { Game } from '../entity/game.entity';
import { GameStatus } from '../enum/game-status.enum';

function isGameOver(game: Game): boolean {
  return game.status === GameStatus.LOST || game.status === GameStatus.WON;
}

export function toBoxView(box: Box, game: Game): BoxViewDto {
  const view = new BoxViewDto();
  view.id = box.id;
  view.row = box.row;
  view.column = box.column;
  view.isFlagged = box.isFlagged;
  view.isRotated = box.isRotated;
  view.minesAroundQuantity = box.isRotated ? box.minesAroundQuantity : null;

  if (isGameOver(game) || box.isRotated) {
    view.hasMine = box.hasMine;
  }
  return view;
}

export function toBoxViews(boxes: Box[], game: Game): BoxViewDto[] {
  return boxes.map((box) => toBoxView(box, game));
}

export function toGameResponse(game: Game): GameResponseDto {
  const dto = new GameResponseDto();
  dto.id = game.id;
  dto.status = game.status;
  dto.startedAt = game.startedAt;
  dto.endedAt = game.endedAt;
  dto.wonAt = game.wonAt;
  dto.level = game.level as LevelDto;
  return dto;
}
