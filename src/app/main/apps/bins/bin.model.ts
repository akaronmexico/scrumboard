import { FuseUtils } from '@fuse/utils';

export class Bin {
  uuid: string;
  bin: string;
  description: string;

  /**
   * Constructor
   *
   * @param bin
   */
  constructor(bin) {
    {
      this.uuid = bin.uuid || '';
      this.bin = bin.bin || '';
      this.description = bin.description || '';
    }
  }
}

export class TargetBin {
  uuid: string;
  binId: string;
  keywords: string[];

  /**
   * Constructor
   *
   * @param bin
   */
  constructor(targetBin) {
    {
      this.uuid = targetBin.uuid;
      this.binId = targetBin.binId || '';
      this.keywords = targetBin.keywords || [];
    }
  }
}
