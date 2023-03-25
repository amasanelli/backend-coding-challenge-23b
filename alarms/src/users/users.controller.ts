import { Controller, Body, Post, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      await this.usersService.create(createUserDto);
      return 'User created. Please login';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
