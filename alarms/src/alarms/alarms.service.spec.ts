import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { AlarmsService } from './alarms.service';
import { CreateAlarmDto } from './dtos/create-alarm.dto';
import { Alarm } from './entities/alarm.entity';
import { Subscription } from './entities/subscription.entity';

// @ts-ignore
const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn((entity) => entity),
  create: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
}));

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('AlarmsService', () => {
  let service: AlarmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
      providers: [
        AlarmsService,
        {
          provide: getRepositoryToken(Alarm),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Subscription),
          useFactory: repositoryMockFactory,
        },
        {
          provide: MailService,
          useValue: { sendFiredAlarmMail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AlarmsService>(AlarmsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return one-shot ', () => {
    const createAlarmDto: CreateAlarmDto = {
      fire: new Date(),
      subject: '',
      message: '',
      daily: undefined,
      monthly: undefined,
      multipleDays: undefined,
    };
    expect(service.parseType(createAlarmDto)).toEqual('one-shot');
  });

  it('should return daily ', () => {
    const createAlarmDto: CreateAlarmDto = {
      fire: new Date(),
      subject: '',
      message: '',
      daily: true,
      monthly: undefined,
      multipleDays: undefined,
    };
    expect(service.parseType(createAlarmDto)).toEqual('daily');
  });

  it('should return monthly ', () => {
    const createAlarmDto: CreateAlarmDto = {
      fire: new Date(),
      subject: '',
      message: '',
      daily: false,
      monthly: true,
      multipleDays: undefined,
    };
    expect(service.parseType(createAlarmDto)).toEqual('monthly');
  });

  it('should return multipleDays ', () => {
    const createAlarmDto: CreateAlarmDto = {
      fire: new Date(),
      subject: '',
      message: '',
      daily: false,
      monthly: false,
      multipleDays: {
        monday: true,
        tuesday: false,
        wednesday: true,
      },
    };
    expect(service.parseType(createAlarmDto)).toEqual('1 3');
  });
});
