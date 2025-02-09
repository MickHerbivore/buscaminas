import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { BoxResponseDto, BoxSelectedDto } from '../dto/box.dto';
import { CreateGameResponseDto } from '../dto/create-game-response.dto';
import { CreateGameDto } from '../dto/create-game.dto';
import { GameDto } from '../dto/game.dto';
import { UpdateBoxDto } from '../dto/update-box.dto';
import { BoxService } from '../service/box.service';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly boxService: BoxService,
  ) {}

  @Post('')
  async createGame(
    @Body() createGameDto: CreateGameDto,
    @Res() res,
  ): Promise<CreateGameResponseDto> {
    const game = await this.gameService.createGame(createGameDto);
    return res.status(201).json(game);
  }

  @Get(':id')
  async getGame(@Param('id', ParseUUIDPipe) id: string): Promise<GameDto> {
    return this.gameService.getGame(id);
  }

  @Delete(':id')
  async deleteGame(@Param('id', ParseUUIDPipe) id: string) {
    return this.gameService.deleteGame(id);
  }

  @Get(':id/boxes')
  findBoxes(
    @Param('id', ParseUUIDPipe) gameId: string,
  ): Promise<BoxResponseDto[]> {
    return this.gameService.findBoxes(gameId);
  }

  @Patch(':id/boxes/:boxId')
  update(
    @Param('id', ParseUUIDPipe) gameId: string,
    @Param('boxId', ParseUUIDPipe) boxId: string,
    @Body() updateBoxDto: UpdateBoxDto,
  ): Promise<BoxSelectedDto[]> {
    return this.gameService.updateBox(gameId, boxId, updateBoxDto);
  }
}
