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

import { PartnersComponent } from 'app/main/apps/partners/partners.component';
import { PartnersService } from 'app/main/apps/partners/partners.service';
import { PartnersPartnerListComponent } from 'app/main/apps/partners/partner-list/partner-list.component';
import { PartnersSelectedBarComponent } from 'app/main/apps/partners/selected-bar/selected-bar.component';
import { PartnersPartnerFormDialogComponent } from 'app/main/apps/partners/partner-form/partner-form.component';
import { CommonModule } from '@angular/common';
import { TargetsModule } from '../targets/targets.module';
import { BinsService } from '../bins/bins.service';
import { ChartsModule } from 'ng2-charts';

const routes: Routes = [
  {
    path: '**',
    component: PartnersComponent,
    resolve: {
      partners: PartnersService,
      bins: BinsService
    }
  }
];

@NgModule({
  declarations: [
    PartnersComponent,
    PartnersPartnerListComponent,
    PartnersSelectedBarComponent,
    PartnersPartnerFormDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    TargetsModule,
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
  entryComponents: [PartnersPartnerFormDialogComponent]
})
export class PartnersModule {}
