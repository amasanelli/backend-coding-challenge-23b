import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import configuration from './config/env.config';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { AlarmsModule } from './alarms/alarms.module';
import { Alarm } from './alarms/entities/alarm.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { RedisModule } from './redis/redis.module';
import { Subscription } from './alarms/entities/subscription.entity';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow('mysql.host'),
        port: configService.getOrThrow('mysql.port'),
        username: configService.getOrThrow('mysql.username'),
        password: configService.getOrThrow('mysql.password'),
        database: configService.getOrThrow('mysql.database'),
        entities: [User, Alarm, Subscription],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    AlarmsModule,
    RedisModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
