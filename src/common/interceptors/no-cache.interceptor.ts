import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * @description キャッシュの制限を行うInterceptor
 */
@Injectable()
export class NoCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context
      .switchToHttp()
      .getResponse()
      .header('Cache-Control', 'private, no-store')
      .header('Pragma', 'no-cache');
    return next.handle();
  }
}
