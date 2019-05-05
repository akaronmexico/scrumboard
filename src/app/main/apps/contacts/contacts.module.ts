import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatRippleModule,
  MatTableModule,
  MatChipsModule,
  MatToolbarModule,
  MAT_CHIPS_DEFAULT_OPTIONS
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { ContactsComponent } from 'app/main/apps/contacts/contacts.component';
import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsContactListComponent } from 'app/main/apps/contacts/contact-list/contact-list.component';
import { ContactsSelectedBarComponent } from 'app/main/apps/contacts/selected-bar/selected-bar.component';
import { ContactsMainSidebarComponent } from 'app/main/apps/contacts/sidebars/main/main.component';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  {
    path: '**',
    component: ContactsComponent,
    resolve: {
      contacts: ContactsService
    }
  }
];

@NgModule({
  declarations: [
    ContactsComponent,
    ContactsContactListComponent,
    ContactsSelectedBarComponent,
    ContactsMainSidebarComponent,
    ContactsContactFormDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule
  ],
  providers: [
    ContactsService,
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ],
  entryComponents: [ContactsContactFormDialogComponent]
})
export class ContactsModule {}
