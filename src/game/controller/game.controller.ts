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
import { CreateGameDto } from '../dto/create-game.dto';
import { GameDto } from '../dto/game.dto';
import { GameService } from '../service/game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get(':id')
  async getGame(@Param('id', ParseUUIDPipe) id: string): Promise<GameDto> {
    return this.gameService.getGame(id);
  }

  @Post('')
  async createGame(@Body() createGameDto: CreateGameDto, @Res() res) {
    const game = await this.gameService.createGame(createGameDto);
    return res.status(201).json(game);
  }

  @Patch(':id')
  async startGame(@Param('id', ParseUUIDPipe) id: string) {
    return this.gameService.startGame(id);
  }

  @Patch('reset/:id')
  async resetGame(@Param('id', ParseUUIDPipe) id: string) {
    return this.gameService.resetGame(id);
  }

  @Delete(':id')
  async deleteGame(@Param('id', ParseUUIDPipe) id: string) {
    return this.gameService.deleteGame(id);
  }
}
