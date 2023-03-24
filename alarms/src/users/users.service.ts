import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hash = await bcrypt.hash(
      password,
      this.configService.getOrThrow('hashRounds'),
    );
    const user = this.usersRepository.create({ ...rest, password: hash });
    await this.usersRepository.save(user);
    return user;
  }

  findOne(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }
}
