import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class RequestMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, params, query, body } = req;

    const requestLog = {
      method: method,
      url: originalUrl,
      params: params,
      query: query,
      body: body,
    };

    this.logger.debug(requestLog);

    next();
  }
}
