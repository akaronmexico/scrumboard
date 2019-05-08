import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatChipInputEvent } from '@angular/material';

import { Target } from 'app/main/apps/targets/target.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'targets-target-form',
  templateUrl: './target-form.component.html',
  styleUrls: ['./target-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TargetsTargetFormComponent {
  action: string;
  target: Target;
  targetForm: FormGroup;
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
  constructor(private _formBuilder: FormBuilder
  ) {
    

    this.targetForm = this.createTargetForm();
  }

  addTarget(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our requirement
    if ((value || '').trim()) {
      const tempTargets = Array.from(this.targetForm.controls['targets'].value);

      tempTargets.push(value.trim());

      this.targetForm.controls['targets'].setValue(tempTargets);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeTarget(index: number): void {
    const tempTargets = Array.from(this.targetForm.controls['targets'].value);

    if (tempTargets && index > -1) {
      tempTargets.splice(index, 1);
      this.targetForm.controls['targets'].setValue(tempTargets);
    }
  }

  addKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our requirement
    if ((value || '').trim()) {
      const tempKeywords = this.targetForm.controls['keywords'].value;
      tempKeywords.push(value.trim());

      this.targetForm.controls['keywords'].setValue(tempKeywords);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeKeyword(index: number): void {
    const tempKeywords = this.targetForm.controls['keywords'].value;

    if (tempKeywords && index > -1) {
      tempKeywords.splice(index, 1);
      this.targetForm.controls['keywords'].setValue(tempKeywords);
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  createTargetForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.target.id],
      name: [this.target.name]
    });
  }
}
