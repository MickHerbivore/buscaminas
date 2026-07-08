import { Module } from '@nestjs/common';
import { UuidModule } from './common/uuid/uuid.module';
import { ConfigModule } from './config/config.module';
import { GameModule } from './game/game.module';
import { LevelModule } from './level/level.module';

@Module({
  imports: [GameModule, UuidModule, ConfigModule, LevelModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
