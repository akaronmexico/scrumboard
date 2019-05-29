import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatRippleModule,
  MatSidenavModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

import { FuseSharedModule } from '@fuse/shared.module';
import {
  FuseConfirmDialogModule,
  FuseMaterialColorPickerModule
} from '@fuse/components';

import {
  BoardResolve,
  ScrumboardService
} from 'app/main/apps/scrumboard/scrumboard.service';
import { ScrumboardComponent } from 'app/main/apps/scrumboard/scrumboard.component';
import { ScrumboardBoardComponent } from 'app/main/apps/scrumboard/board/board.component';
import { ScrumboardBoardListComponent } from 'app/main/apps/scrumboard/board/list/list.component';
import { ScrumboardBoardCardComponent } from 'app/main/apps/scrumboard/board/list/card/card.component';
import { ScrumboardBoardAddCardComponent } from 'app/main/apps/scrumboard/board/list/add-card/add-card.component';
import { ScrumboardCardDialogComponent } from 'app/main/apps/scrumboard/board/dialogs/card/card.component';
import { ScrumboardLabelSelectorComponent } from 'app/main/apps/scrumboard/board/dialogs/card/label-selector/label-selector.component';
import { MatRadioModule } from '@angular/material';

const routes: Routes = [
  {
    path: 'boards',
    component: ScrumboardComponent,
    resolve: {
      scrumboard: ScrumboardService
    }
  },
  {
    path: 'boards/:boardId/:boardUri',
    component: ScrumboardBoardComponent,
    resolve: {
      board: BoardResolve
    }
  },
  {
    path: '**',
    redirectTo: 'boards'
  }
];

@NgModule({
  declarations: [
    ScrumboardComponent,
    ScrumboardBoardComponent,
    ScrumboardBoardListComponent,
    ScrumboardBoardCardComponent,
    ScrumboardBoardAddCardComponent,
    ScrumboardCardDialogComponent,
    ScrumboardLabelSelectorComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    MatButtonModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatRadioModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,

    NgxDnDModule,

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseMaterialColorPickerModule
  ],
  providers: [BoardResolve],
  entryComponents: [ScrumboardCardDialogComponent]
})
export class ScrumboardModule {}
