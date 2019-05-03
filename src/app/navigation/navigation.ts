import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    translate: 'NAV.DASHBOARDS',
    type: 'collapsable',
    icon: 'dashboard',
    children: [
      {
        id: 'analytics',
        title: 'Analytics',
        type: 'item',
        url: '/apps/dashboards/analytics'
      },
      {
        id: 'project',
        title: 'Project',
        type: 'item',
        url: '/apps/dashboards/project'
      }
    ]
  },
  {
    id: 'scrumboard',
    title: 'Scrumboard',
    translate: 'NAV.SCRUMBOARD',
    type: 'item',
    icon: 'assessment',
    url: '/apps/scrumboard'
  },
  {
    id: 'file-manager',
    title: 'File Manager',
    translate: 'NAV.FILE_MANAGER',
    type: 'item',
    icon: 'folder',
    url: '/apps/file-manager'
  },
  {
    id: 'contacts',
    title: 'Contacts',
    translate: 'NAV.CONTACTS',
    type: 'item',
    icon: 'account_box',
    url: '/apps/contacts'
  }
];
