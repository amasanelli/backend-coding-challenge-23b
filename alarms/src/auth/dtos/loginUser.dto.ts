import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
