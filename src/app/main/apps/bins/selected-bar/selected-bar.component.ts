import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { BinsService } from '../bins.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class BinsSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedBins: boolean;
    isIndeterminate: boolean;
    selectedBins: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {BinsService} _binsService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _binsService: BinsService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this._binsService.onSelectedBinsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedBins => {
                this.selectedBins = selectedBins;
                setTimeout(() => {
                    this.hasSelectedBins = selectedBins.length > 0;
                    this.isIndeterminate = (selectedBins.length !== this._binsService.bins.length && selectedBins.length > 0);
                }, 0);
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
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
    selectAll(): void
    {
        this._binsService.selectBins();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._binsService.deselectBins();
    }

    /**
     * Delete selected bins
     */
    deleteSelectedBins(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected bins?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._binsService.deleteSelectedBins();
                }
                this.confirmDialogRef = null;
            });
    }
}
