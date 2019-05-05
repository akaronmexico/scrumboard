import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from '@angular/material';

import { Contact } from 'app/main/apps/contacts/contact.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

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
    } else {
      this.dialogTitle = 'New Partner Configuration';
      this.contact = new Contact({});
    }

    this.contactForm = this.createContactForm();
  }

  addTarget(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our requirement
    if ((value || '').trim()) {
      const tempTargets = Array.from(this.contactForm.controls['targets'].value);

      tempTargets.push(value.trim());

      this.contactForm.controls['targets'].setValue(tempTargets);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTarget(index: number): void {
    const tempTargets = Array.from(this.contactForm.controls['targets'].value);

    if (tempTargets && index > -1) {
      tempTargets.splice(index, 1);
      this.contactForm.controls['targets'].setValue(tempTargets);
    }
  }

  addKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our requirement
    if ((value || '').trim()) {
      const tempKeywords = this.contactForm.controls['keywords'].value;
      tempKeywords.push(value.trim());

      this.contactForm.controls['keywords'].setValue(tempKeywords);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeKeyword(index: number): void {
    const tempKeywords = this.contactForm.controls['keywords'].value;

    if (tempKeywords && index > -1) {
      tempKeywords.splice(index, 1);
      this.contactForm.controls['keywords'].setValue(tempKeywords);
    }
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
