import {
  Injectable,
  Inject,
  InternalServerErrorException,
  LoggerService,
} from '@nestjs/common';
import { Helpers } from './helpers/helper';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { TotalReportDto } from './dtos/total-report.dto';
import { NewGameReportDto } from './dtos/game-report.dto';

@Injectable()
export class ParserService {
  constructor(
    //@Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly helpers: Helpers,
  ) {}
  // Report all games
  async getResultGames() {
    const file = await this.helpers.readFile();
    const report = await this.helpers
      .mainReport(file)
      .then((res) => res)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException(err);
      });
    return report;
  }
  // Report games per game
  async getReportGamesByGame(game: number): Promise<NewGameReportDto> {
    const report = await this.helpers.readFile();
    const totalGames = await this.helpers
      .TotalReport(report, game)
      .then((res) => res)
      .catch((err) => {
        this.logger.error(err);
        throw new InternalServerErrorException(err);
      });
    const objectSorted = await this.sortByKills(totalGames, game);
    return objectSorted;
  }

  async sortByKills(
    game: NewGameReportDto[],
    index,
  ): Promise<NewGameReportDto> {
    const killByMeans = [];
    const generalRanking = [];
    const killedByWorld = [];

    killByMeans.push(Object.assign(game[`game_${index}`]).kill_by_means);
    generalRanking.push(Object.assign(game[`game_${index}`]).general_ranking);
    killedByWorld.push(Object.assign(game[`game_${index}`]).killed_by_world);

    const killByMeansToSort = Object.entries(killByMeans[0]).sort(
      this.helpers.sortRanking,
    );

    const generalRankingToSort = Object.entries(generalRanking[0]).sort(
      this.helpers.sortRanking,
    );

    const killedByWorldToSort = Object.entries(killedByWorld[0]).sort(
      this.helpers.sortRanking,
    );

    let killByMeansSorted = {};
    let generalRankingSorted = {};
    let killedByWorldSorted = {};

    killByMeansToSort.map((item) => {
      killByMeansSorted = {
        ...killByMeansSorted,

        [item[0]]: item[1],
      };
    });

    generalRankingToSort.map((item) => {
      generalRankingSorted = {
        ...generalRankingSorted,

        [item[0]]: item[1],
      };
    });

    killedByWorldToSort.map((item) => {
      killedByWorldSorted = {
        ...killedByWorldSorted,

        [item[0]]: item[1],
      };
    });

    Object.assign(game[`game_${index}`]).kill_by_means = {
      ...killByMeansSorted,
    };
    Object.assign(game[`game_${index}`]).general_ranking = {
      ...generalRankingSorted,
    };
    Object.assign(game[`game_${index}`]).killed_by_world = {
      ...killedByWorldSorted,
    };

    const newsGameObject: TotalReportDto = {
      kills_by_means: { ...killByMeansSorted },
      general_ranking: { ...generalRankingSorted },
      killed_by_world: { ...killedByWorldSorted },
    };

    const newGame: NewGameReportDto = { [`game_${index}`]: newsGameObject };
    return newGame;
  }
}
