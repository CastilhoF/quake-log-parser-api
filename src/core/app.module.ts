import { Module, MiddlewareConsumer } from '@nestjs/common';
import { configEnvironmentsValidation } from '../global/config/env/config.env.schema';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { winston_config } from '../global/config/log/winston.config';
import { ParserModule } from '../modules/parser/parser.module';
import { RequestMiddleware } from '../global/middlewares/request.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.stage.${process.env.STAGE}.env`],
      validationSchema: configEnvironmentsValidation,
      isGlobal: true,
    }),
    WinstonModule.forRoot(winston_config),
    ParserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('/parser/*');
  }
}
