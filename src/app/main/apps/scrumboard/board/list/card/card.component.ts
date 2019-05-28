import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ScrumboardCardDialogComponent } from '../../dialogs/card/card.component';

@Component({
  selector: 'scrumboard-board-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrumboardBoardCardComponent implements OnInit {
  @Input()
  cardId;
  @Input()
  listId;
  dialogRef: any;
  card: any;
  board: any;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} _activatedRoute
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _matDialog: MatDialog
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.board = this._activatedRoute.snapshot.data.board;
    this.card = this.board.cards.filter(card => {
      return this.cardId === card.id;
    })[0];
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Is the card overdue?
   *
   * @param cardDate
   * @returns {boolean}
   */
  isOverdue(cardDate): boolean {
    return moment() > moment(new Date(cardDate));
  }

  viewArticle(url) {
    window.open(url, '_blank');
  }

  /**
   * Open card dialog
   *
   * @param cardId
   */
  openCardDialog(): void {
    this.dialogRef = this._matDialog.open(ScrumboardCardDialogComponent, {
      panelClass: 'scrumboard-card-dialog',
      data: {
        cardId: this.cardId,
        listId: this.listId
      }
    });
    this.dialogRef.afterClosed().subscribe(response => {});
  }
}
