import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisProducerService } from '../redisProducer/redisProducer.service';
import { CreateAlarmDto } from './dtos/create-alarm.dto';
import { UpdateAlarmDto } from './dtos/update-alarm.dto';
import { Alarm } from './entities/alarm.entity';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private alarmsRepository: Repository<Alarm>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private redisProducerService: RedisProducerService,
  ) {}

  parseType(createAlarmDto: CreateAlarmDto) {
    const { daily, monthly, multipleDays } = createAlarmDto;

    let type = 'one-shot';
    if (daily) {
      type = 'daily';
    } else if (monthly) {
      type = 'monthly';
    } else if (multipleDays) {
      type = '';
      if (multipleDays.monday) {
        type += ' 1';
      }
      if (multipleDays.tuesday) {
        type += ' 2';
      }
      if (multipleDays.wednesday) {
        type += ' 3';
      }
      if (multipleDays.thursday) {
        type += ' 4';
      }
      if (multipleDays.friday) {
        type += ' 5';
      }
      if (multipleDays.saturday) {
        type += ' 6';
      }
      if (multipleDays.sunday) {
        type += ' 0';
      }
    }

    return type.trim();
  }

  async create(createAlarmDto: CreateAlarmDto, email: string): Promise<Alarm> {
    const { fire, daily, monthly, multipleDays, ...rest } = createAlarmDto;

    const type = this.parseType(createAlarmDto);

    const alarm = this.alarmsRepository.create({
      fire,
      type,
      nextFire: fire,
      ...rest,
    });
    await this.alarmsRepository.save(alarm);

    const subscription = this.subscriptionRepository.create({ email, alarm });
    await this.subscriptionRepository.save(subscription);

    await this.redisProducerService.addAlarm(fire, alarm.id);
    return alarm;
  }

  findAll() {
    return this.alarmsRepository.find({
      relations: {
        subscriptions: true,
      },
    });
  }

  findOne(id: number) {
    return this.alarmsRepository.findOne({
      where: {
        id,
      },
      relations: {
        subscriptions: true,
      },
    });
  }

  async subscribe(id: number, email: string) {
    const alarm = await this.alarmsRepository.findOneBy({ id });

    if (!alarm) {
      throw new Error('Alarm does not exist');
    }

    const subscription = this.subscriptionRepository.create({ email, alarm });
    await this.subscriptionRepository.save(subscription);

    return subscription;
  }

  async unsubscribe(id: number, email: string) {
    const alarm = await this.alarmsRepository.findOneBy({ id });
    return this.subscriptionRepository.delete({ email, alarm });
  }

  async update(id: number, updateAlarmDto: UpdateAlarmDto) {
    const { fire, daily, monthly, multipleDays, ...rest } = updateAlarmDto;

    const type = this.parseType(updateAlarmDto);
    await this.redisProducerService.updateAlarm(fire, id);
    return this.alarmsRepository.update(
      { id },
      { fire, type, nextFire: fire, ...rest },
    );
  }

  async updateNextFire(id: number, nextFire: Date) {
    await this.redisProducerService.updateAlarm(nextFire, id);
    return this.alarmsRepository.update({ id }, { nextFire });
  }

  async remove(id: number) {
    await this.redisProducerService.deleteAlarm(id);
    return this.alarmsRepository.delete({ id });
  }
}
