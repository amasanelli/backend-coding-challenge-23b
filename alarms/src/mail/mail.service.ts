import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { Alarm } from '../alarms/entities/alarm.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  private readonly logger = new Logger(MailService.name);

  async sendFiredAlarmMail(alarm: Alarm) {
    try {
      for (const subscription of alarm.subscriptions) {
        await this.mailerService.sendMail({
          to: subscription.email,
          subject: alarm.subject,
          template: './fire.template.hbs',
          context: {
            message: alarm.message,
          },
        });
        this.logger.log('Email/s sent');
      }
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
