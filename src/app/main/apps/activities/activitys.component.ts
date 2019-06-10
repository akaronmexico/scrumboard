import {
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  Input
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { ActivitysActivityFormDialogComponent } from './activity-form/activity-form.component';
import { ActivitysService } from './activitys.service';
import { Activity } from './activity.model';
import { PersonasService } from '../personas/personas.service';
import { Persona } from '../personas/persona.model';

@Component({
  selector: 'activitys',
  templateUrl: './activitys.component.html',
  styleUrls: ['./activitys.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ActivitysComponent implements OnInit, OnDestroy {
  dialogRef: any;
  hasSelectedActivitys: boolean;
  searchInput: FormControl;
  @Input() taskId: string;
  activitys: Activity[];
  @Input() personas: Persona[];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ActivitysService} _activitysService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _activitysService: ActivitysService,
    private _personasService: PersonasService,
    private _matDialog: MatDialog
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._activitysService
      .getActivitys(this.taskId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(activitys => {
        this.activitys = activitys;
      });
    this._personasService.onPersonasChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(personas => {
        this.personas = personas;
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

  /**
   * New activity
   */
  newActivity(): void {
    this._activitysService.updateActivity(
      this.taskId,
      new Activity({
        persona: 'Ivan',
        url: 'https//www.google.com',
        taskId: this.taskId
      })
    );
  }
}
