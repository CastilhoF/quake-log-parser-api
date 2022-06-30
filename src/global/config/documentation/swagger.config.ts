import { DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

const configService: ConfigService = new ConfigService();

export const swaggerConfig = new DocumentBuilder()
  .setTitle(configService.get('SWAGGER_TITLE'))
  .addServer(configService.get('SWAGGER_SERVER_APP'))
  .setDescription(configService.get('SWAGGER_DESCRIPTION'))
  .setExternalDoc('Read more on Github', configService.get('GITHUB_REPO'))
  .setContact(
    configService.get('DEVELOPER_NAME'),
    configService.get('DEVELOPER_GITHUB_ACCOUNT'),
    configService.get('DEVELOPER_EMAIL'),
  )
  .setLicense('MIT', 'https://mit.com')
  .setVersion('1.0')
  .build();
