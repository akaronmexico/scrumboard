import { FuseUtils } from '@fuse/utils';

export class Bin {
  uuid: string;
  bin: string;
  description: string;
  taskCount: number;
  chart: any;
  histogram: any[];

  buildChartData(): void {
    const data = [0];
    const labels = [''];
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
      this.taskCount = bin.count || 0;
      this.histogram = bin.histogram || [];
      this.chart = {
        datasets: [
          {
            label: 'Hits',
            data: [],
            fill: true
          }
        ],
        labels: [],
        colors: [
          {
            borderColor: '#777'
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
