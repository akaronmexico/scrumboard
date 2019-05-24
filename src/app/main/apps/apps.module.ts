import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseSharedModule } from '@fuse/shared.module';

const routes = [
  {
    path: 'dashboards/analytics',
    loadChildren:
      './dashboards/analytics/analytics.module#AnalyticsDashboardModule'
  },
  {
    path: 'dashboards/project',
    loadChildren: './dashboards/project/project.module#ProjectDashboardModule'
  },
  {
    path: 'file-manager',
    loadChildren: './file-manager/file-manager.module#FileManagerModule'
  },
  {
    path: 'feeds',
    loadChildren: './feeds/feeds.module#FeedsModule'
  },
  {
    path: 'partners',
    loadChildren: './contacts/contacts.module#ContactsModule'
  },
  {
    path: 'bins',
    loadChildren: './bins/bins.module#BinsModule'
  },
  {
    path: 'scrumboard',
    loadChildren: './scrumboard/scrumboard.module#ScrumboardModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), FuseSharedModule]
})
export class AppsModule {}
