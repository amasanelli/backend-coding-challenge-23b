import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.getOrThrow('google.clientId'),
      clientSecret: configService.getOrThrow('google.clientSecret'),
      callbackURL: 'http://localhost:3000/auth/google-redirect',
      scope: ['email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { emails } = profile;
    const user = await this.usersService.findOne(emails[0].value);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
