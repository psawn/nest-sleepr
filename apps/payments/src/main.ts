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
      // noAck = false -> message will be not removed immediately in the queue 
      // the consumer need send acknowledgement back to notify that they received the message -> message will be removed
      // the producer will automatically retry the message if the consumer does not send the acknowledgement
      noAck: false,
      // queueOptions: {
      //   // time to live for the message in the queue in milliseconds
      //   messageTtl: 1000 * 60 * 60, // 1 hour
      //   // time to live for queue in milliseconds
      //   expires: 1000 * 60 * 60 * 24 * 7 // 7 days
      // }
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
