import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

// @ts-ignore
const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOneBy: jest.fn((entity) => entity),
  create: jest.fn((entity) => entity),
  save: jest.fn((entity) => entity),
}));

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

const configuration = () => ({
  hashRounds: 10,
});

describe('UsersService', () => {
  let service: UsersService;
  let repositoryMock: MockType<Repository<User>>;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
      ],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    configService = module.get<ConfigService>(ConfigService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  it('should find a user', async () => {
    const user: User = { email: 'test@test.com', id: 1, password: '123' };
    repositoryMock.findOneBy.mockReturnValue(user);
    expect(service.findOne(user.email)).toEqual(user);
    expect(repositoryMock.findOneBy).toHaveBeenCalledWith({
      email: user.email,
    });
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@test.com',
      password: '123',
    };
    const user: User = {
      email: 'test@test.com',
      id: 1,
      password: '$2b$10$VdVQ72N6kLs4xgrGMDVegOZ3H7ILfG1FETwtvkledhbsfqWCjKrVG',
    };
    repositoryMock.create.mockReturnValue(user);
    const response = await service.create(createUserDto);
    expect(response).toEqual(user);
  });
});
