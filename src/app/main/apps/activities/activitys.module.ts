import { NgModule } from '@angular/core';
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
  MAT_CHIPS_DEFAULT_OPTIONS,
  MatAutocompleteModule,
  MatSelectModule
} from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { CommonModule } from '@angular/common';
import { ActivitysSelectedBarComponent } from './selected-bar/selected-bar.component';
import { ActivitysComponent } from './activitys.component';
import { ActivitysActivityListComponent } from './activity-list/activity-list.component';
import { ActivitysActivityFormDialogComponent } from './activity-form/activity-form.component';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    ActivitysComponent,
    ActivitysActivityListComponent,
    ActivitysSelectedBarComponent,
    ActivitysActivityFormDialogComponent
  ],
  imports: [
    NgSelectModule,
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    ChartsModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule
  ],
  exports: [
    ActivitysComponent,
    ActivitysActivityListComponent,
    ActivitysActivityFormDialogComponent
  ],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ],
  entryComponents: [ActivitysActivityFormDialogComponent]
})
export class ActivitysModule {}
