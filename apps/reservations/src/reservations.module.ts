import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import {
  DatabaseModule,
  LoggerModule,
  AUTH_SERVICE,
  PAYMENTS_SERVICE,
} from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { PrismaService } from './prisma.service';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      envFilePath: './apps/reservations/.env',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number().required(),
        AUTH_HOST: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        PAYMENTS_HOST: Joi.string().required(),
        PAYMENTS_PORT: Joi.number().required(),
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: './apps/reservations/.env.local',
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configSerfice: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configSerfice.get('AUTH_HOST'),
            port: configSerfice.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: PAYMENTS_SERVICE,
        useFactory: (configSerfice: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configSerfice.get('PAYMENTS_HOST'),
            port: configSerfice.get('PAYMENTS_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, PrismaService],
})
export class ReservationsModule {}
