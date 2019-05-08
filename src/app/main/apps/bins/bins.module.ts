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
import { BinsService } from './bins.service';
import { BinsComponent } from './bins.component';
import { BinsBinFormDialogComponent } from './bin-form/bin-form.component';
import { BinsBinListComponent } from './bin-list/bin-list.component';
import { BinsSelectedBarComponent } from './selected-bar/selected-bar.component';

const routes: Routes = [
  {
    path: '**',
    component: BinsComponent,
    resolve: {
      bins: BinsService
    }
  }
];

@NgModule({
  declarations: [
    BinsComponent, 
    BinsBinListComponent,
    BinsSelectedBarComponent,
    BinsBinFormDialogComponent
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

    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule
  ],
  providers: [
    BinsService,
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER, COMMA]
      }
    }
  ],
  entryComponents: [BinsBinFormDialogComponent]
})
export class BinsModule {}
