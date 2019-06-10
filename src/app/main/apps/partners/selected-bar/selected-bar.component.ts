import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { PartnersService } from 'app/main/apps/partners/partners.service';

@Component({
    selector   : 'selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class PartnersSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedPartners: boolean;
    isIndeterminate: boolean;
    selectedPartners: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {PartnersService} _partnersService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _partnersService: PartnersService,
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
        this._partnersService.onSelectedPartnersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedPartners => {
                this.selectedPartners = selectedPartners;
                setTimeout(() => {
                    this.hasSelectedPartners = selectedPartners.length > 0;
                    this.isIndeterminate = (selectedPartners.length !== this._partnersService.partners.length && selectedPartners.length > 0);
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
        this._partnersService.selectPartners();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._partnersService.deselectPartners();
    }

    /**
     * Delete selected partners
     */
    deleteSelectedPartners(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected partners?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._partnersService.deleteSelectedPartners();
                }
                this.confirmDialogRef = null;
            });
    }
}
