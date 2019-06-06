import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { FeedsService } from 'app/main/apps/feeds/feeds.service';
import { FeedsFeedFormDialogComponent } from 'app/main/apps/feeds/feed-form/feed-form.component';

@Component({
  selector: 'feeds',
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FeedsComponent implements OnInit, OnDestroy {
  dialogRef: any;
  hasSelectedFeeds: boolean;
  searchInput: FormControl;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {PartnersService} _feedsService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _feedsService: FeedsService,
    private _fuseSidebarService: FuseSidebarService,
    private _matDialog: MatDialog
  ) {
    // Set the defaults
    this.searchInput = new FormControl('');

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
    this._feedsService.onSelectedFeedsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedFeeds => {
        this.hasSelectedFeeds = selectedFeeds.length > 0;
      });

    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this._feedsService.onSearchTextChanged.next(searchText);
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
   * New feed
   */
  newFeed(): void {
    this.dialogRef = this._matDialog.open(FeedsFeedFormDialogComponent, {
      panelClass: 'feed-form-dialog',
      width: '50vw',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }

      this._feedsService.updateFeed(response.getRawValue());
    });
  }

  /**
   * Toggle the sidebar
   *
   * @param name
   */
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
}
