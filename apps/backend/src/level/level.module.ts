import { Module } from '@nestjs/common';
import { LevelService } from './service/level.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { LevelController } from './controller/level.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  controllers: [LevelController],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelModule {}
