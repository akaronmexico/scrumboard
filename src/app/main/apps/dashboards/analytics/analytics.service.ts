import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any> {
  widgets: any[];
  keywordMetrics: any[];
  totals: any;
  baseURL = environment.baseUrl;
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {}

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getWidgets(),
        this.getTotals(),
        this.getKeywordMetrics()
      ]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get widgets
   *
   * @returns {Promise<any>}
   */
  getWidgets(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get('api/analytics-dashboard-widgets')
        .subscribe((response: any) => {
          this.widgets = response;
          resolve(response);
        }, reject);
    });
  }

  getTotals(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/totals')
        .subscribe((response: any) => {
          this.totals = response;
          resolve(response);
        }, reject);
    });
  }

  getKeywordMetrics(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/keywordmetrics')
        .subscribe((response: any) => {
          this.keywordMetrics = response;
          resolve(response);
        }, reject);
    });
  }
}
