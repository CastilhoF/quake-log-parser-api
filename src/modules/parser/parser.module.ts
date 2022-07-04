import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Helpers } from './helpers/helper';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';

@Module({
  controllers: [ParserController],
  imports: [HttpModule, ConfigModule],
  providers: [ParserService, ConfigService, Helpers, Object],
})
export class ParserModule {}
