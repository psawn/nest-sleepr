import { UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';
import { app } from './app';
import { lastValueFrom } from 'rxjs';

export const authContext = async ({ req }) => {
  try {
    // need access to auth client in this function
    // since this function run outside of nestjs context
    // need pull or register auth service in this function
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);

    // lastValueFrom convert observable to promise
    const user = await lastValueFrom(
      authClient.send('authenticate', {
        Authentication: req.headers?.authentication,
      }),
    );

    return { user };
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
