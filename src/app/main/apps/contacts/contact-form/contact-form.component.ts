import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Contact } from 'app/main/apps/contacts/contact.model';

@Component({
  selector: 'contacts-contact-form-dialog',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContactsContactFormDialogComponent {
  action: string;
  contact: Contact;
  contactForm: FormGroup;
  dialogTitle: string;

  /**
   * Constructor
   *
   * @param {MatDialogRef<ContactsContactFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<ContactsContactFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
    // Set the defaults
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Contact';
      this.contact = _data.contact;
    } else {
      this.dialogTitle = 'New Contact';
      this.contact = new Contact({});
    }

    this.contactForm = this.createContactForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
     * Create contact form
     * this.nativeName = contact.nativeName || '';
      this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
      this.capital = contact.capital || '';
      this.subregion = contact.subregion || '';
      this.region = contact.region || '';
      this.population = contact.population || '';
      this.latlng = contact.latlng || '';
     * @returns {FormGroup}
     */
  createContactForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.contact.id],
      name: [this.contact.name],
      nativeName: [this.contact.nativeName],
      capital: [this.contact.capital],
      region: [this.contact.region],
      subregion: [this.contact.subregion],
      latlng: [this.contact.latlng],
      avatar: [this.contact.avatar],
      population: [this.contact.population]
    });
  }
}
