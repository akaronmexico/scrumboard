import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { Persona } from 'app/main/apps/personas/persona.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { PartnersService } from '../../partners/partners.service';
import { Partner } from '../../partners/partner.model';

@Component({
  selector: 'personas-persona-form-dialog',
  templateUrl: './persona-form.component.html',
  styleUrls: ['./persona-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PersonasPersonaFormDialogComponent {
  action: string;
  persona: Persona;
  personaForm: FormGroup;
  dialogTitle: string;
  partners: Partner[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  /**
   * Constructor
   *
   * @param {MatDialogRef<PersonasPersonaFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<PersonasPersonaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
    // Set the defaults
    this.action = _data.action;
    this.partners = _data.partners;
    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Persona Details';
      this.persona = _data.persona;
    } else {
      this.dialogTitle = 'New Persona';
      this.persona = new Persona({});
    }
    this.personaForm = this.createPersonaForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  createPersonaForm(): FormGroup {
    return this._formBuilder.group({
      uuid: [this.persona.uuid],
      partnerId: [this.persona.name],
      name: [this.persona.name],
      service: [this.persona.name],
      selector: [this.persona.selector],
      comments: [this.persona.comments]
    });
  }
}
