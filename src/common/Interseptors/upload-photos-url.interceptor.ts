import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class PhotosUrlInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const files = req.files as Express.Multer.File[];

    // console.log(files);

    if (files && files.length) {
      req.body.photos = files.map(
        (file) => `http://localhost:3000/uploads/${file.filename}`,
      );
    }

    // console.log(req.body);

    return next.handle();
  }
}
