import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
  {
    id: 'dashboards',
    title: 'Dashboards',
    type: 'collapsable',
    icon: 'apps',
    children: [
      {
        id: 'analytics',
        title: 'Analytics',
        type: 'item',
        icon: 'assessment',
        url: '/apps/dashboards/analytics'
      },
      {
        id: 'project',
        title: 'Partner Stats',
        type: 'item',
        icon: 'assessment',
        url: '/apps/dashboards/project'
      }
    ]
  },
  {
    id: 'scrumboard',
    title: 'Scrumboard',
    type: 'item',
    icon: 'widgets',
    url: '/apps/scrumboard'
  },
  {
    id: 'file-manager',
    title: 'File Manager',
    type: 'item',
    icon: 'folder',
    url: '/apps/file-manager'
  },
  {
    id: 'configuration',
    title: 'Configuration',
    type: 'group',
    icon: 'settings',
    url: '/apps/partners',
    children: [
      {
        id: 'feeds',
        title: 'RSS Feeds',
        type: 'item',
        icon: 'rss_feed',
        url: '/apps/feeds'
      },
      {
        id: 'contacts',
        title: 'Partners',
        type: 'item',
        icon: 'people',
        url: '/apps/partners'
      },
      {
        id: 'bins',
        title: 'Bins',
        type: 'item',
        icon: 'inbox',
        url: '/apps/bins'
      }
    ]
  }
];
