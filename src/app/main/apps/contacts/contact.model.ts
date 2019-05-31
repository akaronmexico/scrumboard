import { FuseUtils } from '@fuse/utils';
import { Target } from '../targets/target.model';

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
  uuid: string;
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
  bins: any[];

  taskCount: number;
  chart: any;
  histogram: any[];

  buildChartData(): void {
    const data = [0];
    const labels = ['Start'];
    if (this.histogram && this.histogram.length > 0) {
      this.histogram[0].buckets.forEach(bucket => {
        data.push(bucket.count);
        labels.push(bucket.key);
      });
    } else {
    }
    this.chart.datasets[0].data = data;
    this.chart.labels = labels;
  }

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
      this.uuid = contact.uuid || '';
      this.name = contact.name || contact.partner || '';
      this.nativeName = contact.nativeName || '';
      this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
      this.capital = contact.capital || '';
      this.subregion = contact.subregion || '';
      this.region = contact.region || '';
      this.population = contact.population || '';
      this.latlng = contact.latlng || '';
      this.targets = contact.targets || [];
      this.targets = this.targets.map(target => {
        return new Target(target);
      });
      this.histogram = contact.histogram || [];
      this.taskCount = contact.taskCount || 0;
      this.chart = {
        datasets: [
          {
            label: 'Hits',
            data: [],
            fill: false
          }
        ],
        labels: [],
        colors: [
          {
            borderColor: '#2196f3'
          }
        ],
        altColors: [
          {
            borderColor: '#fff'
          }
        ],
        options: {
          spanGaps: false,
          legend: {
            display: false
          },
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 4,
              left: 4,
              right: 4,
              bottom: 4
            }
          },
          scales: {
            xAxes: [
              {
                display: false
              }
            ],
            yAxes: [
              {
                display: false,
                ticks: {}
              }
            ]
          }
        }
      };

      this.buildChartData();
    }
  }
}
