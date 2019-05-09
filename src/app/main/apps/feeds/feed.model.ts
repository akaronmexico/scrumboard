import { FuseUtils } from '@fuse/utils';

export class Feed {
  id: string;
  name: string;
  url: string;

  /**
   * Constructor
   *
   * @param bin
   */
  constructor(bin) {
    {
      this.id = bin.id || FuseUtils.generateGUID();
      this.name = bin.name || '';
      this.url = bin.url || '';
    }
  }
}
