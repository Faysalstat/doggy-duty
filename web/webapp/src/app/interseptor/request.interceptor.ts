import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Clone the request and modify headers if needed
    const modifiedReq = req.clone({
      setHeaders: {
        'timezone': timeZone
      }
    });

    return next.handle(modifiedReq).pipe(
      finalize(() => {
        console.log('Request Completed:', req.url);
      })
    );
  }
}
