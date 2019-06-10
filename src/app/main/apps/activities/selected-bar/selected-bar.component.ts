import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { ActivitysService } from '../activitys.service';

@Component({
  selector: 'selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class ActivitysSelectedBarComponent implements OnInit, OnDestroy {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  hasSelectedActivitys: boolean;
  isIndeterminate: boolean;
  selectedActivitys: string[];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {activitysService} _activitysService
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
    this._activitysService.onSelectedActivitysChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedActivitys => {
        this.selectedActivitys = selectedActivitys;
        setTimeout(() => {
          this.hasSelectedActivitys = selectedActivitys.length > 0;
          this.isIndeterminate =
            selectedActivitys.length !==
              this._activitysService.activitys.length &&
            selectedActivitys.length > 0;
        }, 0);
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
   * Select all
   */
  selectAll(): void {
    this._activitysService.selectActivitys();
  }

  /**
   * Deselect all
   */
  deselectAll(): void {
    this._activitysService.deselectActivitys();
  }

  /**
   * Delete selected activitys
   */
  deleteSelectedActivitys(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete all selected activitys?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._activitysService.deleteSelectedActivitys();
      }
      this.confirmDialogRef = null;
    });
  }
}
