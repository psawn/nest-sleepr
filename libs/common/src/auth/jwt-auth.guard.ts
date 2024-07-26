import { catchError, map, Observable, of, tap } from 'rxjs';
import { Request } from 'express';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Reflector } from '@nestjs/core';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

// need to reach out to auth service to validate jwt
// any service which use this JWT guard need client proxy to inject auth service -> this is how we talk to other microservice
@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(JwtAuthGuard.name);
  private authService: AuthServiceClient;

  // @Inject to inject client proxy
  // -> this authClient will allow talk to other microservices via provided transport layer TCP
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly client: ClientGrpc,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

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

    return this.authService
      .authenticate({
        Authentication: jwt,
      })
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

          context.switchToHttp().getRequest().user = {
            ...res,
            _id: res.id,
          };
        }),
        map(() => true),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        }),
      );
  }
}
