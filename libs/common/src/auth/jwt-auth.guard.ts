import { catchError, map, Observable, of, tap } from 'rxjs';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { AUTH_SERVICE } from '../constants/services';
import { User } from '../interfaces';


// need to reach out to auth service to validate jwt
// any service which use this JWT guard need client proxy to inject auth service -> this is how we talk to other microservice
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  // @Inject to inject client proxy
  // -> this authClient will allow talk to other microservices via provided transport layer TCP
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const jwt =
      request.cookies?.Authentication ||
      request.headers?.authorization?.split(' ')[1];

    if (!jwt) {
      return false;
    }

    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    return this.authClient
      .send<User>('authenticate', { Authentication: jwt })
      .pipe(
        // tap allow to execute side effect of the incoming response from auth service
        tap((res) => {
          if (roles) {
            for (const role of roles) {
              if (!res.roles.includes(role)) {
                this.logger.error('User does not have valid roles');
                throw new UnauthorizedException();
              }
            }
          }

          context.switchToHttp().getRequest().user = res;
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
