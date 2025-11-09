import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError, switchMap, catchError } from "rxjs";
import { LoginService } from "../services/login-service/login.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.loginService.accessToken;
    let cloned = req;

    // Attach token if exists
    if (token) {
      cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(cloned).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 403) {
          // Token expired or invalid → try refresh
          return this.loginService.refreshAccessToken().pipe(
            switchMap((res: any) => {
              const newToken = res?.body?.accessToken;
              if (newToken) {
                const retryReq = req.clone({
                  setHeaders: { Authorization: `Bearer ${newToken}` },
                });
                return next.handle(retryReq);
              }
              this.loginService.clearTokens();
              return throwError(() => error);
            }),
            catchError((err) => {
              this.loginService.clearTokens();
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
