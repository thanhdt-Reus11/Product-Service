import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('Product-Service (main.ts)');
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URI],
      queue: process.env.RABBIT_MQ_QUEUE,
      persistent: true,
      noAck: true,
    },
  });
  await app.listen();

  logger.log('Server is running ...')
}
bootstrap();
