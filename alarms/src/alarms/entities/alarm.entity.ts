import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
