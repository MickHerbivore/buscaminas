import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BoxDto } from '../dto/box.dto';
import { GetBoxesDto } from '../dto/get-boxes';
import { UpdateBoxDto } from '../dto/update-box.dto';
import { BoxService } from '../service/box.service';

@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Post('')
  findAllByGameId(@Body() body: GetBoxesDto): Promise<BoxDto[]> {
    return this.boxService.findAllByGameId(body.gameId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoxDto: UpdateBoxDto,
  ): Promise<BoxDto> {
    return this.boxService.update(id, updateBoxDto);
  }
}
