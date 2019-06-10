import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { PersonasService } from 'app/main/apps/personas/personas.service';
import { PersonasPersonaFormDialogComponent } from 'app/main/apps/personas/persona-form/persona-form.component';
import { Partner } from '../partners/partner.model';
import { PartnersService } from '../partners/partners.service';

@Component({
  selector: 'personas',
  templateUrl: './personas.component.html',
  styleUrls: ['./personas.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PersonasComponent implements OnInit, OnDestroy {
  dialogRef: any;
  hasSelectedPersonas: boolean;
  searchInput: FormControl;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {PersonasService} _personasService
   * @param {PartnersService} _partnersService
   * @param {FuseSidebarService} _fuseSidebarService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _personasService: PersonasService,
    private _partnersService: PartnersService,
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
    this._personasService.onSelectedPersonasChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedPersonas => {
        this.hasSelectedPersonas = selectedPersonas.length > 0;
      });

    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this._personasService.onSearchTextChanged.next(searchText);
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
   * New persona
   */
  newPersona(): void {
    this._partnersService.getpartnerNames().then((partners: Partner[]) => {
      this.dialogRef = this._matDialog.open(
        PersonasPersonaFormDialogComponent,
        {
          panelClass: 'persona-form-dialog',
          width: '50vw',
          data: {
            action: 'new',
            partners: partners
          }
        }
      );

      this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        this._personasService.updatePersona(response.getRawValue());
      });
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
