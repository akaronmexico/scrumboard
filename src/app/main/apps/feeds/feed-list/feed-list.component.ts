import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { FeedsFeedFormDialogComponent } from 'app/main/apps/feeds/feed-form/feed-form.component';
import { FeedsService } from '../feeds.service';

@Component({
  selector: 'feeds-feed-list',
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FeedsFeedListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent', {static:false})
  dialogContent: TemplateRef<any>;

  feeds: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = [
    'checkbox',
    'name',
    'url',
    'count',
    'histogram',
    'buttons'
  ];
  selectedFeeds: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FeedsService} _feedsService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _feedsService: FeedsService,
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
    this.dataSource = new FilesDataSource(this._feedsService);

    this._feedsService.onFeedsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(feeds => {
        this.feeds = feeds;

        this.checkboxes = {};
        feeds.map(feed => {
          this.checkboxes[feed.id] = false;
        });
      });

    this._feedsService.onSelectedFeedsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedFeeds => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedFeeds.includes(id);
        }
        this.selectedFeeds = selectedFeeds;
      });

    this._feedsService.onFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._feedsService.deselectFeeds();
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
   * Edit partner
   *
   * @param partner
   */
  editFeed(feed): void {
    this.dialogRef = this._matDialog.open(FeedsFeedFormDialogComponent, {
      panelClass: 'feed-form-dialog',
      width: '50vw',
      data: {
        feed: feed,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];
      switch (actionType) {
        /**
         * Save
         */
        case 'save':
          this._feedsService.updateFeed(formData.getRawValue());

          break;
        /**
         * Delete
         */
        case 'delete':
          this.deleteFeed(feed);

          break;
      }
    });
  }

  /**
   * Delete Feed
   */
  deleteFeed(feed): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._feedsService.deleteFeed(feed);
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
    this._feedsService.toggleSelectedFeed(partnerId);
  }
}

export class FilesDataSource extends DataSource<any> {
  /**
   * Constructor
   *
   * @param {FeedsService} _feedsService
   */
  constructor(private _feedsService: FeedsService) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._feedsService.onFeedsChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}
