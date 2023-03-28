import { Module } from '@nestjs/common';
import { AlarmsService } from './alarms.service';
import { AlarmsController } from './alarms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './entities/alarm.entity';
import { Subscription } from './entities/subscription.entity';
import { RedisProducerModule } from '../redisProducer/redisProducer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alarm, Subscription]),
    RedisProducerModule,
  ],
  controllers: [AlarmsController],
  providers: [AlarmsService],
  exports: [AlarmsService],
})
export class AlarmsModule {}
