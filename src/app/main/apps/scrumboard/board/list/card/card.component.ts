import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ScrumboardCardDialogComponent } from '../../dialogs/card/card.component';
import { ScrumboardService } from '../../../scrumboard.service';

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
    private _matDialog: MatDialog,
    private _scrumboardService: ScrumboardService
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

  updateCardStatus(status: string): void {
    this._scrumboardService.updateCardStatus(this.card, status);
  }

  /**
   * Open card dialog
   *
   * @param cardId
   */
  openCardDialog(type: string): void {
    this.dialogRef = this._matDialog.open(ScrumboardCardDialogComponent, {
      panelClass: 'scrumboard-card-dialog',
      data: {
        status: this.card.status,
        cardId: this.cardId,
        listId: this.listId
      }
    });
    this.dialogRef.afterClosed().subscribe(response => {});
  }
}
