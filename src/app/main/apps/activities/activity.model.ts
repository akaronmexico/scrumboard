import { FuseUtils } from '@fuse/utils';
import { Persona } from '../personas/persona.model';

export class Activity {
  uuid: string;
  taskId: string;
  action: string;
  url: string;
  comments: string;
  personaId: string;
  personas: any[];
  persona: Persona;
  filteredPersonas: any[];
  chart: any;
  editMode = false;
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
   * @param activity
   */
  constructor(activity) {
    {
      this.uuid = activity.uuid || null;
      this.taskId = activity.taskId || null;
      this.personaId = activity.personaId || '';
      this.comments = activity.comments || '';
      this.action = activity.action || '';
      this.url = activity.url || '';
      this.personas = activity.personas || [];
      this.histogram = activity.histogram || [];
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
