import { Controller, Get } from '@nestjs/common';
import { LevelDto } from '../dto/level.dto';
import { LevelService } from '../service/level.service';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Get('')
  async getGame(): Promise<LevelDto[]> {
    return this.levelService.findAll();
  }
}
