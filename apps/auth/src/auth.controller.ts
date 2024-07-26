import { Response } from 'express';
import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  CurrentUser,
  UsersDocument,
} from '@app/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard, LocalAuthGuard } from './guards';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @Get('health-check')
  healthCheck() {
    return 'OK';
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UsersDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    const jwt = await this.authService.login(user, response);
    response.send(jwt);
  }

  @UseGuards(JwtAuthGuard)
  async authenticate(@Payload() data: any) {
    return {
      ...data.user,
      id: data.user._id,
    };
  }
}
