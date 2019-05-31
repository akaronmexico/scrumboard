import { FuseUtils } from '@fuse/utils';
import { Bin, TargetBin } from '../bins/bin.model';

export class Target {
  uuid: string;
  target: string;
  bins: TargetBin[];

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(target) {
    {
      this.uuid = target.uuid || '';
      this.target = target.target || '';
      this.bins = target.bins || [];
      this.bins = this.bins.map(bin => {
        return new TargetBin(bin);
      });
    }
  }
}
