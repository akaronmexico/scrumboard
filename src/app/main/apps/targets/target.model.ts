import { FuseUtils } from '@fuse/utils';
import { Bin } from '../bins/bin.model';


export class Target {
  id: string;
  name: string;
  bins: Bin[];

  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(target) {
    {
      this.id = target.id || FuseUtils.generateGUID();
      this.name = target.name || '';
      this.bins = target.bins || [];
    }
  }
}
