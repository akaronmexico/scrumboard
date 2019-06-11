import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';

@Component({
  selector: 'analytics-dashboard',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit {
  widgets: any;
  keywordMetrics: any[];
  totals: any;
  ranges: any[];
  chartData: any;
  chartLabels: any;
  widget1SelectedYear = '2016';
  selectedArticleRange = 'day';
  widget5SelectedDay = 'today';
  currentRange: any;
  /**
   * Constructor
   *
   * @param {AnalyticsDashboardService} _analyticsDashboardService
   */
  constructor(private _analyticsDashboardService: AnalyticsDashboardService) {
    // Register the custom chart.js plugin
    this._registerCustomChartJSPlugin();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Get the widgets from the service
    this.widgets = this._analyticsDashboardService.widgets;
    this.keywordMetrics = this._analyticsDashboardService.keywordMetrics;
    this.totals = this._analyticsDashboardService.totals;
    this.buildWeeklyChart();
    this.ranges = [
      { key: 'hour', value: 'Last Hour' },
      { key: 'day', value: 'Today' },
      { key: 'week', value: 'This Week' }
    ];
    this.currentRange = { key: 'hour', value: 'Last Hour' };
  }

  buildWeeklyChart(): void {
    this.chartData = {};
    this.chartLabels = {};
    const data = [];
    const checkedData = {};

    if (this.totals && this.totals.histograms) {
      const hourlyChecked = this.totals.histograms.hourlyChecked;
      const hourlyHits = this.totals.histograms.hourlyHits;
      if (hourlyChecked && hourlyHits) {
        const hourlyCheckedData = [];
        const hourlyLabels = [];
        hourlyChecked.forEach(bucket => {
          hourlyCheckedData.push(bucket.count);
          hourlyLabels.push(bucket.label);
        });
        const hourlyCheckedSet = {
          label: 'Checked Articles',
          data: hourlyCheckedData,
          fill: 'start'
        };

        const hourlyHitsData = [];
        hourlyHits.forEach(bucket => {
          hourlyHitsData.push(bucket.count);
        });
        if (hourlyHitsData.length < hourlyCheckedData.length) {
          const diff = hourlyCheckedData.length - hourlyHitsData.length;
          for (let i = 0; i < diff; i++) {
            hourlyHitsData.unshift(0);
          }
        }
        const hourlyMatchedSet = {
          label: 'Matched Articles',
          data: hourlyHitsData,
          fill: 'start'
        };

        this.chartData['hour'] = [hourlyMatchedSet, hourlyCheckedSet];
        this.chartLabels['hour'] = hourlyLabels;
        this.chartData['hourMatches'] = [hourlyMatchedSet];
        this.chartLabels['hourMatches'] = hourlyLabels;
      }
      const weeklyHits = this.totals.histograms.weeklyHits;
      const weeklyChecked = this.totals.histograms.weeklyChecked;

      if (weeklyHits && weeklyChecked) {
        const weeklyCheckedData = [];
        const weeklyLabels = [];
        weeklyChecked.forEach(bucket => {
          weeklyCheckedData.push(bucket.count);
          weeklyLabels.push(bucket.label);
        });
        const weeklyCheckedSet = {
          label: 'Checked Articles',
          data: weeklyCheckedData,
          fill: 'start'
        };

        const weeklyHitsData = [];
        weeklyHits.forEach(bucket => {
          weeklyHitsData.push(bucket.count);
        });
        if (weeklyHitsData.length < weeklyCheckedData.length) {
          const diff = weeklyCheckedData.length - weeklyHitsData.length;
          for (let i = 0; i < diff; i++) {
            weeklyHitsData.unshift(0);
          }
        }

        const weeklyMatchedSet = {
          label: 'Matched Articles',
          data: weeklyHitsData
        };
        this.chartData['week'] = [weeklyMatchedSet, weeklyCheckedSet];
        this.chartLabels['week'] = weeklyLabels;
      }

      const dailyHits = this.totals.histograms.dailyHits;
      const dailyChecked = this.totals.histograms.dailyChecked;

      if (dailyHits && dailyChecked) {
        const dailyCheckedData = [];
        const dailyLabels = [];
        dailyChecked.forEach(bucket => {
          dailyCheckedData.push(bucket.count);
          dailyLabels.push(bucket.label);
        });
        const dailyCheckedSet = {
          label: 'Checked Articles',
          data: dailyCheckedData
        };

        const dailyHitsData = [];
        dailyHits.forEach(bucket => {
          dailyHitsData.push(bucket.count);
        });

        if (dailyHits.length < dailyCheckedData.length) {
          const diff = dailyCheckedData.length - dailyHits.length;
          for (let i = 0; i < diff; i++) {
            dailyHits.unshift(0);
          }
        }

        const dailyMatchedSet = {
          label: 'Matched Articles',
          data: dailyHitsData
        };
        this.chartData['day'] = [dailyMatchedSet, dailyCheckedSet];
        this.chartLabels['day'] = dailyLabels;
      }
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register a custom plugin
   */
  private _registerCustomChartJSPlugin(): void {
    (<any>window).Chart.plugins.register({
      afterDatasetsDraw: function(chart, easing): any {
        // Only activate the plugin if it's made available
        // in the options
        if (
          !chart.options.plugins.xLabelsOnTop ||
          (chart.options.plugins.xLabelsOnTop &&
            chart.options.plugins.xLabelsOnTop.active === false)
        ) {
          return;
        }

        // To only draw at the end of animation, check for easing === 1
        const ctx = chart.ctx;

        chart.data.datasets.forEach(function(dataset, i): any {
          const meta = chart.getDatasetMeta(i);
          if (!meta.hidden) {
            meta.data.forEach(function(element, index): any {
              // Draw the text in black, with the specified font
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              const fontSize = 13;
              const fontStyle = 'normal';
              const fontFamily = 'Roboto, Helvetica Neue, Arial';
              ctx.font = (<any>window).Chart.helpers.fontString(
                fontSize,
                fontStyle,
                fontFamily
              );

              // Just naively convert to string for now
              const dataString = dataset.data[index].toString();

              // Make sure alignment settings are correct
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              const padding = 15;
              const startY = 24;
              const position = element.tooltipPosition();
              ctx.fillText(dataString, position.x, startY);

              ctx.save();

              ctx.beginPath();
              ctx.setLineDash([5, 3]);
              ctx.moveTo(position.x, startY + padding);
              ctx.lineTo(position.x, position.y - padding);
              ctx.strokeStyle = 'rgba(255,255,255,0.12)';
              ctx.stroke();

              ctx.restore();
            });
          }
        });
      }
    });
  }
}
