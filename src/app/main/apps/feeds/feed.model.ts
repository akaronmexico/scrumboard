export class Feed {
  uuid: string;
  rssname: string;

  url: string;

  count: number;
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
  /**
   * Constructor
   *
   * @param feed
   */
  constructor(feed) {
    {
      this.uuid = feed.uuid || '';
      this.rssname = feed.rssname || '';
      this.url = feed.url || '';
      this.count = feed.count || 0;
      this.histogram = feed.histogram || [];
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
