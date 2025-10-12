import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { MainComponent } from './main-component/main-component';

export function HttpLoaderFactory() {
  return provideTranslateHttpLoader({
    prefix: './assets/i18n/',
    suffix: '.json'
  });
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    MainComponent,
    HttpClientModule,
    RouterOutlet
  ],
  templateUrl: './app.html',
  standalone: true,
})
export class App {
  protected readonly title = signal('customer');

  constructor(private translate: TranslateService) {
    translate.addLangs(['en', 'hi']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  banks = [
    { name: 'HDFC', micr: '123456789', ifsc: 'FNB0001234', address: 'Chinchwad' },
    { name: 'SBI', micr: '987654321', ifsc: 'PTB0009876', address: 'Pimpri' },
    { name: 'TJSB', micr: '987654323', ifsc: 'TJB0009876', address: 'Pune' },
  ];
}
