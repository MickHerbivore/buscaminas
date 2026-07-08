import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from './config/config.module';
import { GameModule } from './game/game.module';
import { LevelModule } from './level/level.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: Number(config.get<number>('THROTTLE_TTL') ?? 60_000),
          limit: Number(config.get<number>('THROTTLE_LIMIT') ?? 60),
        },
      ],
    }),
    GameModule,
    ConfigModule,
    LevelModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
