import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ContactsService } from 'app/main/apps/contacts/contacts.service';
import { ContactsContactFormDialogComponent } from 'app/main/apps/contacts/contact-form/contact-form.component';
import { Target } from '../../targets/target.model';
import { Contact } from '../contact.model';

@Component({
  selector: 'contacts-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ContactsContactListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  contacts: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = [
    'checkbox',
    'avatar',
    'name',
    'nativeName',
    'region',
    'count',
    'histogram',
    'targets',
    'buttons'
  ];
  selectedContacts: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ContactsService} _contactsService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _contactsService: ContactsService,
    public _matDialog: MatDialog
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new FilesDataSource(this._contactsService);

    this._contactsService.onContactsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(contacts => {
        this.contacts = contacts;

        this.checkboxes = {};
        contacts.map(contact => {
          this.checkboxes[contact.id] = false;
        });
      });

    this._contactsService.onSelectedContactsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedContacts => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedContacts.includes(id);
        }
        this.selectedContacts = selectedContacts;
      });

    this._contactsService.onUserDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.user = user;
      });

    this._contactsService.onFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._contactsService.deselectContacts();
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Edit contact
   *
   * @param contact
   */
  editContact(contact): void {
    this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      width: '80vw',
      data: {
        contact: contact,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response.action;
      const formData: FormGroup = response.form;
      const targets: Target[] = response.targets;
      contact.name = formData.get('name').value;
      contact.targets = targets;
      switch (actionType) {
        /**
         * Save
         */
        case 'save':
          this._contactsService.updateContact(contact);

          break;
        /**
         * Delete
         */
        case 'delete':
          this.deleteContact(contact);

          break;
      }
    });
  }

  /**
   * Delete Contact
   */
  deleteContact(contact): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._contactsService.deleteContact(contact);
      }
      this.confirmDialogRef = null;
    });
  }

  /**
   * On selected change
   *
   * @param contactId
   */
  onSelectedChange(contactId): void {
    this._contactsService.toggleSelectedContact(contactId);
  }
}

export class FilesDataSource extends DataSource<any> {
  /**
   * Constructor
   *
   * @param {ContactsService} _contactsService
   */
  constructor(private _contactsService: ContactsService) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._contactsService.onContactsChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}
