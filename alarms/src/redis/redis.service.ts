import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

type ClientType = ReturnType<typeof createClient>;

@Injectable()
export class RedisService {
  private async execute(toDo: (client: ClientType) => any): Promise<any> {
    const client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();
    const result = await toDo(client);
    await client.disconnect();

    return result;
  }

  addAlarm(fire: Date, id: number) {
    this.execute(async (client) => {
      await client.zAdd('alarms', {
        score: fire.getTime(),
        value: id.toString(),
      });
    });
  }

  updateAlarm(fire: Date, id: number) {
    this.addAlarm(fire, id);
  }

  async getAlarms(now: Date) {
    const alarms = await this.execute(async (client) => {
      const alarms = await client.zRangeByScore('alarms', 0, now.getTime());
      return alarms;
    });

    return alarms;
  }

  deleteAlarms(now: Date) {
    this.execute(async (client) => {
      await client.zRemRangeByScore('alarms', 0, now.getTime());
    });
  }

  deleteAlarm(id: number) {
    this.execute(async (client) => {
      await client.zRem('alarms', id.toString());
    });
  }
}
