import { FuseUtils } from '@fuse/utils';

export class Bin {
  uuid: string;
  name: string;
  description: string;

  /**
   * Constructor
   *
   * @param bin
   */
  constructor(bin) {
    {
      this.uuid = bin.uuid || '';
      this.name = bin.name || bin.bin || '';
      this.description = bin.description || '';
    }
  }
}

export class TargetBin {
  uuid: string;
  bin: Bin;
  keywords: string[];

  /**
   * Constructor
   *
   * @param bin
   */
  constructor(targetBin) {
    {
      this.uuid = targetBin.uuid;
      this.keywords = targetBin.keywords || [];
    }
  }
}
