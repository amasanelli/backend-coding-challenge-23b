import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { AlarmsService } from '../alarms/alarms.service';
import { MailService } from '../mail/mail.service';
import { Logger } from '@nestjs/common';

export type JobData = {
  id: number;
};

@Processor('alarms')
export class RedisConsumerService {
  constructor(
    private alarmsService: AlarmsService,
    private mailService: MailService,
  ) {}

  private readonly logger = new Logger(RedisConsumerService.name);

  @Process()
  async transcode(job: Job<unknown>) {
    const { id } = job.data as JobData;

    const alarm = await this.alarmsService.findOne(id);

    if (!alarm) {
      return;
    }

    this.logger.log(`Alarm ${id} fired`);

    this.mailService.sendFiredAlarmMail(alarm);

    if (alarm.type === 'one-shot') {
      await this.alarmsService.remove(id);

      this.logger.log(`Alarm ${id} handled`);
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
      await this.alarmsService.updateNextFire(id, nextFire);

      this.logger.log(`Alarm ${id} rescheduled to ${nextFire.toISOString()}`);
    }
  }
}
