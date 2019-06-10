import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatChipInputEvent
} from '@angular/material';

import { Partner } from 'app/main/apps/partners/partner.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Target } from '../../targets/target.model';

@Component({
  selector: 'partners-partner-form-dialog',
  templateUrl: './partner-form.component.html',
  styleUrls: ['./partner-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PartnersPartnerFormDialogComponent {
  action: string;
  partner: Partner;
  partnerForm: FormGroup;
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
   * @param {MatDialogRef<PartnerspartnerFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<PartnersPartnerFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
    // Set the defaults
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Partner Configuration';
      this.partner = _data.partner;
      this.targets = Array.from(this.partner.targets);
    } else {
      this.dialogTitle = 'New Partner Configuration';
      this.partner = new Partner({});
      this.targets = [];
    }

    this.partnerForm = this.createpartnerForm();
  }

  addTarget(): void {
    this.targets.push(new Target({}));
  }

  save(): void {
    this.matDialogRef.close({
      action: 'edit',
      form: this.partnerForm,
      targets: this.targets
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  createpartnerForm(): FormGroup {
    return this._formBuilder.group({
      uuid: [this.partner.uuid],
      name: [this.partner.name],
      nativeName: [this.partner.nativeName],
      capital: [this.partner.capital],
      region: [this.partner.region],
      subregion: [this.partner.subregion],
      latlng: [this.partner.latlng],
      avatar: [this.partner.avatar],
      population: [this.partner.population],
      keywords: [this.partner.keywords],
      targets: [this.partner.targets]
    });
  }
}
