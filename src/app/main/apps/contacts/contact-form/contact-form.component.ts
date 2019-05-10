import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from '@angular/material';

import { Contact } from 'app/main/apps/contacts/contact.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Target } from '../../targets/target.model';

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
  targets: Target[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
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
      this.dialogTitle = 'Edit Partner Configuration';
      this.contact = _data.contact;
      this.targets = Array.from(this.contact.targets);
    } else {
      this.dialogTitle = 'New Partner Configuration';
      this.contact = new Contact({});
      this.targets = [];
    }

    this.contactForm = this.createContactForm();
  }

  addTarget(): void {
    this.targets.push(new Target({}));
  }

  save(): void {
    this.matDialogRef.close({ action: this.action, form: this.contactForm, targets: this.targets });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
      population: [this.contact.population],
      keywords: [this.contact.keywords],
      targets: [this.contact.targets]
    });
  }
}
