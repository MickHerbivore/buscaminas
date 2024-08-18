import { Module } from '@nestjs/common';
import { BoxService } from './service/box.service';
import { BoxController } from './controller/box.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from './entities/box.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Box])],
  controllers: [BoxController],
  providers: [BoxService],
  exports: [BoxService],
})
export class BoxModule {}
