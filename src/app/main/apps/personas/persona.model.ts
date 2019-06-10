import { FuseUtils } from '@fuse/utils';

export class Persona {
  uuid: string;
  partnerId: string;
  selector: string;
  comments: string;
  service: string;
  name: string;

  /**
   * Constructor
   *
   * @param persona
   */
  constructor(persona) {
    {
      this.uuid = persona.uuid || '';
      this.partnerId = persona.partnerId || '';
      this.name = persona.name || '';
      this.selector = persona.selector || '';
      this.service = persona.service || '';
      this.comments = persona.comments || '';
    }
  }
}
