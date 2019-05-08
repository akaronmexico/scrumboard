import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from '@angular/material';

import { Bin } from 'app/main/apps/bins/bin.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'bins-bin-form-dialog',
  templateUrl: './bin-form.component.html',
  styleUrls: ['./bin-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BinsBinFormDialogComponent {
  action: string;
  bin: Bin;
  binForm: FormGroup;
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
   * @param {MatDialogRef<BinsBinFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    public matDialogRef: MatDialogRef<BinsBinFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder
  ) {
    // Set the defaults
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Bin Details';
      this.bin = _data.bin;
    } else {
      this.dialogTitle = 'New Bin';
      this.bin = new Bin({});
    }

    this.binForm = this.createBinForm();
  }



  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  createBinForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.bin.id],
      name: [this.bin.name],
      description: [this.bin.description]
    });
  }
}
