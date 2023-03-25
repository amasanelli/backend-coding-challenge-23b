import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { Alarm } from './alarm.entity';

@Entity('subscriptions')
@Index(['email', 'alarm'], { unique: true })
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @ManyToOne(() => Alarm, (alarm) => alarm.subscriptions, {
    onDelete: 'CASCADE',
  })
  alarm: Alarm;
}
