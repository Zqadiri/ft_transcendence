import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path } = request;

    const userAgent = request.get('user-agent') || '';
    // console.log('...');
    response.on('close', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const cookie = response.get('cookie');
      this.logger.log(
        `${method} ${request.path} ${statusCode} ${contentLength} - ${cookie} -  ${ip}`
      );
    });
    next();
  }
}
