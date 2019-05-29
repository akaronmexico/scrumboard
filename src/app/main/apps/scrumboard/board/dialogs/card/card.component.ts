import { Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, Form } from '@angular/forms/src/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { Subject } from 'rxjs';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseUtils } from '@fuse/utils';

import { ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';

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
  usageForm: Form;
  usageTypes: string[] = ['Used as Prompt', 'Amplified'];
  toggleInArray = FuseUtils.toggleInArray;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
    this._scrumboardService.onBoardChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(board => {
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

  /**
   * Add usage
   *
   * @param {NgForm} form
   */
  addUsage(form: NgForm): void {
    const usageDate = form.value.usageDate;
    const usageType = form.value.usageType;
    const usageLink = form.value.usageLink;
    console.log('date: ' + JSON.stringify(usageDate, null, 2));

    // this.updateCard();
  }

  /**
   * Add new comment
   *
   * @param {NgForm} form
   */
  addNewComment(form: NgForm): void {
    const newCommentText = form.value.newComment;

    const newComment = {
      idMember: '36027j1930450d8bf7b10158',
      message: newCommentText,
      time: 'now'
    };
    if (!this.card.comments) {
      this.card.comments = [];
    }
    this.card.comments.unshift(newComment);

    form.setValue({ newComment: '' });

    // this.updateCard();
  }

  /**
   * Remove card
   */
  removeCard(): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the card?';

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
