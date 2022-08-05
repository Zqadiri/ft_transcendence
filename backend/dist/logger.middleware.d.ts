import { Request, Response, NextFunction } from 'express';
import { NestMiddleware } from '@nestjs/common';
export declare class AppLoggerMiddleware implements NestMiddleware {
    private logger;
    use(request: Request, response: Response, next: NextFunction): void;
}
