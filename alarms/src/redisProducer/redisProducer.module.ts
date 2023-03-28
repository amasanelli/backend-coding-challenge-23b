import { BullModule } from '@nestjs/bull/dist/bull.module';
import { Module } from '@nestjs/common';
import { RedisProducerService } from './redisProducer.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'alarms',
    }),
  ],
  providers: [RedisProducerService],
  exports: [RedisProducerService],
})
export class RedisProducerModule {}
