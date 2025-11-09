import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContactService } from '../services/contact.service';
import { Contact, HeaderConfig } from '../model/contact-model';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstant } from '../constants/app-constant';
import { HttpResponse } from '@angular/common/http';
import { MainHeaderComponent } from '../main-header-component/main-header-component';

@Component({
  selector: 'add-edit-contact',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MainHeaderComponent],
  templateUrl: './add-edit-contact-component.html',
  styleUrl: './add-edit-contact-component.css'
})
export class AddEditContactComponent implements OnInit {
  contactForm!: FormGroup;
  subscribe$: Subject<any> = new Subject<any>();
  appConstnat = AppConstant;
  viewMode!: boolean;
  addMode!: boolean;
  editMode!: boolean;
  contactId: string = '';
  headerConfig!: HeaderConfig;


  constructor(
    private fb: FormBuilder, public translate: TranslateService,
    private contactService: ContactService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.initialiseContactForm();
    this.setData();
  }

  setData(): void {
    this.initMode();
  }

  setViewHeaderConfig(): void {
    this.headerConfig = {
      headerTitle: 'constact.contact.application.title',
      showAddButton: false,
      showCancelButton: false,
      showEditButton: true,
      showNavigationArrow: true
    }
  }

  setEditHeaderConfig(): void {
    this.headerConfig = {
      headerTitle: 'constact.contact.application.title',
      showAddButton: false,
      showCancelButton: true,
      showEditButton: false,
      showSaveButton: true,
      showNavigationArrow: false
    }
  }

  initMode(): void {
    if (this.activatedRoute.snapshot.params['id']) {
      this.contactId = this.activatedRoute.snapshot.params['id'];
      this.getContact();
      if (this.activatedRoute.snapshot.params['mode'] === AppConstant.VIEW) {
        this.setViewMode();
        this.setViewHeaderConfig();
      } else {
        this.setEditMode();
        this.setEditHeaderConfig();
      }
    } else {
      this.setAddMode();
      this.setEditHeaderConfig();
    }
  }

  setViewMode(): void {
    this.viewMode = true;
    this.addMode = false;
    this.editMode = false;
  }

  setEditMode(): void {
    this.viewMode = false;
    this.addMode = false;
    this.editMode = true;
  }

  setAddMode(): void {
    this.viewMode = false;
    this.addMode = true;
    this.editMode = false;
  }

  updateContact(contact: Contact): void {
    this.contactService.updateContact(this.contactId, contact).pipe(takeUntil(this.subscribe$)).subscribe({
      next: (response: HttpResponse<Contact>) => {
        this.patchValuesToFormGroup(response.body);
        this.setViewMode();
        this.setViewHeaderConfig();
        this.contactForm.disable();
      }, error: () => {

      }
    })
  }

  getContact() {
    this.contactService.getContact(this.contactId).pipe(takeUntil(this.subscribe$)).subscribe({
      next: (response: HttpResponse<Contact>) => {
        this.patchValuesToFormGroup(response.body);
        if (this.viewMode) {
          this.contactForm.disable();
        }
      }, error: () => {

      }
    })
  }

  patchValuesToFormGroup(contact: Contact | null): void {
    if (contact) {
      this.contactForm.patchValue({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        micr: contact.micr || '',
        ifsc: contact.ifsc || '',
        address: contact.address || '',
        city: contact.city || '',
        state: contact.state || '',
        zip: contact.zip || '',
        country: contact.country || ''
      });
    } else {
      // reset if null passed
      this.contactForm.reset();
    }
  }

  [AppConstant.SAVE](): void {
    if (this.contactId) {
      this.updateContact(this.getContactFromFormGroup());
    } else {
      this.onSubmit();
    }
  }

  getContactFromFormGroup(): Contact {
    const contact: Contact = {
      firstName: this.contactForm.get('firstName')?.value,
      lastName: this.contactForm.get('lastName')?.value,
      email: this.contactForm.get('email')?.value,
      phone: this.contactForm.get('phone')?.value,
      address: this.contactForm.get('address')?.value,
      city: this.contactForm.get('city')?.value,
      country: this.contactForm.get('country')?.value,
      ifsc: this.contactForm.get('city')?.value,
      state: this.contactForm.get('state')?.value,
      zip: this.contactForm.get('zip')?.value,
    }
    return contact;
  }

  [AppConstant.EDIT_CONTACT](): void {
    this.headerConfig.showSaveButton = true;
    this.headerConfig.showCancelButton = true;
    this.headerConfig.showEditButton = false;
    this.headerConfig.showNavigationArrow = false;
    this.setEditMode();
    this.contactForm.enable();
  }

  [AppConstant.CANCEL](): void {
    if (this.contactId) {
      this.headerConfig.showSaveButton = false;
      this.headerConfig.showCancelButton = false;
      this.headerConfig.showEditButton = true;
      this.headerConfig.showNavigationArrow = true;
      this.contactForm.disable();
      this.setViewMode();
    } else {
      this.router.navigate(['contact']);
    }
  }

  headerEvents(event: string): void {
    this[event]();
  }

  test() {
    for (let i = 0; i < 1000; i++) {
      const contact: Contact = {
        firstName: this.randomString(6),
        lastName: this.randomString(8),
        email: `${this.randomString(5)}@example.com`,
        phone: this.randomNumberString(10),
        address: `${this.randomNumber(1000)} ${this.randomString(10)} Street`,
        city: this.randomString(6),
        country: this.randomString(7),
        ifsc: `IFSC${this.randomNumber(4)}`,
        state: this.randomString(6),
        zip: this.randomNumberString(6),
      };

      this.contactService.addNewContact(contact)
        .pipe(takeUntil(this.subscribe$))
        .subscribe({
          next: (response) => console.log('Contact created:', response),
          error: (err) => console.error('Error creating contact:', err)
        });
    }
  }

  // Helper: generate random string of given length
  randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Helper: generate random number up to max
  randomNumber(max: number): number {
    return Math.floor(Math.random() * max);
  }

  // Helper: generate random number string of given length
  randomNumberString(length: number): string {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  initialiseContactForm(): void {
    this.contactForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      micr: [''],
      ifsc: [''],
      address: [''],
      city: [''],
      state: [''],
      zip: [''],
      country: ['']
    });
  }

  onSubmit() {

    this.contactService.addNewContact(this.getContactFromFormGroup()).pipe(takeUntil(this.subscribe$)).subscribe({
      next: (response: HttpResponse<Contact | null>) => {
        const contactId = response.body?.id;
        if (contactId) {
          this.router.navigate(['contact', contactId, AppConstant.VIEW]);
          this.setViewMode();
        } else {

          console.error('Created contact response has no body');
        }
      }, error: () => {

      }
    })
  }

  goPrevious(): void {
    this.contactService.getPreviousContact(this.contactId).subscribe((response: any) => {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['contact', response.body.id, AppConstant.VIEW]);
    });
  }

  goNext(): void {
    this.contactService.getNextContact(this.contactId).subscribe((response: any) => {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['contact', response.body.id, AppConstant.VIEW]);
    });
  }
}
