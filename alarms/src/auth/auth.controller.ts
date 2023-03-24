import { Controller, Req, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/loginUser.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { LoginUserDtoGuard } from './guards/loginUserDto.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LoginUserDtoGuard, LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }
}
