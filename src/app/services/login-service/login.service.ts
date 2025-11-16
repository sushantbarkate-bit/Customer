import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  catchError,
  filter,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from "rxjs";
import { LoginResponse } from "../../model/login-model";
import { CacheService } from "../cache-service/cache.service";
import { SessionStorageKeys } from "../../constants/SessionStorageKeys";
import { environment } from "../../../environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);
  private tokenTimer: any;

  private baseUrl = environment.loginApi;

  constructor(private httpClient: HttpClient, private cacheService: CacheService) { }

  get refreshTokenSub() {
    return this.refreshTokenSubject;
  }

  registerUser(user: any) {
    return this.httpClient.post(`${this.baseUrl}/auth/register`, user, { observe: "response" });
  }

  login(user: any): Observable<HttpResponse<LoginResponse>> {
    return this.httpClient.post<LoginResponse>(`${this.baseUrl}/auth/login`, user, { observe: "response" });
  }

  getRefreshToken(refreshToken: string): Observable<HttpResponse<LoginResponse>> {
    return this.httpClient.post<LoginResponse>(
      `${this.baseUrl}/auth/refresh`,
      { refreshToken },
      { observe: "response" }
    );
  }

  get accessToken(): string | null {
    const data = this.cacheService.getLocalStorage(SessionStorageKeys.AUTH_INFO);
    return data?.accessToken ?? null;
  }

  get refreshToken(): string | null {
    const data = this.cacheService.getLocalStorage(SessionStorageKeys.AUTH_INFO);
    return data?.refreshToken ?? null;
  }

  setTokens(response: LoginResponse): void {
    this.cacheService.setSessionStorage(SessionStorageKeys.AUTH_INFO, response);
    this.cacheService.setLocalStorage(SessionStorageKeys.AUTH_INFO, response);
    this.startTokenTimer(); // start proactive refresh
  }

  clearTokens(): void {
    this.cacheService.removeSessionStorage(SessionStorageKeys.AUTH_INFO);
    this.cacheService.removeLocalStorage(SessionStorageKeys.AUTH_INFO);
    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
  }

  refreshAccessToken(): Observable<HttpResponse<LoginResponse>> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap(() => throwError(() => new Error("Retry logic can go here")))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.getRefreshToken(this.refreshToken ?? "").pipe(
      tap((token) => {
        const body = token?.body;
        if (body) {
          this.isRefreshing = false;
          this.setTokens(body);
          this.refreshTokenSubject.next(body.accessToken);
        }
      }),
      catchError((err) => {
        this.isRefreshing = false;
        this.clearTokens();
        return throwError(() => err);
      })
    );
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() > payload.exp * 1000;
    } catch {
      return true;
    }
  }

  // 🚀 Automatically refresh 30 seconds before expiry
  private startTokenTimer(): void {
    const token = this.accessToken;
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiresIn = payload.exp * 1000 - Date.now() - 30_000; // refresh 30s early

      if (this.tokenTimer) clearTimeout(this.tokenTimer);
      this.tokenTimer = setTimeout(() => {
        this.refreshAccessToken().subscribe();
      }, Math.max(expiresIn, 0));
    } catch (e) {
      console.warn("Invalid token, skipping timer setup");
    }
  }
}
