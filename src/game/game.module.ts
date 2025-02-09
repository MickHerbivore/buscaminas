import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelModule } from 'src/level/level.module';
import { UuidModule } from '../common/uuid/uuid.module';
import { GameController } from './controller/game.controller';
import { Box } from './entity/box.entity';
import { Game } from './entity/game.entity';
import { BoxService } from './service/box.service';
import { FrameService } from './service/frame.service';
import { GameService } from './service/game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Box]), LevelModule, UuidModule],
  controllers: [GameController],
  providers: [GameService, FrameService, BoxService],
})
export class GameModule {}
