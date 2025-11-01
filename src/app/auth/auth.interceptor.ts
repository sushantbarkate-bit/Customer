import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CacheService } from '../services/cache-service/cache.service';
import { SessionStorageKeys } from '../constants/SessionStorageKeys';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private cacheService: CacheService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.cacheService.getSessionStorage(SessionStorageKeys.AUTH_INFO);

    // Skip adding token for auth APIs
    const isAuthRequest =
      request.url.includes('/auth/login') ||
      request.url.includes('/auth/register');

    if (token?.accessToken && !isAuthRequest) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token.accessToken}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          localStorage.removeItem(SessionStorageKeys.AUTH_INFO);
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
