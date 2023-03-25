import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { AlarmsService } from './alarms.service';
import { CreateAlarmDto } from './dtos/create-alarm.dto';
import { UpdateAlarmDto } from './dtos/update-alarm.dto';

@Controller('alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAlarmDto: CreateAlarmDto, @Req() req) {
    try {
      return this.alarmsService.create(createAlarmDto, req.user.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.alarmsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    try {
      return this.alarmsService.findOne(+id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAlarmDto: UpdateAlarmDto) {
    try {
      return this.alarmsService.update(+id, updateAlarmDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    try {
      return this.alarmsService.remove(+id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/subscribe')
  async subscribe(@Param('id') id: string, @Req() req) {
    try {
      return await this.alarmsService.subscribe(+id, req.user.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/unsubscribe')
  unsubscribe(@Param('id') id: string, @Req() req) {
    try {
      return this.alarmsService.unsubscribe(+id, req.user.email);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
