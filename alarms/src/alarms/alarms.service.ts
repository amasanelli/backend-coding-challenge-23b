import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateAlarmDto } from './dtos/create-alarm.dto';
import { UpdateAlarmDto } from './dtos/update-alarm.dto';
import { Alarm } from './entities/alarm.entity';
import { Cron } from '@nestjs/schedule';
import { RedisService } from '../redis/redis.service';
import { Subscription } from './entities/subscription.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AlarmsService {
  constructor(
    @InjectRepository(Alarm)
    private alarmsRepository: Repository<Alarm>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private redisService: RedisService,
    private mailService: MailService,
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

    this.redisService.addAlarm(fire, alarm.id);
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
    return this.alarmsRepository.findOneBy({ id });
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
    this.redisService.updateAlarm(fire, id);
    return this.alarmsRepository.update(
      { id },
      { fire, type, nextFire: fire, ...rest },
    );
  }

  async remove(id: number) {
    this.redisService.deleteAlarm(id);
    return this.alarmsRepository.delete({ id });
  }

  @Cron('* * * * * *')
  private async handleCron() {
    const now = new Date();
    const alarmIds = await this.redisService.getAlarms(now);

    const alarms = await this.alarmsRepository.find({
      where: {
        id: In(alarmIds),
      },
      relations: {
        subscriptions: true,
      },
    });

    for (const alarm of alarms) {
      this.mailService.sendFiredAlarmMail(alarm);

      if (alarm.type === 'one-shot') {
        this.redisService.deleteAlarm(alarm.id);
        await this.alarmsRepository.delete({ id: alarm.id });
      } else {
        let nextFire: Date;

        if (alarm.type === 'daily') {
          nextFire = new Date(
            alarm.nextFire.setUTCDate(alarm.nextFire.getUTCDate() + 1),
          );
        } else if (alarm.type === 'monthly') {
          nextFire = new Date(
            alarm.nextFire.setUTCMonth(alarm.nextFire.getUTCMonth() + 1),
          );
        } else {
          const arrDays = alarm.type.split(' ');
          const dow = alarm.nextFire.getUTCDay();
          const index = arrDays.indexOf(dow.toString());
          const newDow =
            index + 1 >= arrDays.length ? arrDays[0] : arrDays[index + 1];
          nextFire = new Date(
            alarm.nextFire.setUTCDate(
              alarm.nextFire.getDate() +
                (((+newDow + 6 - alarm.nextFire.getDay()) % 7) + 1),
            ),
          );
        }
        this.redisService.updateAlarm(nextFire, alarm.id);
        await this.alarmsRepository.update({ id: alarm.id }, { nextFire });
      }
    }
  }
}
