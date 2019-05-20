import { FuseUtils } from '@fuse/utils';

export class Card {
  id: string;
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
    this.id = card.id || FuseUtils.generateGUID();
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
    console.log('card: ' + JSON.stringify(card, null, 2));
    this.due = card.due || '';
  }
}
