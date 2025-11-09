import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderConfig } from '../model/contact-model';
import { CommonModule } from '@angular/common';
import { AppConstant } from '../constants/app-constant';

@Component({
  selector: 'main-header',
  imports: [TranslateModule, RouterLink, CommonModule],
  templateUrl: './main-header-component.html',
  styleUrl: './main-header-component.css'
})
export class MainHeaderComponent implements OnInit, OnDestroy {
  @Input() headerConfig!: HeaderConfig;
  @Output() headerEvents: EventEmitter<any> = new EventEmitter<any>()

  constructor(private router: Router) {

  }

  ngOnInit(): void {

  }

  save(): void {
    this.headerEvents.emit(AppConstant.SAVE);
  }

  edit(): void {
    this.headerEvents.emit(AppConstant.EDIT_CONTACT);
  }

  cancel(): void {
    this.headerEvents.emit(AppConstant.CANCEL);
  }

  ngOnDestroy(): void {

  }

  backNavigation(): void {
    this.router.navigate(['contact']);
  }

}
