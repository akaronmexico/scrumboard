import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';

import { ScrumboardService } from 'app/main/apps/scrumboard/scrumboard.service';
import { Card } from 'app/main/apps/scrumboard/card.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'scrumboard-board-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScrumboardBoardListComponent implements OnInit, OnDestroy {
  board: any;
  dialogRef: any;

  @Input() list;

  @ViewChild(FusePerfectScrollbarDirective, {static:false})
  listScroll: FusePerfectScrollbarDirective;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} _activatedRoute
   * @param {ScrumboardService} _scrumboardService
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _scrumboardService: ScrumboardService,
    private toastr: ToastrService,
    private _matDialog: MatDialog
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
    this._scrumboardService.onBoardChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(board => {
        this.board = board;
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
   * On list name changed
   *
   * @param newListName
   */
  onListNameChanged(newListName): void {
    this.list.name = newListName;
  }

  syncData(listId: string): void {
    this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Send these articles to ' + this.board.name + '?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._scrumboardService
          .sendList(this.board.name, listId)
          .then((resp: any) => {
            if (resp.success) {
              this.toastr.success('Exported Data for ' + this.board.name);
            } else {
              this.toastr.error('Could not export data for ' + this.board.name);
            }
          });
      }
    });
  }

  /**
   * On drop
   *
   * @param ev
   */
  onDrop(ev): void {
    console.log('drop event: ' + ev.value + ' is now in ' + this.list.name);
    this._scrumboardService.updateBoard();
  }

  onRemove(ev): void {
    console.log(ev.value + ' was removed from board: ' + this.board.uri);
  }
}
