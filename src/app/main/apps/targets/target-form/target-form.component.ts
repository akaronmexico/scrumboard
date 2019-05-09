import { Component, ViewEncapsulation, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

import { Target } from 'app/main/apps/targets/target.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Bin, TargetBin } from '../../bins/bin.model';
import { BinsService } from '../../bins/bins.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'targets-target-form',
  templateUrl: './target-form.component.html',
  styleUrls: ['./target-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TargetsTargetFormComponent {
  action: string;

  @Input() target: Target;
  bins: Bin[];
  targetForm: FormGroup;
  dialogTitle: string;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  private _unsubscribeAll: Subject<any>;

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _binsService: BinsService
  ) {
    this._unsubscribeAll = new Subject();
    this._binsService.onBinsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(bins => {
        this.bins = bins;
      });
  }

  ngOnInit(): void {
    this.targetForm = this.createTargetForm();
  }

  addTargetBin(): void {
    if (!this.target.bins) {
      this.target.bins = [];
    }
    this.target.bins.push(new TargetBin({}));
  }

  addKeyword(event: MatChipInputEvent, targetBin: TargetBin): void {
    const input = event.input;
    const value = event.value;

    // Add our requirement
    if ((value || '').trim()) {
      targetBin.keywords.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeKeyword(index: number, targetBin: TargetBin): void {
    if (targetBin.keywords && index > -1) {
      targetBin.keywords.splice(index, 1);
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
