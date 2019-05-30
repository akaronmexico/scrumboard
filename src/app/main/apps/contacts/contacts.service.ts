import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Contact } from 'app/main/apps/contacts/contact.model';
import { environment } from 'environments/environment';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

@Injectable({
  providedIn: 'root'
})
export class ContactsService implements Resolve<any> {
  onContactsChanged: BehaviorSubject<any>;
  onSelectedContactsChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;
  baseURL = environment.baseUrl;
  contacts: Contact[];
  user: any;
  selectedContacts: string[] = [];

  searchText: string;
  filterBy: string;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private loaderService: FuseProgressBarService
  ) {
    // Set the defaults
    this.onContactsChanged = new BehaviorSubject([]);
    this.onSelectedContactsChanged = new BehaviorSubject([]);
    this.onUserDataChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getContacts()]).then(([files]) => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getContacts();
        });

        this.onFilterChanged.subscribe(filter => {
          this.filterBy = filter;
          this.getContacts();
        });

        resolve();
      }, reject);
    });
  }

  /**
   * Get contacts
   *
   * @returns {Promise<any>}
   */
  getContacts(): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/partnerconfig')
        .subscribe((response: any) => {
          try {
            this.contacts = response;

            if (this.searchText && this.searchText !== '') {
              this.contacts = FuseUtils.filterArrayByString(
                this.contacts,
                this.searchText
              );
            }

            this.contacts = this.contacts.map(contact => {
              return new Contact(contact);
            });

            this.onContactsChanged.next(this.contacts);
            this.hideLoader();
            resolve(this.contacts);
          } catch (err) {
            console.log('err: ' + JSON.stringify(err, null, 2));
          }
        }, reject);
    });
  }

  /**
   * Toggle selected contact by id
   *
   * @param id
   */
  toggleSelectedContact(id): void {
    // First, check if we already have that contact as selected...
    if (this.selectedContacts.length > 0) {
      const index = this.selectedContacts.indexOf(id);

      if (index !== -1) {
        this.selectedContacts.splice(index, 1);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedContacts.push(id);

    // Trigger the next event
    this.onSelectedContactsChanged.next(this.selectedContacts);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedContacts.length > 0) {
      this.deselectContacts();
    } else {
      this.selectContacts();
    }
  }

  /**
   * Select contacts
   *
   * @param filterParameter
   * @param filterValue
   */
  selectContacts(filterParameter?, filterValue?): void {
    this.selectedContacts = [];

    // If there is no filter, select all contacts
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedContacts = [];
      this.contacts.map(contact => {
        this.selectedContacts.push(contact.uuid);
      });
    }

    // Trigger the next event
    this.onSelectedContactsChanged.next(this.selectedContacts);
  }

  /**
   * Update contact
   *
   * @param contact
   * @returns {Promise<any>}
   */
  updateContact(contact: Contact): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      delete contact['chart'];
      delete contact['histogram'];
      try {
        this._httpClient
          .post(this.baseURL + '/partnerconfig/' + contact.uuid, { ...contact })
          .subscribe(
            response => {
              this.getContacts()
                .then(res => {})
                .finally(() => {
                  this.hideLoader();
                  resolve(response);
                });
            },
            err => {
              this.hideLoader();
              console.log('error: ' + JSON.stringify(err, null, 2));
              reject(null);
            }
          );
      } catch (e) {
        console.log('e2: ' + JSON.stringify(e, null, 2));
      }
    });
  }

  /**
   * Deselect contacts
   */
  deselectContacts(): void {
    this.selectedContacts = [];

    // Trigger the next event
    this.onSelectedContactsChanged.next(this.selectedContacts);
  }

  /**
   * Delete contact
   *
   * @param contact
   */
  deleteContact(contact): void {
    this.showLoader();
    this._httpClient
      .delete(this.baseURL + '/partners/' + contact.id, {})
      .subscribe(response => {
        const contactIndex = this.contacts.indexOf(contact);
        this.contacts.splice(contactIndex, 1);
        this.onContactsChanged.next(this.contacts);
        this.hideLoader();
      });
  }

  /**
   * Delete selected contacts
   */
  deleteSelectedContacts(): void {
    for (const contactId of this.selectedContacts) {
      const contact = this.contacts.find(_contact => {
        return _contact.uuid === contactId;
      });
      this._httpClient
        .delete(this.baseURL + '/partners/' + contact.uuid, {})
        .subscribe(response => {
          const contactIndex = this.contacts.indexOf(contact);
          this.contacts.splice(contactIndex, 1);
        });
    }
    this.onContactsChanged.next(this.contacts);
    this.deselectContacts();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
