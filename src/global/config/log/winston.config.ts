import { utilities } from 'nest-winston';
import * as path from 'path';
import * as winston from 'winston';
import {
  ConsoleTransportInstance,
  ConsoleTransportOptions,
  FileTransportInstance,
  FileTransportOptions,
} from 'winston/lib/winston/transports';

const { transports } = winston;
const { Console, File } = transports;
const DIR_PATH = path.join(__dirname, './../../../../logs/');

/**
 * WINSTON CONFIG OPTIONS
 **/
const console_options: ConsoleTransportOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.ms(),
    utilities.format.nestLike('quake-log-parser', {
      prettyPrint: true,
    }),
  ),
  level: 'debug',
};

const debug_options: FileTransportOptions = {
  dirname: DIR_PATH,
  filename: 'debug.log',
  level: 'debug',
};

const info_options: FileTransportOptions = {
  dirname: DIR_PATH,
  filename: 'info.log',
  level: 'info',
};

const warn_options: FileTransportOptions = {
  dirname: DIR_PATH,
  filename: 'warn.log',
  level: 'warn',
};

const error_options: FileTransportOptions = {
  dirname: DIR_PATH,
  filename: 'error.log',
  level: 'error',
};

const log_console: ConsoleTransportInstance = new Console(console_options);
const log_debug: FileTransportInstance = new File(debug_options);
const log_info: FileTransportInstance = new File(info_options);
const log_warn: FileTransportInstance = new File(warn_options);
const log_error: FileTransportInstance = new File(error_options);

export const winston_config = {
  transports: [log_console, log_debug, log_info, log_warn, log_error],
};
