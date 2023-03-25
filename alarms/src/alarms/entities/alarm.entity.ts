import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('alarms')
export class Alarm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  message: string;

  @Column()
  fire: Date;

  @Column()
  nextFire: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.alarm)
  subscriptions: Subscription[];

  @Column()
  type: string;
}
