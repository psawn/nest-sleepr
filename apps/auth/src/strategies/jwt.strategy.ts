import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // by default, jwt come from header value, but in this case it is cookie
      // need cookie parser middleware
      jwtFromRequest: ExtractJwt.fromExtractors([
        // when using client proxy to validate jwt, the jwt is coming from RPC call -> come from request object
        (request: any) => {
          console.log('request', request);
          return (
            request?.cookies?.Authentication ||
            request?.Authentication ||
            request?.headers?.Authentication
          );
        },
      ]),
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate({ userId }: TokenPayload) {
    console.log('userId', userId);

    return this.usersService.getUser({ _id: userId });
  }
}
