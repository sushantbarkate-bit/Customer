import { Component, OnInit } from '@angular/core';
import { ContactListComponent } from '../contact-list.component/contact-list.component';
import { MainHeaderComponent } from '../main-header-component/main-header-component';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderConfig } from '../model/contact-model';

@Component({
  selector: 'main',
  imports: [ContactListComponent, MainHeaderComponent],
  templateUrl: './main-component.html',
  styleUrl: './main-component.css'
})
export class MainComponent implements OnInit {
  headerConfig!: HeaderConfig;

  ngOnInit(): void {
    this.setHeaderConfig();
  }

  setHeaderConfig(): void {
    this.headerConfig = {
      headerTitle: 'constact.contact.application.title',
      showAddButton: true,
      showCancelButton: false,
      showEditButton: false,
      showNavigationArrow: false
    }
   
  }

}
