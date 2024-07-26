import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      // urls is an array of rabbitmq uri broker to connect
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      // queue is where the messages will go to be consumed in this service
      // if messages need to be retried, they will be put back in this queue
      queue: 'auth',
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
