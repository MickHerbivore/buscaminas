import { Module } from '@nestjs/common';
import { LevelService } from './service/level.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Level])],
  controllers: [],
  providers: [LevelService],
  exports: [LevelService],
})
export class LevelModule {}
