import { ExecutionContext, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginUserDto } from '../dtos/loginUser.dto';

export class LoginUserDtoGuard {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const loginUserDto = plainToInstance(LoginUserDto, req.body);
    const errors = await validate(loginUserDto);

    if (errors.length > 0) {
      const message = errors
        .map((e) => Object.entries(e.constraints).map(([key, value]) => value))
        .flat();
      throw new BadRequestException(message);
    }

    return true;
  }
}
