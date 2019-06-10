import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { environment } from 'environments/environment';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { Activity } from './activity.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivitysService {
  onActivitysChanged: BehaviorSubject<any>;
  onSelectedActivitysChanged: BehaviorSubject<any>;
  onPersonasChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;
  baseURL = environment.baseUrl;
  activitys: Activity[];
  personas: string[];
  user: any;
  selectedActivitys: string[] = [];

  searchText: string;
  filterBy: string;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(
    private _httpClient: HttpClient,
    private loaderService: FuseProgressBarService
  ) {
    // Set the defaults
    this.onActivitysChanged = new BehaviorSubject([]);
    this.onPersonasChanged = new BehaviorSubject([]);
    this.onSelectedActivitysChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  getPersonas(taskId: string): Observable<any> {
    if (!taskId || taskId === '') {
      // tslint:disable-next-line: deprecation
      return of([]);
    }

    return this._httpClient.get(this.baseURL + '/personas').pipe(
      map((response: any) => {
        // this.personas = response;
        this.personas = ['Ivan', 'Sven', 'Tomas', 'Gregory'];
        this.onPersonasChanged.next(this.personas);
        return this.personas;
      })
    );
  }

  /**
   * Get activitys
   *
   * @returns {Observable<any>}
   */
  getActivitys(taskId: string): Observable<any> {
    if (!taskId || taskId === '') {
      // tslint:disable-next-line: deprecation
      return of([]);
    }

    const params = new HttpParams().set('taskId', taskId);

    return this._httpClient
      .get(this.baseURL + '/taskactivity', { params })
      .pipe(
        map((response: any) => {
          this.activitys = response;

          if (this.searchText && this.searchText !== '') {
            this.activitys = FuseUtils.filterArrayByString(
              this.activitys,
              this.searchText
            );
          }

          this.activitys = this.activitys.map(activity => {
            return new Activity(activity);
          });
          // console.log('activitys: ' + JSON.stringify(this.activitys, null, 2));
          this.onActivitysChanged.next(this.activitys);

          return this.activitys;
        })
      );
  }

  /**
   * Toggle selected activity by id
   *
   * @param id
   */
  toggleSelectedActivity(id): void {
    // First, check if we already have that activity as selected...
    if (this.selectedActivitys.length > 0) {
      const index = this.selectedActivitys.indexOf(id);

      if (index !== -1) {
        this.selectedActivitys.splice(index, 1);

        // Trigger the next event
        this.onSelectedActivitysChanged.next(this.selectedActivitys);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedActivitys.push(id);

    // Trigger the next event
    this.onSelectedActivitysChanged.next(this.selectedActivitys);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedActivitys.length > 0) {
      this.deselectActivitys();
    } else {
      this.selectActivitys();
    }
  }

  /**
   * Select activitys
   *
   * @param filterParameter
   * @param filterValue
   */
  selectActivitys(filterParameter?, filterValue?): void {
    this.selectedActivitys = [];

    // If there is no filter, select all activitys
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedActivitys = [];
      this.activitys.map(bin => {
        this.selectedActivitys.push(bin.uuid);
      });
    }

    // Trigger the next event
    this.onSelectedActivitysChanged.next(this.selectedActivitys);
  }

  updateActivitys(taskId: string, activitys: Activity[]): Promise<any> {
    const posts = [];
    this.showLoader();

    return new Promise((resolve, reject) => {
      for (const activity of activitys) {
        delete activity.personas;
        delete activity.chart;
        delete activity.histogram;
        activity.personaId = activity.persona.uuid;
        delete activity.persona;
        posts.push(this.updateActivity(taskId, activity, false));
      }
      Promise.all([posts]).then(
        ([files]) => {
          this.hideLoader();
          resolve();
        },
        err => {
          this.hideLoader();
          reject(err);
        }
      );
    });
  }

  /**
   * Update activity
   *
   * @param activity
   * @returns {Promise<any>}
   */
  updateActivity(
    taskId: string,
    activity: Activity,
    useLoader: boolean = true
  ): Promise<any> {
    if (useLoader) {
      this.showLoader();
    }
    return new Promise((resolve, reject) => {
      if (!activity.uuid || activity.uuid === '') {
        this._httpClient
          .post(this.baseURL + '/taskactivity', { ...activity })
          .subscribe(
            response => {
              this.getActivitys(taskId).pipe(
                map(res => {
                  if (useLoader) {
                    this.hideLoader();
                  }
                  this.activitys = res;
                  this.onActivitysChanged.next(this.activitys);
                  resolve(res);
                })
              );
            },
            err => {
              if (useLoader) {
                this.hideLoader();
              }

              reject(err);
            }
          );
      } else {
        this._httpClient
          .put(this.baseURL + '/taskactivity' + activity.uuid, { ...activity })
          .subscribe(
            response => {
              this.getActivitys(taskId).pipe(
                map(res => {
                  this.hideLoader();
                  this.activitys = res;
                  this.onActivitysChanged.next(this.activitys);
                  resolve(res);
                })
              );
            },
            err => {
              this.hideLoader();
              reject(err);
            }
          );
      }
    });
  }

  /**
   * Deselect activitys
   */
  deselectActivitys(): void {
    this.selectedActivitys = [];

    // Trigger the next event
    this.onSelectedActivitysChanged.next(this.selectedActivitys);
  }

  /**
   * Delete bin
   *
   * @param bin
   */
  deleteActivity(activity, broadcastChange: boolean = true): void {
    this.showLoader();
    this._httpClient
      .delete(this.baseURL + '/taskactivity/' + activity.uuid, {})
      .subscribe(response => {
        const index = this.activitys.indexOf(activity);
        this.activitys.splice(index, 1);
        if (broadcastChange) {
          this.onActivitysChanged.next(this.activitys);
        }

        this.hideLoader();
      });
  }

  /**
   * Delete selected activitys
   */
  deleteSelectedActivitys(): void {
    for (const uuid of this.selectedActivitys) {
      const activity = this.activitys.find(_activity => {
        return _activity.uuid === uuid;
      });

      this._httpClient
        .delete(this.baseURL + '/taskactivity/' + activity.uuid, {})
        .subscribe(response => {
          const index = this.activitys.indexOf(activity);
          this.activitys.splice(index, 1);
        });
    }
    this.onActivitysChanged.next(this.activitys);
    this.deselectActivitys();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
