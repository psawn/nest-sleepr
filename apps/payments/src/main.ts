import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { PaymentsModule } from './payments.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      // urls is an array of rabbitmq uri broker to connect
      urls: [configService.getOrThrow<string>('RABBITMQ_URI')],
      // queue is where the messages will go to be consumed in this service
      // if messages need to be retried, they will be put back in this queue
      queue: 'payments',
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
