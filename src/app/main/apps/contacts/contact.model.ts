import { FuseUtils } from '@fuse/utils';

const keywords = [
  { label: 'Russia', color: 'warn' },
  { label: 'Putin', color: 'warn' },
  { label: 'China', color: 'accent' },
  { label: 'Iran', color: 'warn' },
  { label: 'Nuclear', color: 'primary' },
  { label: 'Brexit', color: 'primary' },
  { label: 'ISIS', color: 'accent' }
];

const targets = [
  { label: 'Russia', color: 'warn' },
  { label: 'India', color: 'warn' },
  { label: 'Pakistan', color: 'accent' },
  { label: 'Iran', color: 'warn' },
  { label: 'China', color: 'accent' },
  { label: 'Thailand', color: 'primary' },
  { label: 'Syria', color: 'accent' }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class Contact {
  id: string;
  name: string;
  capital: string;
  subregion: string;
  nativeName: string;
  avatar: string;
  latlng: any[];
  keywords: any[];
  targets: any[];
  population: string;
  region: string;
  flag: string;

  buildKeywords(): any[] {
    const k = [];
    const num = getRandomInt(1, 6);
    for (let i = 0; i < num; i++) {
      k.push(keywords[Math.floor(Math.random() * keywords.length)]);
    }

    return Array.from(new Set(k.map((item: any) => item.label)));
  }

  buildTargets(): any[] {
    const t = [];
    const num = getRandomInt(1, 4);
    for (let i = 0; i < num; i++) {
      t.push(targets[Math.floor(Math.random() * targets.length)]);
    }

    return Array.from(new Set(t.map((item: any) => item.label)));
  }

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(contact) {
    {
      this.id = contact.id || FuseUtils.generateGUID();
      this.name = contact.name || '';
      this.nativeName = contact.nativeName || '';
      this.avatar = contact.flag || 'assets/images/avatars/profile.jpg';
      this.capital = contact.capital || '';
      this.subregion = contact.subregion || '';
      this.region = contact.region || '';
      this.population = contact.population || '';
      this.latlng = contact.latlng || '';
      this.keywords = this.buildKeywords();
      this.targets = this.buildTargets();
    }
  }
}
