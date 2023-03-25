import { ApiProperty } from '@nestjs/swagger/dist';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional } from 'class-validator';

class MultipleDaysDto {
  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  monday?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  tuesday?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  wednesday?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  thursday?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  friday?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  saturday?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  sunday?: boolean;
}

export class CreateAlarmDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fire: Date;

  @ApiProperty()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  daily?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  monthly?: boolean;

  @ApiProperty()
  @IsOptional()
  @Type(() => MultipleDaysDto)
  multipleDays: MultipleDaysDto;
}
