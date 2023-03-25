import { Controller, Req, Post, UseGuards, Body, Get } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger/dist';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/loginUser.dto';
import { GoogleAuthGuard } from './guards/googleAuth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import { LoginUserDtoGuard } from './guards/loginUserDto.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginUserDto })
  @UseGuards(LoginUserDtoGuard, LocalAuthGuard)
  @Post('login')
  async login(@Req() req: any) {
    return this.authService.login(req.user);
  }

  @Get('google-login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {}

  @Get('google-redirect')
  @UseGuards(GoogleAuthGuard)
  googleAuthRedirect(@Req() req) {
    return this.authService.login(req.user);
  }
}
