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

export class Partner {
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
    const data = [];
    const labels = [];

    if (this.histogram && this.histogram.length > 0) {
      this.histogram[0].buckets.forEach(bucket => {
        data.push(bucket.count);
        labels.push(bucket.key);
      });
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
   * @param partner
   */
  constructor(partner) {
    {
      this.uuid = partner.uuid || '';
      this.name = partner.name || partner.partner || '';
      this.nativeName = partner.nativeName || '';
      this.avatar = partner.avatar || 'assets/images/avatars/profile.jpg';
      this.capital = partner.capital || '';
      this.subregion = partner.subregion || '';
      this.region = partner.region || '';
      this.population = partner.population || '';
      this.latlng = partner.latlng || '';
      this.targets = partner.targets || [];
      this.targets = this.targets.map(target => {
        return new Target(target);
      });
      this.histogram = partner.histogram || [];
      this.taskCount = partner.taskCount || 0;
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
          spanGaps: true,
          legend: {
            display: false
          },
          maintainAspectRatio: true,
          layout: {
            padding: {
              top: 4,
              left: 8,
              right: 16,
              bottom: 24
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
