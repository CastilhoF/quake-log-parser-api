import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @ApiOperation({ summary: 'Read kills in the log file' })
  @ApiTags('Parser')
  @Get('/kills')
  async getKills(@Res() res: Response) {
    this.parserService.getKillData(function (obj: any) {
      res.status(HttpStatus.OK).send(obj);
    });
  }

  @ApiOperation({ summary: 'Read deaths in the log file' })
  @ApiTags('Parser')
  @Get('/deaths')
  async getDeaths(@Res() res: Response) {
    this.parserService.getDeathData(function (obj: any) {
      res.status(HttpStatus.OK).send(obj);
    });
  }
}
