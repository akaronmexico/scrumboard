import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MatAutocompleteTrigger
} from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { takeUntil, catchError, finalize } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ActivitysService } from '../activitys.service';
import { ActivitysActivityFormDialogComponent } from '../activity-form/activity-form.component';
import { Activity } from '../activity.model';
import { PersonasService } from '../../personas/personas.service';
import { Persona } from '../../personas/persona.model';

@Component({
  selector: 'activitys-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ActivitysActivityListComponent
  implements OnInit, OnDestroy, OnChanges {
  @ViewChild('dialogContent', { static: false })
  dialogContent: TemplateRef<any>;
  @Input() activitys: Activity[];
  @Input() personas: Persona[];
  user: any;
  @Input() editMode: boolean;
  dataSource: FilesDataSource | null;
  displayedColumns = ['persona', 'action', 'url', 'comments', 'buttons'];
  selectedActivitys: any[];
  checkboxes: {};
  personasLoading = false;
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
    public _matDialog: MatDialog
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
    this.dataSource = new FilesDataSource();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['activitys'] && changes['activitys'].currentValue) {
      if (this.dataSource) {
        this.dataSource.loadActivitys(this.activitys);
      }
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  personaSearch(term: string, item: Persona) {
    term = term.toLocaleLowerCase();
    return (
      item.name.toLocaleLowerCase().indexOf(term) > -1 ||
      item.name.toLocaleLowerCase() === term
    );
  }

  displayFn(options: Persona[]): (id: string) => string | null {
    return (id: string) => {
      const correspondingOption = Array.isArray(options)
        ? options.find(option => option.uuid === id)
        : null;
      console.log('id: ' + JSON.stringify(id, null, 2));
      return correspondingOption ? correspondingOption.name : '';
    };
  }

  filterPersonas(activity: any) {
    if (!activity.persona || activity.persona === '') {
      activity.filteredPersonas = [...this.personas];
      return;
    }
    if (typeof activity.persona === 'string') {
      activity.filteredPersonas = activity.personas.filter(
        (option: Persona) => {
          return option.name
            .toLowerCase()
            .includes(activity.persona.toLowerCase());
        }
      );
    } else {
      activity.filteredPersonas = activity.personas.filter(
        (option: Persona) => {
          return option.name
            .toLowerCase()
            .includes(activity.persona.name.toLowerCase());
        }
      );
    }
  }

  private _filter(list: string[], value: string): string[] {
    const filterValue = value.toLowerCase();
    return list.filter(option => option.toLowerCase().includes(filterValue));
  }

  editActivity(activity: Activity): void {
    activity.editMode = true;
  }

  updateActivity(activity: Activity): void {
    activity.editMode = false;
    /** this._activitysService.updateActivity(this.taskId, activity).then(res => {
      activity.editMode = false;
    }); */
  }

  /**
   * Delete Activity
   */
  deleteActivity(activity): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._activitysService.deleteActivity(activity, false);
      }
      this.confirmDialogRef = null;
    });
  }

  /**
   * On selected change
   *
   * @param partnerId
   */
  onSelectedChange(partnerId): void {
    this._activitysService.toggleSelectedActivity(partnerId);
  }
}

export class FilesDataSource extends DataSource<any> {
  private activitysSubject = new BehaviorSubject<Activity[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  /**
   * Constructor
   *
   * @param {FeedsService} _activitysService
   */
  constructor() {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this.activitysSubject.asObservable();
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    this.activitysSubject.complete();
    this.loadingSubject.complete();
  }

  loadActivitys(activitys: Activity[]): void {
    this.activitysSubject.next(activitys);
  }
}
