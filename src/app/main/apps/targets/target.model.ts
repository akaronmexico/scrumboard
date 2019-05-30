import { FuseUtils } from '@fuse/utils';
import { Bin, TargetBin } from '../bins/bin.model';

export class Target {
  uuid: string;
  name: string;
  bins: TargetBin[];

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(target) {
    {
      this.uuid = target.uuid || '';
      this.name = target.name || '';
      this.bins = target.bins || [];
      this.bins = this.bins.map(bin => {
        return new TargetBin(bin);
      });
    }
  }
}
