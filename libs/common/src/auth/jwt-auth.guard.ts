import { map, Observable, tap } from 'rxjs';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '../constants/services';
import { UserDto } from '../dto';

// need to reach out to auth service to validate jwt
// any service which use this JWT guard need client proxy to inject auth service -> this is how we talk to other microservice
@Injectable()
export class JwtAuthGuard implements CanActivate {
  // @Inject to inject client proxy
  // -> this authClient will allow talk to other microservices via provided transport layer TCP
  constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const jwt = context.switchToHttp().getRequest<Request>()
      .cookies?.Authentication;

    if (!jwt) {
      return false;
    }

    return this.authClient
      .send<UserDto>('authenticate', { Authentication: jwt })
      .pipe(
        // tap allow to execute side effect of the incoming response from auth service
        tap((res) => {
          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
      );
  }
}
