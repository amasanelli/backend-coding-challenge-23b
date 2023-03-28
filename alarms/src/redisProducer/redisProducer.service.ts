import { InjectQueue } from '@nestjs/bull/dist/decorators';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { JobData } from '../redisConsumer/redisConsumer.service';

@Injectable()
export class RedisProducerService {
  constructor(@InjectQueue('alarms') private queue: Queue) {}

  private readonly logger = new Logger(RedisProducerService.name);

  async addAlarm(fire: Date, id: number) {
    try {
      const now = new Date();
      const delay = fire.getTime() - now.getTime();
      const jobData: JobData = {
        id,
      };
      await this.queue.add(jobData, {
        delay: delay > 0 ? delay : 0,
        jobId: id,
        removeOnComplete: true,
      });
      this.logger.log(`Alarm ${id} added`);
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async updateAlarm(fire: Date, id: number) {
    await this.deleteAlarm(id);
    await this.addAlarm(fire, id);
  }

  async deleteAlarm(id: number) {
    try {
      const job = await this.queue.getJob(id);
      await job.releaseLock();
      await job.remove();
      this.logger.log(`Alarm ${id} deleted`);
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
