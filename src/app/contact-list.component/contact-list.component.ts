import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../model/contact-model';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { AppConstant } from '../constants/app-constant';
import { NotificationsService } from '../services/notification-service/notifications.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'contact-list',
  imports: [TranslateModule, CommonModule, ScrollingModule],
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  page = 0;
  size = 20; // number of contacts per page
  totalPages = 0;
  loading = false;
  contacts: Contact[] = [];
  subscribe$: Subject<any> = new Subject<any>();

  constructor(private contactService: ContactService, private router: Router, private notificationsService: NotificationsService) {

  }

  ngOnInit(): void {
    this.loadContacts();
  }

  loadContacts() {
    if (this.loading || (this.totalPages && this.page >= this.totalPages)) return;

    this.loading = true;
    this.contactService.filterContact(this.page, this.size, '', true, 'sushant').subscribe({
      next: (response: any) => {
        this.contacts = [...this.contacts, ...response.body];
        // this.totalPages = res.totalPages;
        this.page++;
        this.loading = false;
      }
    })
    // this.contactService.getContacts(this.page, this.size, '',true, 'sushant').subscribe({
    //   next: (response: any) => {
    //     this.contacts = [...this.contacts , ...response.body];
    //     // this.totalPages = res.totalPages;
    //     this.page++;
    //     this.loading = false;
    //   }
    // })
  }

  isFilterOpen = false;

  toggleFilterPanel() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  onScroll(index: number) {
    const total = this.contacts.length;
    const threshold = 15; // start loading 5 items before reaching end
    if (!this.loading && index + threshold >= total) {
      // this.loadNextPage();
      this.loadContacts();
    }
    // this.loadContacts();
  }

  viewContact(contact: Contact): void {
    this.router.navigate(['/contact', contact.id, AppConstant.VIEW]);
  }

  editContact(contact: Contact): void {
    this.router.navigate(['/contact', contact.id, AppConstant.EDIT]);
  }

  deleteContact(contact: any): void {
    this.contactService.deleteContact(contact.id).pipe(takeUntil(this.subscribe$)).subscribe({
      next: (response) => {
        this.notificationsService.success('deleted');
      }
    })
  }

}
