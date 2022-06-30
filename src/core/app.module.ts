import { Module } from '@nestjs/common';
import { configEnvironmentsValidation } from '../global/config/env/config.env.schema';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winston_config } from '../global/config/log/winston.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.stage.${process.env.STAGE}.env`],
      validationSchema: configEnvironmentsValidation,
    }),
    WinstonModule.forRoot(winston_config),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
