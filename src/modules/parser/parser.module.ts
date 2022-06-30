import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';

@Module({
  controllers: [ParserController],
  imports: [HttpModule, ConfigModule, HttpModule],
  providers: [ParserService, ConfigService],
})
export class ParserModule {}
