import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { PersonasService } from '../personas.service';

@Component({
  selector: 'selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class PersonasSelectedBarComponent implements OnInit, OnDestroy {
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  hasSelectedPersonas: boolean;
  isIndeterminate: boolean;
  selectedPersonas: string[];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {PersonasService} _personasService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _personasService: PersonasService,
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
    this._personasService.onSelectedPersonasChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedPersonas => {
        this.selectedPersonas = selectedPersonas;
        setTimeout(() => {
          this.hasSelectedPersonas = selectedPersonas.length > 0;
          this.isIndeterminate =
            selectedPersonas.length !== this._personasService.personas.length &&
            selectedPersonas.length > 0;
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
    this._personasService.selectPersonas();
  }

  /**
   * Deselect all
   */
  deselectAll(): void {
    this._personasService.deselectPersonas();
  }

  /**
   * Delete selected personas
   */
  deleteSelectedPersonas(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete all selected personas?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._personasService.deleteSelectedPersonas();
      }
      this.confirmDialogRef = null;
    });
  }
}
