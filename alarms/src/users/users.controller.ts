import {
  Controller,
  Get,
  UseGuards,
  Request,
  Body,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwtAuth.guard';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }

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
