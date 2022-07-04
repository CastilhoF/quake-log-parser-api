import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

const readline = require('readline');

@Injectable()
export class Helpers {
  private games;

  constructor(private configService: ConfigService = new ConfigService()) {}

  private decodeKill(gameIndex: number, line: string) {
    const lineArgs = line.trim();

    const killerR = lineArgs.match(
      /(?:\d[0-9]{0,2}:\d[0-9] Kill: \d[0-9]{0,4} \d \d[0-9]{0,2}: )([\s\S].+)(?: killed )/g,
    );
    const killer = killerR[0]
      .split(
        /(?:\d[0-9]{0,2}:\d[0-9] Kill: \d[0-9]{0,4} \d \d[0-9]{0,2}: )/g,
      )[1]
      .split(' killed')[0];
    const killed = lineArgs
      .match(/(?:killed )([\s\S]*)(?: by)/g)[0]
      .split('killed ')[1]
      .split(' by')[0];
    this.games[gameIndex][`game_${gameIndex + 1}`].total_kills++;

    // Register Killer
    if (killer !== '<world>') {
      if (
        !this.games[gameIndex][`game_${gameIndex + 1}`].players.includes(killer)
      ) {
        this.games[gameIndex][`game_${gameIndex + 1}`].players.push(killer);
      }
      if (
        !this.games[gameIndex][`game_${gameIndex + 1}`].kills.hasOwnProperty(
          killer,
        )
      ) {
        this.games[gameIndex][`game_${gameIndex + 1}`].kills[killer] = 0;
      }
      this.games[gameIndex][`game_${gameIndex + 1}`].kills[killer]++;
    }

    //Register Killed
    if (
      !this.games[gameIndex][`game_${gameIndex + 1}`].players.includes(killed)
    ) {
      this.games[gameIndex][`game_${gameIndex + 1}`].players.push(killed);
    }

    if (killer === '<world>') {
      if (this.games[gameIndex][`game_${gameIndex + 1}`].kills[killed] > 0) {
        this.games[gameIndex][`game_${gameIndex + 1}`].kills[killed]--;
      }
    }
  }

  private decodeKillForTotal(gameIndex: number, line: string) {
    const lineArgs = line.trim();

    const killerR = lineArgs.match(
      /(?:\d[0-9]{0,2}:\d[0-9] Kill: \d[0-9]{0,4} \d \d[0-9]{0,2}: )([\s\S].+)(?: killed )/g,
    );
    const killer = killerR[0]
      .split(
        /(?:\d[0-9]{0,2}:\d[0-9] Kill: \d[0-9]{0,4} \d \d[0-9]{0,2}: )/g,
      )[1]
      .split(' killed')[0];
    const killed = lineArgs
      .match(/(?:killed )([\s\S]*)(?: by)/g)[0]
      .split('killed ')[1]
      .split(' by')[0];

    // Register Killer
    if (killer !== '<world>') {
      if (
        !this.games[gameIndex][
          `game_${gameIndex + 1}`
        ].general_ranking.hasOwnProperty(killer)
      ) {
        this.games[gameIndex][`game_${gameIndex + 1}`].general_ranking[
          killer
        ] = 0;
      }
      this.games[gameIndex][`game_${gameIndex + 1}`].general_ranking[killer]++;
    }

    //Register Killed
    if (killer === '<world>') {
      if (
        this.games[gameIndex][`game_${gameIndex + 1}`].general_ranking[killed] >
        0
      ) {
        this.games[gameIndex][`game_${gameIndex + 1}`].general_ranking[
          killed
        ]--;
      }
      if (
        !this.games[gameIndex][
          `game_${gameIndex + 1}`
        ].killed_by_world.hasOwnProperty(killed)
      ) {
        this.games[gameIndex][`game_${gameIndex + 1}`].killed_by_world[
          killed
        ] = 0;
      }
      this.games[gameIndex][`game_${gameIndex + 1}`].killed_by_world[killed]++;
    }
  }

  private decodeDeathForTotal(gameIndex: number, line: string) {
    const lineArgs = line.trim().split(' ');
    const deathCause = lineArgs[lineArgs.length - 1];

    if (!this.games[gameIndex][`game_${gameIndex + 1}`].kill_by_means) {
      this.games[gameIndex][`game_${gameIndex + 1}`].kill_by_means = {};
    }

    if (
      !this.games[gameIndex][`game_${gameIndex + 1}`].kill_by_means[deathCause]
    ) {
      this.games[gameIndex][`game_${gameIndex + 1}`].kill_by_means[
        deathCause
      ] = 0;
    }
    this.games[gameIndex][`game_${gameIndex + 1}`].kill_by_means[deathCause]++;
  }

  private newGame(params): string {
    const gameCount = this.games.length;

    const gameLength = gameCount + 1;

    const newGame = {};

    newGame[`game_${gameLength}`] = params;

    this.games.push(newGame);

    return gameCount;
  }

  private endGame(gameIndex: number) {
    if (!this.games[gameIndex][`game_${gameIndex + 1}`].total_kills) {
      this.games;
    }
  }

  public sortRanking(a: any, b: any) {
    if (a[1] < b[1]) return 1;
    else if (a[1] > b[1]) return -1;
    return 0;
  }

  async readFile(): Promise<string[]> {
    try {
      const lines = [];
      const filePath = this.configService.get('LOG_PATH');
      const file = fs.createReadStream(filePath);
      const reader = readline.createInterface({
        input: file,
        output: null,
        console: false,
      });

      for await (const line of reader) {
        lines.push(line);
      }

      return lines;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async mainReport(content: string[]) {
    this.games = [];

    let gameIndex = null;

    for (const line of content) {
      if (line.includes('InitGame:')) {
        gameIndex = this.newGame({ total_kills: 0, players: [], kills: {} });
      }

      if (line.includes('ShutdownGame')) {
        this.endGame(gameIndex);
      }

      if (line.includes('Kill:')) {
        this.decodeKill(gameIndex, line);
      }
    }
    return this.games;
  }

  async TotalReport(content: string[], game: number) {
    this.games = [];

    let gameIndex = null;

    const getIndex: number = game - 1;

    content.forEach((line) => {
      if (line.includes('InitGame:')) {
        gameIndex = this.newGame({
          kill_by_means: {},
          general_ranking: {},
          killed_by_world: {},
        });
      }

      if (line.includes('ShutdownGame')) {
        this.endGame(gameIndex);
      }

      if (line.includes('Kill:')) {
        this.decodeKillForTotal(gameIndex, line);
        this.decodeDeathForTotal(gameIndex, line);
      }
    });
    return this.games[getIndex];
  }
}
