import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @ApiOperation({ summary: 'Report with the result per game [Task - 1]' })
  @ApiTags('Parser')
  @Get('/result-games')
  async getResultGames(@Res() res: Response) {
    return res
      .status(HttpStatus.OK)
      .json(await this.parserService.getResultGames());
  }

  @ApiOperation({
    summary: 'Total report per game [Task - 2 and 3]',
  })
  @ApiTags('Parser')
  @Get('/report-games')
  async getTotalization(@Res() res: Response, @Query('game') game: number) {
    return res
      .status(HttpStatus.OK)
      .json(await this.parserService.getReportGamesByGame(game));
  }
}
