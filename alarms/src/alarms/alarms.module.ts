import { Module } from '@nestjs/common';
import { AlarmsService } from './alarms.service';
import { AlarmsController } from './alarms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './entities/alarm.entity';
import { RedisService } from '../redis/redis.service';
import { Subscription } from './entities/subscription.entity';
import { RedisModule } from '../redis/redis.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alarm, Subscription]),
    RedisModule,
    MailModule,
  ],
  controllers: [AlarmsController],
  providers: [AlarmsService],
})
export class AlarmsModule {}
