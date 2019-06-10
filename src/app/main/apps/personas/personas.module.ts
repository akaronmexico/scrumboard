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
  MatToolbarModule,
  MatSelectModule
} from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { CommonModule } from '@angular/common';
import { PersonasService } from './personas.service';
import { PersonasComponent } from './personas.component';
import { PersonasPersonaFormDialogComponent } from './persona-form/persona-form.component';
import { PersonasPersonaListComponent } from './persona-list/persona-list.component';
import { PersonasSelectedBarComponent } from './selected-bar/selected-bar.component';

const routes: Routes = [
  {
    path: '**',
    component: PersonasComponent,
    resolve: {
      personas: PersonasService
    }
  }
];

@NgModule({
  declarations: [
    PersonasComponent,
    PersonasPersonaListComponent,
    PersonasSelectedBarComponent,
    PersonasPersonaFormDialogComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatDatepickerModule,
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
  providers: [],
  entryComponents: [PersonasPersonaFormDialogComponent]
})
export class PersonasModule {}
