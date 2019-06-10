import { Component, Inject, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatAutocompleteTrigger
} from '@angular/material';

import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Activity } from '../activity.model';
import { ActivitysService } from '../activitys.service';
import { Persona } from '../../personas/persona.model';
import { PersonasService } from '../../personas/personas.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'activitys-activity-form-dialog',
  templateUrl: './activity-form.component.html',
  styleUrls: ['./activity-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ActivitysActivityFormDialogComponent {
  action: string;
  dialogTitle: string;
  articleTitle: string;
  taskId: string;
  visible = true;
  editMode = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  personas: Persona[];
  activitys: Activity[];

  // Private
  private _unsubscribeAll: Subject<any>;

  @ViewChild(MatAutocompleteTrigger, { static: false }) trigger;
  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];
  /**
   * Constructor
   *
   * @param {MatDialogRef<ActivitysActivityFormDialogComponent>} matDialogRef
   * @param _data
   * @param {FormBuilder} _formBuilder
   */
  constructor(
    private _activitysService: ActivitysService,
    private _personasService: PersonasService,
    private toastr: ToastrService,
    public matDialogRef: MatDialogRef<ActivitysActivityFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any
  ) {
    // Set the defaults
    this._unsubscribeAll = new Subject();
    this.dialogTitle = 'Activity Log';
    this.action = this._data.action;
    this.articleTitle = this._data.articleTitle;
    this.taskId = this._data.taskId;
    this.personas = this._data.personas;
    if (this.action === 'edit') {
      this.editMode = true;
    } else {
      this.editMode = false;
    }
  }

  ngOnInit(): void {
    this._personasService.onPersonasChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(personas => {
        this.personas = personas;
        this._activitysService
          .getActivitys(this.taskId)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(activitys => {
            this.activitys = activitys;
            console.log('here');
            if (this.activitys) {
              this.activitys = this.activitys.map((activity: Activity) => {
                activity.personas = personas;
                console.log(
                  'activity has: ' + activity.personas.length + ' personas'
                );
                return activity;
              });
            } else {
              this.activitys = [];
            }
          });
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  newActivity(): void {
    if (!this.activitys) {
      this.activitys = [];
    }
    const act = new Activity({ taskId: this.taskId, personas: this.personas });
    act.editMode = true;
    this.activitys.unshift(act);
    this.activitys = [...this.activitys];
    console.log('# activitys: ' + this.activitys.length);
  }

  saveActivitys(): void {
    this._activitysService
      .updateActivitys(this.taskId, this.activitys)
      .then(res => {
        this.matDialogRef.close({ success: true });
      })
      .catch(err => {
        this.toastr.error('Error occurred saving activity log');
      });
  }
}
