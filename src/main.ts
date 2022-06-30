import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const configService: ConfigService = new ConfigService();

  await app.listen(configService.get('PORT'), configService.get('HOST'));
  logger.log(`Application listening on: ${await app.getUrl()}`);
}
bootstrap();
