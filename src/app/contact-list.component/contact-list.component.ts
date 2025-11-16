import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ContactService } from '../services/contact.service';
import { Contact } from '../model/contact-model';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';
import { AppConstant } from '../constants/app-constant';
import { NotificationsService } from '../services/notification-service/notifications.service';
import { Subject, takeUntil } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CacheService } from '../services/cache-service/cache.service';
import { SessionStorageKeys } from '../constants/SessionStorageKeys';
import { MatSortModule, Sort } from '@angular/material/sort';
import { SortIconColorDirective } from '../directives/sort-icon-color.directive';

@Component({
  selector: 'contact-list',
  imports: [TranslateModule, CommonModule, ScrollingModule, FormsModule, MatSortModule, SortIconColorDirective],
  standalone: true,
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  SortIconColor = {
    White: '#fff',
    Green: '#008000'
  };
  page = 0;
  size = 20; // number of contacts per page
  totalPages = 0;
  loading = false;
  contacts: Contact[] = [];
  contact: Contact = {} as Contact;
  subscribe$: Subject<any> = new Subject<any>();
  public filterEmail = '';
  filterName!: any;
  showFilter: boolean = false;
  totalCount!: number;
  isFilterOpen = false;
  userId: string;
  sortBy!: string;
  order!: string;

  constructor(private contactService: ContactService, private router: Router, private notificationsService: NotificationsService, private cacheService: CacheService, private cdr: ChangeDetectorRef) {
    this.userId = this.cacheService.getSessionStorage(SessionStorageKeys.AUTH_INFO).userId;
  }

  async ngOnInit(): Promise<void> {
    await this.getFilters();
    this.loadContacts();
  }

  getFilters() {
    return new Promise((resolve, reject) => {
      this.contactService.getFilters(this.userId).pipe(takeUntil(this.subscribe$)).subscribe({
        next: (response) => {
          if (response.body?.filter) {
            const contact: Contact = JSON.parse(response.body.filter as any);
            this.contact = {
              firstName: contact.firstName ? contact.firstName : '',
              lastName: contact.lastName ? contact.lastName : '',
              email: contact.email ? contact.email : '',
              phone: contact.phone ? contact.phone : ''
            }
          }
          resolve(true);
        },
        error: (response) => {

        }
      })
    })
  }

  loadContacts() {
    if (this.loading || (this.totalPages && this.page >= this.totalPages)) return;

    this.loading = true;
    this.contactService.filterContact(this.page, this.size, this.sortBy, this.order, this.contact).subscribe({
      next: (response: any) => {
        this.contacts = [...this.contacts, ...response.body];
        this.totalCount = response.headers.get('total-count');
        this.page++;
        this.loading = false;
        this.cdr.detectChanges();
      }
    })
  }

  sortData(event: Sort) {
    debugger
    this.page = 0;
    this.contacts = [];
    this.sortBy = event.active;
    this.order = event.direction;
    this.loadContacts()
  }

  applyFilter() {
    this.page = 0;
    this.toggleFilter();
    this.contacts = [];
    this.loadContacts();
    this.saveFiltersApplied();
  }

  downloadCsv() {
    this.contactService.downloadCsv().pipe(takeUntil(this.subscribe$)).subscribe({
      next: (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contacts.csv';
        a.click();
      }
    })
  }

  clearFilter() {
    this.page = 0;
    this.toggleFilter();
    this.contacts = [];
    this.contact = {} as Contact;
    this.loadContacts();
    this.saveFiltersApplied();
  }

  saveFiltersApplied() {
    this.contactService.saveFiltersApplied(this.contact, this.userId).pipe(takeUntil(this.subscribe$)).subscribe({
      next: (respone) => {

      }
    })
  }
  toggleFilter() {
    this.isFilterOpen = !this.isFilterOpen;
    this.showFilter = !this.showFilter;
  }

  onScroll(index: number) {
    const total = this.contacts.length;
    const threshold = 15; // start loading 5 items before reaching end
    if (!this.loading && index + threshold >= total && this.contacts.length < this.totalCount) {
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
