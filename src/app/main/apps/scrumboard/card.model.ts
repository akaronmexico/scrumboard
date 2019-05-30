import { FuseUtils } from '@fuse/utils';

export class Card {
  uuid: string;
  name: string;
  description: string;
  date: Date;
  idAttachmentCover: string;
  idMembers: string[];
  idBins: string[];
  attachments: any[];
  subscribed: boolean;
  checklists: any[];
  checkItems: number;
  checkItemsChecked: number;
  comments: any[];
  activities: any[];
  due: string;

  /**
   * Constructor
   *
   * @param card
   */
  constructor(card) {
    this.uuid = card.uuid || '';
    this.name = card.name || '';
    this.description = card.description || '';
    this.idAttachmentCover = card.idAttachmentCover || '';
    this.idMembers = card.idMembers || [];
    this.idBins = card.idBins || [];
    this.attachments = card.attachments || [];
    this.subscribed = card.subscribed || true;
    this.checklists = card.checklists || [];
    this.checkItems = card.checkItems || 0;
    this.checkItemsChecked = card.checkItemsChecked || 0;
    this.comments = card.comments || [];
    this.activities = card.activities || [];
    this.due = card.due || '';
  }
}
