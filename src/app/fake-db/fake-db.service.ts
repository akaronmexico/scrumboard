import { InMemoryDbService } from 'angular-in-memory-web-api';
import { ContactsFakeDb } from 'app/fake-db/contacts';
import { AnalyticsDashboardDb } from 'app/fake-db/dashboard-analytics';
import { ProjectDashboardDb } from 'app/fake-db/dashboard-project';
import { FileManagerFakeDb } from 'app/fake-db/file-manager';
import { IconsFakeDb } from 'app/fake-db/icons';
import { ProfileFakeDb } from 'app/fake-db/profile';
import { ScrumboardFakeDb } from 'app/fake-db/scrumboard';
import { BinsFakeDb } from './bins';
import { FeedsFakeDb } from './feeds';

export class FakeDbService implements InMemoryDbService {
  createDb(): any {
    return {
      // Dashboards
      'project-dashboard-projects': ProjectDashboardDb.projects,
      'project-dashboard-widgets': ProjectDashboardDb.widgets,
      'analytics-dashboard-widgets': AnalyticsDashboardDb.widgets,

      // File Manager
      'file-manager': FileManagerFakeDb.files,

      // Bins
      'bins-bins': BinsFakeDb.bins,

      // Feeds
      'feeds-feeds': FeedsFakeDb.feeds,

      // Contacts
      'contacts-contacts': ContactsFakeDb.contacts,
      'contacts-user': ContactsFakeDb.user,

      // Scrumboard
      'scrumboard-boards': ScrumboardFakeDb.boards,

      // Profile
      'profile-timeline': ProfileFakeDb.timeline,
      'profile-photos-videos': ProfileFakeDb.photosVideos,
      'profile-about': ProfileFakeDb.about,

      // Icons
      icons: IconsFakeDb.icons
    };
  }
}
