import { FuseUtils } from '@fuse/utils';

export class List {
  uuid: string;
  name: string;
  idCards: string[];

  /**
   * Constructor
   *
   * @param list
   */
  constructor(list) {
    this.uuid = list.uuid || '';
    this.name = list.name || '';
    this.idCards = [];
  }
}
