import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ChordDto, FlagDto, RevealDto } from '../dto/box-action.dto';
import { ActionResultDto } from '../dto/action-result.dto';
import { BoxViewDto } from '../dto/box-view.dto';
import { CreateGameDto } from '../dto/create-game.dto';
import { GameResponseDto } from '../dto/game-response.dto';
import { GameService } from '../service/game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(
    @Body() dto: CreateGameDto,
  ): Promise<GameResponseDto> {
    return this.gameService.createGame(dto);
  }

  @Get(':id')
  getGame(@Param('id', ParseUUIDPipe) id: string): Promise<GameResponseDto> {
    return this.gameService.getGame(id);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteGame(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.gameService.deleteGame(id);
  }

  @Get(':id/boxes')
  findBoxes(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BoxViewDto[]> {
    return this.gameService.findBoxes(id);
  }

  @Patch(':id/reveal')
  reveal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RevealDto,
  ): Promise<ActionResultDto> {
    return this.gameService.reveal(id, dto);
  }

  @Patch(':id/flag')
  flag(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: FlagDto,
  ): Promise<ActionResultDto> {
    return this.gameService.flag(id, dto);
  }

  @Patch(':id/chord')
  chord(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChordDto,
  ): Promise<ActionResultDto> {
    return this.gameService.chord(id, dto);
  }
}
