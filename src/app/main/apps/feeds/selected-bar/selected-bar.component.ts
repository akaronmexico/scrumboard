import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { FeedsService } from '../feeds.service';

@Component({
  selector: 'selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class FeedsSelectedBarComponent implements OnInit, OnDestroy {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  hasSelectedfeeds: boolean;
  isIndeterminate: boolean;
  selectedFeeds: string[];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {feedsService} _feedsService
   * @param {MatDialog} _matDialog
   */
  constructor(private _feedsService: FeedsService, public _matDialog: MatDialog) {
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
    this._feedsService.onSelectedFeedsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(selectedFeeds => {
      this.selectedFeeds = selectedFeeds;
      setTimeout(() => {
        this.hasSelectedfeeds = selectedFeeds.length > 0;
        this.isIndeterminate = selectedFeeds.length !== this._feedsService.feeds.length && selectedFeeds.length > 0;
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
    this._feedsService.selectFeeds();
  }

  /**
   * Deselect all
   */
  deselectAll(): void {
    this._feedsService.deselectFeeds();
  }

  /**
   * Delete selected feeds
   */
  deleteSelectedfeeds(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected feeds?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._feedsService.deleteSelectedFeeds();
      }
      this.confirmDialogRef = null;
    });
  }
}
