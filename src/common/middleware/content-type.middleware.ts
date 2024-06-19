import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ContentTypeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (
      req.method === 'POST' &&
      req.headers['content-type'] !== 'application/json'
    ) {
      return res.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).json({
        message: 'Content-Type must be application/json',
      });
    }
    next();
  }
}
