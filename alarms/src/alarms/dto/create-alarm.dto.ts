import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateAlarmDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fire: Date;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  message: string;
}
