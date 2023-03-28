import { Module } from '@nestjs/common';
import { AlarmsModule } from '../alarms/alarms.module';
import { MailModule } from '../mail/mail.module';
import { RedisConsumerService } from './redisConsumer.service';

@Module({
  imports: [AlarmsModule, MailModule],
  providers: [RedisConsumerService],
})
export class RedisConsumerModule {}
