import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { CreateAlarmDto } from './dto/create-alarm.dto';
import { UpdateAlarmDto } from './dto/update-alarm.dto';
import { Alarm } from './entities/alarm.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private alarmsRepository: Repository<Alarm>,
  ) {}

  async create(createAlarmDto: CreateAlarmDto): Promise<Alarm> {
    const { fire } = createAlarmDto;
    const alarm = this.alarmsRepository.create({
      ...createAlarmDto,
      nextFire: fire,
    });
    await this.alarmsRepository.save(alarm);
    return alarm;
  }

  findAll() {
    return `This action returns all alarms`;
  }

  findOne(id: number) {
    return `This action returns a #${id} alarm`;
  }

  update(id: number, updateAlarmDto: UpdateAlarmDto) {
    return `This action updates a #${id} alarm`;
  }

  remove(id: number) {
    return `This action removes a #${id} alarm`;
  }

  @Cron('* * * * * *')
  async handleCron() {
    const now = new Date();
    const alarms = await this.alarmsRepository.find({
      where: { nextFire: LessThan(now) },
    });
    console.log(alarms);
  }
}
