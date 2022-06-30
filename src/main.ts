import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './global/config/documentation/swagger.config';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  // Set the validation pipe and enable CORS
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // Implementation of Swagger
  const config = swaggerConfig;
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService: ConfigService = new ConfigService();

  // Listening on port of application ant start the server
  await app.listen(configService.get('PORT'), configService.get('HOST'));
  logger.log(`Application listening on: ${await app.getUrl()}`);
}
bootstrap();
