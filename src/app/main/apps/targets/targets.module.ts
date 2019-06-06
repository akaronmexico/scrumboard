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
  MAT_CHIPS_DEFAULT_OPTIONS,
  MatSelectModule,
  MatListModule,
  MatCardModule
} from '@angular/material';

import { CommonModule } from '@angular/common';
import { TargetsComponent } from './targets.component';
import { TargetsTargetListComponent } from './target-list/target-list.component';
import { TargetsTargetFormComponent } from './target-form/target-form.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

@NgModule({
  declarations: [
    TargetsComponent,
    TargetsTargetListComponent,
    TargetsTargetFormComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatChipsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatCardModule,
    MatToolbarModule,
    MatListModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule
  ],
  exports: [
    TargetsComponent,
    TargetsTargetListComponent,
    TargetsTargetFormComponent
  ],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ],
  entryComponents: [TargetsTargetFormComponent]
})
export class TargetsModule {}
