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
  MatTooltipModule,
  MatTabsModule
} from '@angular/material';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

import { FuseSharedModule } from '@fuse/shared.module';
import {
  FuseConfirmDialogModule,
  FuseMaterialColorPickerModule
} from '@fuse/components';

import {
  BoardResolve,
  ScrumboardService,
  ArticleResolve
} from 'app/main/apps/scrumboard/scrumboard.service';
import { ScrumboardComponent } from 'app/main/apps/scrumboard/scrumboard.component';
import { ScrumboardBoardComponent } from 'app/main/apps/scrumboard/board/board.component';
import { ScrumboardBoardListComponent } from 'app/main/apps/scrumboard/board/list/list.component';
import { ScrumboardBoardCardComponent } from 'app/main/apps/scrumboard/board/list/card/card.component';
import { ScrumboardBoardAddCardComponent } from 'app/main/apps/scrumboard/board/list/add-card/add-card.component';
import { MatRadioModule } from '@angular/material';
import { ActivitysModule } from '../activities/activitys.module';
import { ArticleComponent } from './board/list/article/article.component';

const routes: Routes = [
  {
    path: 'boards',
    component: ScrumboardComponent,
    resolve: {
      scrumboard: ScrumboardService
    }
  },
  {
    path: 'boards/:boardId',
    component: ScrumboardBoardComponent,
    resolve: {
      board: BoardResolve
    }
  },
  {
    path: 'boards/:boardId/:articleId',
    component: ArticleComponent,
    resolve: {
      article: ArticleResolve
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
    ArticleComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    ActivitysModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
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
  providers: [BoardResolve, ArticleResolve],
  entryComponents: []
})
export class ScrumboardModule {}
