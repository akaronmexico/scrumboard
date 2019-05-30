import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ScrumboardCardDialogComponent } from '../../dialogs/card/card.component';
import { ScrumboardService } from '../../../scrumboard.service';
import { ActivitysActivityFormDialogComponent } from 'app/main/apps/activities/activity-form/activity-form.component';

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
    private _router: Router,
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

  viewArticle(url): void {
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
  openArticlePage(): void {
    this._router.navigate([this.cardId], {
      relativeTo: this._activatedRoute
    });
  }

  openActivityDialog(): void {
    this.dialogRef = this._matDialog.open(
      ActivitysActivityFormDialogComponent,
      {
        panelClass: 'activitys-activity-form-dialog',
        width: '85vw',
        data: {
          cardId: this.cardId,
          action: 'edit',
          articleTitle: this.card.title
        }
      }
    );
    this.dialogRef.afterClosed().subscribe(response => {});
  }
}
