// app-config.ts
import { ApplicationConfig } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideTranslateService, TranslateCompiler } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './auth/auth.interceptor';

// Concrete implementation of TranslateCompiler
export class CustomTranslateCompiler extends TranslateCompiler {
  compile(value: string, lang: string): string {
    return value;
  }

  compileTranslations(translations: any, lang: string): any {
    return translations;
  }
}

// Provider for the compiler
export const customTranslateCompilerProvider = {
  provide: TranslateCompiler,
  useClass: CustomTranslateCompiler
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    provideRouter(routes),
    provideTranslateService({
      lang: 'en',
      fallbackLang: 'en',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/locale-',
        suffix: '.json'
      })
    }),
    customTranslateCompilerProvider
  ]
};
