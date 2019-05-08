import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { BinsService } from 'app/main/apps/bins/bins.service';
import { BinsBinFormDialogComponent } from 'app/main/apps/bins/bin-form/bin-form.component';

@Component({
  selector: 'bins',
  templateUrl: './bins.component.html',
  styleUrls: ['./bins.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BinsComponent implements OnInit, OnDestroy {
  dialogRef: any;
  hasSelectedBins: boolean;
  searchInput: FormControl;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ContactsService} _binsService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(private _binsService: BinsService, private _fuseSidebarService: FuseSidebarService, private _matDialog: MatDialog) {
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
    this._binsService.onSelectedBinsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(selectedBins => {
      this.hasSelectedBins = selectedBins.length > 0;
    });

    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this._binsService.onSearchTextChanged.next(searchText);
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
   * New bin
   */
  newContact(): void {
    this.dialogRef = this._matDialog.open(BinsBinFormDialogComponent, {
      panelClass: 'bin-form-dialog',
      width: '50vw',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }

      this._binsService.updateBin(response.getRawValue());
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
