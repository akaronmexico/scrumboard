import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { Target } from '@angular/compiler';
import { TargetsService } from '../targets.service';


@Component({
  selector: 'targets-target-list',
  templateUrl: './target-list.component.html',
  styleUrls: ['./target-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TargetsTargetListComponent implements OnInit, OnDestroy {

  targets: Target[];
  selectedTargets: any[];
  checkboxes: {};
  dialogRef: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {TargetsService} _targetsService
   */
  constructor(private _targetsService: TargetsService) {
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

    this._targetsService.onTargetsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(targets => {
      this.targets = targets;

      this.checkboxes = {};
      targets.map(target => {
        this.checkboxes[target.id] = false;
      });
    });

    this._targetsService.onSelectedTargetsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(selectedTargets => {
      for (const id in this.checkboxes) {
        if (!this.checkboxes.hasOwnProperty(id)) {
          continue;
        }

        this.checkboxes[id] = selectedTargets.includes(id);
      }
      this.selectedTargets = selectedTargets;
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
   * Delete Contact
   */
  deleteContact(target): void {
    this._targetsService.deleteTarget(target);
  }

  /**
   * On selected change
   *
   * @param targetId
   */
  onSelectedChange(targetId): void {
    this._targetsService.toggleSelectedTarget(targetId);
  }

}

