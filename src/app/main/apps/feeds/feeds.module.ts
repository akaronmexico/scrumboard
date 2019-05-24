import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatRippleModule,
  MatTableModule,
  MatChipsModule,
  MatToolbarModule,
  MAT_CHIPS_DEFAULT_OPTIONS
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { CommonModule } from '@angular/common';
import { FeedsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FeedsService } from './feeds.service';
import { FeedsComponent } from './feeds.component';
import { FeedsFeedListComponent } from './feed-list/feed-list.component';
import { FeedsFeedFormDialogComponent } from './feed-form/feed-form.component';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

const routes: Routes = [
  {
    path: '**',
    component: FeedsComponent,
    resolve: {
      feeds: FeedsService
    }
  }
];

@NgModule({
  declarations: [
    FeedsComponent,
    FeedsFeedListComponent,
    FeedsSelectedBarComponent,
    FeedsFeedFormDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    ChartsModule,
    NgxChartsModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule
  ],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ],
  entryComponents: [FeedsFeedFormDialogComponent]
})
export class FeedsModule {}
