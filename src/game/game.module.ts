import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelModule } from 'src/level/level.module';
import { BoxModule } from '../box/box.module';
import { UuidModule } from '../common/uuid/uuid.module';
import { GameController } from './controller/game.controller';
import { Game } from './entity/game.entity';
import { FrameService } from './service/frame.service';
import { GameService } from './service/game.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    LevelModule,
    UuidModule,
    BoxModule,
  ],
  controllers: [GameController],
  providers: [GameService, FrameService],
})
export class GameModule {}
