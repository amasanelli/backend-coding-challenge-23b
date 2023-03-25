import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

class MultipleDaysDto {
  @IsOptional()
  @IsBoolean()
  monday?: boolean;

  @IsOptional()
  @IsBoolean()
  tuesday?: boolean;

  @IsOptional()
  @IsBoolean()
  wednesday?: boolean;

  @IsOptional()
  @IsBoolean()
  thursday?: boolean;

  @IsOptional()
  @IsBoolean()
  friday?: boolean;

  @IsOptional()
  @IsBoolean()
  saturday?: boolean;

  @IsOptional()
  @IsBoolean()
  sunday?: boolean;
}

export class CreateAlarmDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fire: Date;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  @IsBoolean()
  daily?: boolean;

  @IsOptional()
  @IsBoolean()
  monthly?: boolean;

  @IsOptional()
  @Type(() => MultipleDaysDto)
  multipleDays: MultipleDaysDto;
}
