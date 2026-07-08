import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelModule } from 'src/level/level.module';
import { GameController } from './controller/game.controller';
import { Box } from './entity/box.entity';
import { Game } from './entity/game.entity';
import { BoxService } from './service/box.service';
import { FrameService } from './service/frame.service';
import { GameService } from './service/game.service';
import { RandomService } from './service/random.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Box]), LevelModule],
  controllers: [GameController],
  providers: [GameService, FrameService, BoxService, RandomService],
})
export class GameModule {}

