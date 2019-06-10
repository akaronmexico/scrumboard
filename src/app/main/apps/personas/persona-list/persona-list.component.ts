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

import { PersonasService } from 'app/main/apps/personas/personas.service';
import { PersonasPersonaFormDialogComponent } from '../persona-form/persona-form.component';

@Component({
  selector: 'personas-persona-list',
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PersonasPersonaListComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContent', { static: false })
  dialogContent: TemplateRef<any>;

  personas: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = [
    'checkbox',
    'name',
    'service',
    'selector',
    'comments',
    'buttons'
  ];
  selectedPersonas: any[];
  checkboxes: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
    this.dataSource = new FilesDataSource(this._personasService);

    this._personasService.onPersonasChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(personas => {
        this.personas = personas;

        this.checkboxes = {};
        personas.map(persona => {
          this.checkboxes[persona.id] = false;
        });
      });

    this._personasService.onSelectedPersonasChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedPersonas => {
        for (const id in this.checkboxes) {
          if (!this.checkboxes.hasOwnProperty(id)) {
            continue;
          }

          this.checkboxes[id] = selectedPersonas.includes(id);
        }
        this.selectedPersonas = selectedPersonas;
      });

    this._personasService.onFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._personasService.deselectPersonas();
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
  editPersona(persona): void {
    this.dialogRef = this._matDialog.open(PersonasPersonaFormDialogComponent, {
      panelClass: 'persona-form-dialog',
      width: '50vw',
      data: {
        persona: persona,
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
          this._personasService.updatePersona(formData.getRawValue());

          break;
        /**
         * Delete
         */
        case 'delete':
          this.deletePersona(persona);

          break;
      }
    });
  }

  /**
   * Delete Persona
   */
  deletePersona(persona): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._personasService.deletePersona(persona);
      }
      this.confirmDialogRef = null;
    });
  }

  /**
   * On selected change
   *
   * @param personaId
   */
  onSelectedChange(personaId): void {
    this._personasService.toggleSelectedPersona(personaId);
  }
}

export class FilesDataSource extends DataSource<any> {
  /**
   * Constructor
   *
   * @param {PersonasService} _personasService
   */
  constructor(private _personasService: PersonasService) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    return this._personasService.onPersonasChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}
