import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { UpdateBoxDto } from '../dto/update-box.dto';
import { BoxService } from '../service/box.service';

@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Get('frame/:frameId')
  findAllByFrameId(@Param('frameId', ParseUUIDPipe) frameId: string) {
    return this.boxService.findAllByFrameId(frameId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoxDto: UpdateBoxDto,
  ) {
    return this.boxService.update(id, updateBoxDto);
  }
}
