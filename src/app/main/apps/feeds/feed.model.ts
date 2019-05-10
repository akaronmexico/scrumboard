import { FuseUtils } from '@fuse/utils';

export class Feed {
  id: string;
  rssname: string;
  url: string;

  /**
   * Constructor
   *
   * @param feed
   */
  constructor(feed) {
    {
      this.id = feed.id || FuseUtils.generateGUID();
      this.rssname = feed.rssname || '';
      this.url = feed.url || '';
    }
  }
}
