import { Module } from '@nestjs/common';
import { UuidService } from './service/uuid.service';

@Module({
  providers: [UuidService],
  exports: [UuidService],
})
export class UuidModule {}
