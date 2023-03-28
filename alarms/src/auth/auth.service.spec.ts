import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dtos/loginUser.dto';

const configuration = () => ({
  jwtSecret: 'secret',
});

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => ({
            secret: configService.getOrThrow('jwtSecret'),
            signOptions: { expiresIn: '1h' },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [
        AuthService,
        { provide: UsersService, useValue: { findOne: jest.fn() } },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should validate an user', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@test.com',
      password: '123',
    };
    const user: User = {
      email: 'test@test.com',
      id: 1,
      password: '$2b$10$VdVQ72N6kLs4xgrGMDVegOZ3H7ILfG1FETwtvkledhbsfqWCjKrVG',
    };
    jest.spyOn(userService, 'findOne').mockResolvedValue(user);
    const response = await authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    expect(response).toEqual(user);
  });

  it('should return null on wrong password', async () => {
    const loginUserDto: LoginUserDto = {
      email: 'test@test.com',
      password: '456',
    };
    const user: User = {
      email: 'test@test.com',
      id: 1,
      password: '$2b$10$VdVQ72N6kLs4xgrGMDVegOZ3H7ILfG1FETwtvkledhbsfqWCjKrVG',
    };
    jest.spyOn(userService, 'findOne').mockResolvedValue(user);
    const response = await authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );
    expect(response).toEqual(null);
  });

  it('should return an access_token', async () => {
    const user: User = {
      email: 'test@test.com',
      id: 1,
      password: '$2b$10$VdVQ72N6kLs4xgrGMDVegOZ3H7ILfG1FETwtvkledhbsfqWCjKrVG',
    };
    const response = await authService.login(user);
    expect(response).toHaveProperty('access_token');
  });
});
