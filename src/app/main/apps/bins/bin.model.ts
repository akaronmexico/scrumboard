import { FuseUtils } from '@fuse/utils';

export class Bin {
  id: string;
  name: string;
  description: string;


  /**
   * Constructor
   *
   * @param bin
   */
  constructor(bin) {
    {
      this.id = bin.id || FuseUtils.generateGUID();
      this.name = bin.name || '';
      this.description = bin.description || '';
    }
  }
}

export class TargetBin {
  id: string;
  bin: Bin;
  keywords: string[];


  /**
   * Constructor
   *
   * @param bin
   */
  constructor(targetBin) {
    {
      this.id = targetBin.id || FuseUtils.generateGUID();
      this.bin = targetBin.bin || new Bin({});
      this.keywords = targetBin.keywords || [];
    }
  }
}
