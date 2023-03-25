import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Alarm } from '../alarms/entities/alarm.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendFiredAlarmMail(alarm: Alarm) {
    for (const subscription of alarm.subscriptions) {
      await this.mailerService.sendMail({
        to: subscription.email,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: alarm.subject,
        template: './fire.template.hbs',
        context: {
          message: alarm.message,
        },
      });
    }
  }
}
