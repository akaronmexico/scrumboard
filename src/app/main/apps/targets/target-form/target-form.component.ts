import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  OnInit
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

import { Target } from 'app/main/apps/targets/target.model';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Bin, TargetBin } from '../../bins/bin.model';
import { BinsService } from '../../bins/bins.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'targets-target-form',
  templateUrl: './target-form.component.html',
  styleUrls: ['./target-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TargetsTargetFormComponent implements OnInit {
  action: string;

  @Input() target: Target;
  @Input() targetIndex: number;
  @Output() remove = new EventEmitter();
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

  delete(): void {
    this.remove.emit({ index: this.targetIndex });
  }

  paste(event: ClipboardEvent, targetBin: TargetBin): void {
    console.log('paste!!!');
    event.preventDefault();
    event.clipboardData
      .getData('Text')
      .split(/;|,|\n/)
      .forEach(value => {
        if (value.trim()) {
          targetBin.keywords.push(value.trim());
        }
      });
  }

  addTargetBin(): void {
    if (!this.target.bins) {
      this.target.bins = [];
    }
    this.target.bins.push(new TargetBin({}));
  }

  deleteBin(index): void {
    this.target.bins.splice(index, 1);
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

  compareBins(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  createTargetForm(): FormGroup {
    return this._formBuilder.group({
      uuid: [this.target.uuid],
      target: [this.target.target]
    });
  }
}
