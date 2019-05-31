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

import { BinsService } from 'app/main/apps/bins/bins.service';
import { BinsBinFormDialogComponent } from 'app/main/apps/bins/bin-form/bin-form.component';

@Component({
  selector: 'bins-bin-list',
  templateUrl: './bin-list.component.html',
  styleUrls: ['./bin-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BinsBinListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent')
  dialogContent: TemplateRef<any>;

  bins: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'name', 'description', 'buttons'];
  selectedBins: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {BinsService} _binsService
   * @param {MatDialog} _matDialog
   */
  constructor(private _binsService: BinsService, public _matDialog: MatDialog) {
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
    this.dataSource = new FilesDataSource(this._binsService);

    this._binsService.onBinsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(bins => {
        this.bins = bins;

        this.checkboxes = {};
        bins.map(bin => {
          this.checkboxes[bin.id] = false;
        });
      });

    this._binsService.onSelectedBinsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedBins => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedBins.includes(id);
        }
        this.selectedBins = selectedBins;
      });

    this._binsService.onFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._binsService.deselectBins();
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
   * Edit contact
   *
   * @param contact
   */
  editBin(bin): void {
    this.dialogRef = this._matDialog.open(BinsBinFormDialogComponent, {
      panelClass: 'bin-form-dialog',
      width: '50vw',
      data: {
        bin: bin,
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
          this._binsService.updateBin(formData.getRawValue());

          break;
        /**
         * Delete
         */
        case 'delete':
          this.deleteBin(bin);

          break;
      }
    });
  }

  /**
   * Delete Bin
   */
  deleteBin(bin): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._binsService.deleteBin(bin);
      }
      this.confirmDialogRef = null;
    });
  }

  /**
   * On selected change
   *
   * @param binId
   */
  onSelectedChange(binId): void {
    this._binsService.toggleSelectedBin(binId);
  }
}

export class FilesDataSource extends DataSource<any> {
  /**
   * Constructor
   *
   * @param {BinsService} _binsService
   */
  constructor(private _binsService: BinsService) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._binsService.onBinsChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}
