import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Feed } from 'app/main/apps/feeds/feed.model';

@Injectable({
  providedIn: 'root'
})
export class FeedsService implements Resolve<any> {
  onFeedsChanged: BehaviorSubject<any>;
  onSelectedFeedsChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  feeds: Feed[];
  user: any;
  selectedFeeds: string[] = [];

  searchText: string;
  filterBy: string;

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onFeedsChanged = new BehaviorSubject([]);
    this.onSelectedFeedsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

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
      Promise.all([this.getFeeds()]).then(([files]) => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getFeeds();
        });

        this.onFilterChanged.subscribe(filter => {
          this.filterBy = filter;
          this.getFeeds();
        });

        resolve();
      }, reject);
    });
  }

  /**
   * Get feeds
   *
   * @returns {Promise<any>}
   */
  getFeeds(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/feeds-feeds').subscribe((response: any) => {
        this.feeds = response;

        if (this.filterBy === 'starred') {
          this.feeds = this.feeds.filter(_bin => {
            return this.user.starred.includes(_bin.id);
          });
        }

        if (this.filterBy === 'frequent') {
          this.feeds = this.feeds.filter(_bin => {
            return this.user.frequentContacts.includes(_bin.id);
          });
        }

        if (this.searchText && this.searchText !== '') {
          this.feeds = FuseUtils.filterArrayByString(
            this.feeds,
            this.searchText
          );
        }

        this.feeds = this.feeds.map(feed => {
          return new Feed(feed);
        });

        this.onFeedsChanged.next(this.feeds);
        resolve(this.feeds);
      }, reject);
    });
  }

  /**
   * Toggle selected bin by id
   *
   * @param id
   */
  toggleSelectedBin(id): void {
    // First, check if we already have that bin as selected...
    if (this.selectedFeeds.length > 0) {
      const index = this.selectedFeeds.indexOf(id);

      if (index !== -1) {
        this.selectedFeeds.splice(index, 1);

        // Trigger the next event
        this.onSelectedFeedsChanged.next(this.selectedFeeds);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedFeeds.push(id);

    // Trigger the next event
    this.onSelectedFeedsChanged.next(this.selectedFeeds);
  }

  /**
   * Toggle selected feed by id
   *
   * @param id
   */
  toggleSelectedFeed(id): void {
    // First, check if we already have that feed as selected...
    if (this.selectedFeeds.length > 0) {
      const index = this.selectedFeeds.indexOf(id);

      if (index !== -1) {
        this.selectedFeeds.splice(index, 1);

        // Trigger the next event
        this.onSelectedFeedsChanged.next(this.selectedFeeds);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedFeeds.push(id);

    // Trigger the next event
    this.onSelectedFeedsChanged.next(this.selectedFeeds);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedFeeds.length > 0) {
      this.deselectFeeds();
    } else {
      this.selectFeeds();
    }
  }

  /**
   * Select feeds
   *
   * @param filterParameter
   * @param filterValue
   */
  selectFeeds(filterParameter?, filterValue?): void {
    this.selectedFeeds = [];

    // If there is no filter, select all feeds
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedFeeds = [];
      this.feeds.map(bin => {
        this.selectedFeeds.push(bin.id);
      });
    }

    // Trigger the next event
    this.onSelectedFeedsChanged.next(this.selectedFeeds);
  }

  /**
   * Update bin
   *
   * @param feed
   * @returns {Promise<any>}
   */
  updateFeed(bin): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post('api/feeds-feeds/' + bin.id, { ...bin })
        .subscribe(response => {
          this.getFeeds();
          resolve(response);
        });
    });
  }

  /**
   * Deselect feeds
   */
  deselectFeeds(): void {
    this.selectedFeeds = [];

    // Trigger the next event
    this.onSelectedFeedsChanged.next(this.selectedFeeds);
  }

  /**
   * Delete bin
   *
   * @param bin
   */
  deleteFeed(feed): void {
    const index = this.feeds.indexOf(feed);
    this.feeds.splice(index, 1);
    this.onFeedsChanged.next(this.feeds);
  }

  /**
   * Delete selected feeds
   */
  deleteSelectedFeeds(): void {
    for (const id of this.selectedFeeds) {
      const feed = this.feeds.find(_feed => {
        return _feed.id === id;
      });
      const index = this.feeds.indexOf(feed);
      this.feeds.splice(index, 1);
    }
    this.onFeedsChanged.next(this.feeds);
    this.deselectFeeds();
  }
}