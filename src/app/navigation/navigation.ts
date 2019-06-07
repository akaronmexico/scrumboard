import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
  {
    id: 'analytics',
    title: 'Dashboard',
    type: 'item',
    icon: 'assessment',
    url: '/apps/dashboards/analytics'
  },
  {
    id: 'scrumboard',
    title: 'Scrumboard',
    type: 'item',
    icon: 'widgets',
    url: '/apps/scrumboard'
  },
  /** {
    id: 'file-manager',
    title: 'File Manager',
    type: 'item',
    icon: 'folder',
    url: '/apps/file-manager'
  }, */
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
        id: 'partners',
        title: 'Partners',
        type: 'item',
        icon: 'people',
        url: '/apps/partners'
      },
      {
        id: 'personas',
        title: 'Personas',
        type: 'item',
        icon: 'person',
        url: '/apps/personas'
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
