import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionStorageKeys } from '../../constants/SessionStorageKeys';
import { CacheService } from '../cache-service/cache.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private cacheService: CacheService) {}

  canActivate(): boolean {
    const isLoggedIn = !! this.cacheService.getSessionStorage(SessionStorageKeys.AUTH_INFO);
    if (!isLoggedIn) {
      this.router.navigate([''])
      return false;
    }
    return true;
  }
}
