import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, User } from '@app/common';
import { CreateUserDto } from './dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUser(@CurrentUser() user: User) {
    return user;
  }
}
