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

import { PartnersService } from 'app/main/apps/partners/partners.service';
import { PartnersPartnerFormDialogComponent } from 'app/main/apps/partners/partner-form/partner-form.component';
import { Target } from '../../targets/target.model';
import { Partner } from '../partner.model';

@Component({
  selector: 'partners-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PartnersPartnerListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent', { static: false })
  dialogContent: TemplateRef<any>;

  partners: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = [
    'checkbox',
    'avatar',
    'name',
    'count',
    'histogram',
    'targets',
    'buttons'
  ];
  selectedPartners: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
    this.dataSource = new FilesDataSource(this._partnersService);

    this._partnersService.onPartnersChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(partners => {
        this.partners = partners;

        this.checkboxes = {};
        partners.map(partner => {
          this.checkboxes[partner.id] = false;
        });
      });

    this._partnersService.onSelectedPartnersChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedPartners => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedPartners.includes(id);
        }
        this.selectedPartners = selectedPartners;
      });

    this._partnersService.onUserDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.user = user;
      });

    this._partnersService.onFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._partnersService.deselectPartners();
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
  editPartner(partner): void {
    this.dialogRef = this._matDialog.open(PartnersPartnerFormDialogComponent, {
      panelClass: 'partner-form-dialog',
      width: '80vw',
      data: {
        partner: partner,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response.action;
      const formData: FormGroup = response.form;
      const targets: Target[] = response.targets;
      partner.name = formData.get('name').value;
      partner.targets = targets;
      switch (actionType) {
        /**
         * Save
         */
        case 'edit':
          this._partnersService.updatePartner(partner);

          break;
        case 'save':
          this._partnersService.createPartner(partner);

          break;
        /**
         * Delete
         */
        case 'delete':
          this.deletepartner(partner);

          break;
      }
    });
  }

  /**
   * Delete partner
   */
  deletepartner(partner): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._partnersService.deletepartner(partner);
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
    this._partnersService.toggleSelectedpartner(partnerId);
  }
}

export class FilesDataSource extends DataSource<any> {
  /**
   * Constructor
   *
   * @param {PartnersService} _partnersService
   */
  constructor(private _partnersService: PartnersService) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._partnersService.onPartnersChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}
