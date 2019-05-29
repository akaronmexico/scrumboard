import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatMenuTrigger
} from '@angular/material';
import { Subject } from 'rxjs';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';

import { ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';
import { takeUntil } from 'rxjs/operators';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

@Component({
  selector: 'scrumboard-board-card-dialog',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrumboardCardDialogComponent implements OnInit, OnDestroy {
  card: any;
  board: any;
  list: any;
  usageTypes: string[] = ['Used as Prompt', 'Amplified'];
  toggleInArray = FuseUtils.toggleInArray;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  date = new Date();
  usageForm: FormGroup;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {MatDialogRef<ScrumboardCardDialogComponent>} matDialogRef
   * @param _data
   * @param {MatDialog} _matDialog
   * @param {ScrumboardService} _scrumboardService
   */
  constructor(
    public matDialogRef: MatDialogRef<ScrumboardCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _matDialog: MatDialog,
    private _scrumboardService: ScrumboardService,
    private fb: FormBuilder
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
    this.buildUsageForm();
    this._scrumboardService.onBoardChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(board => {
        this.board = board;

        this.card = this.board.cards.find(_card => {
          return this._data.cardId === _card.id;
        });

        this.list = this.board.lists.find(_list => {
          return this._data.listId === _list.id;
        });
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

  buildUsageForm(): void {
    this.usageForm = new FormGroup({
      usageDatePicker: new FormControl(new Date(), Validators.required),
      usageLink: new FormControl(''),
      usageType: new FormControl('Used as Prompt', Validators.required)
    });
  }

  /**
   * Add usage
   *
   * @param {NgForm} form
   */
  addUsage(): void {
    const usageDate = this.usageForm.value.usageDatePicker;
    const usageType = this.usageForm.value.usageType;
    const usageLink = this.usageForm.value.usageLink;
    console.log('type: ' + JSON.stringify(usageType, null, 2));
    console.log('date: ' + JSON.stringify(usageDate, null, 2));
    console.log('link: ' + JSON.stringify(usageLink, null, 2));
    this.card.usageDate = usageDate;
    this.card.usageType = usageType;
    this.card.usageLink = usageLink;
    this.matDialogRef.close({ updatedCard: this.card });
  }

  /**
   * Remove card
   */
  removeCard(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete the card?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.matDialogRef.close();
        this._scrumboardService.removeCard(this.card.id, this.list.id);
      }
    });
  }

  /**
   * Update card
   */
  updateCard(): void {
    this._scrumboardService.updateCard(this.card);
  }
}
