import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { MatDialog } from '@angular/material';
import { ScrumboardService } from '../../../scrumboard.service';
import { ActivitysActivityFormDialogComponent } from 'app/main/apps/activities/activity-form/activity-form.component';
import { Persona } from 'app/main/apps/personas/persona.model';
import { PersonasService } from 'app/main/apps/personas/personas.service';

@Component({
  selector: 'scrumboard-board-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrumboardBoardCardComponent implements OnInit {
  @Input()
  taskId;
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
    private _scrumboardService: ScrumboardService,
    private _personasService: PersonasService
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
      return this.taskId === card.id;
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
   * @param taskId
   */
  openArticlePage(): void {
    this._router.navigate([this.taskId], {
      relativeTo: this._activatedRoute
    });
  }

  openActivityDialog(): void {
    let personas = [];
    this._personasService.getPersonas().then((p: Persona[]) => {
      personas = p;
      this.dialogRef = this._matDialog.open(
        ActivitysActivityFormDialogComponent,
        {
          panelClass: 'activitys-activity-form-dialog',
          width: '85vw',
          data: {
            taskId: this.taskId,
            action: 'edit',
            articleTitle: this.card.title,
            personas: personas
          }
        }
      );
      this.dialogRef.afterClosed().subscribe(response => {});
    });
  }
}
