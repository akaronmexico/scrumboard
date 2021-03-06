import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Bin } from 'app/main/apps/bins/bin.model';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BinsService implements Resolve<any> {
  onBinsChanged: BehaviorSubject<any>;
  onSelectedBinsChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;
  baseURL = environment.baseUrl;
  bins: Bin[];
  user: any;
  selectedBins: string[] = [];

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
    this.onBinsChanged = new BehaviorSubject([]);
    this.onSelectedBinsChanged = new BehaviorSubject([]);
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
      Promise.all([this.getBins()]).then(([files]) => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getBins();
        });

        this.onFilterChanged.subscribe(filter => {
          this.filterBy = filter;
          this.getBins();
        });

        resolve();
      }, reject);
    });
  }

  /**
   * Get bins
   *
   * @returns {Promise<any>}
   */
  getBins(): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/bins')
        .subscribe((response: any) => {
          this.bins = response;

          if (this.searchText && this.searchText !== '') {
            this.bins = FuseUtils.filterArrayByString(
              this.bins,
              this.searchText
            );
          }

          this.bins = this.bins.map(bin => {
            return new Bin(bin);
          });
          this.onBinsChanged.next(this.bins);
          this.hideLoader();
          resolve(this.bins);
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
    if (this.selectedBins.length > 0) {
      const index = this.selectedBins.indexOf(id);

      if (index !== -1) {
        this.selectedBins.splice(index, 1);

        // Trigger the next event
        this.onSelectedBinsChanged.next(this.selectedBins);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedBins.push(id);

    // Trigger the next event
    this.onSelectedBinsChanged.next(this.selectedBins);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedBins.length > 0) {
      this.deselectBins();
    } else {
      this.selectBins();
    }
  }

  /**
   * Select bins
   *
   * @param filterParameter
   * @param filterValue
   */
  selectBins(filterParameter?, filterValue?): void {
    this.selectedBins = [];

    // If there is no filter, select all bins
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedBins = [];
      this.bins.map(bin => {
        this.selectedBins.push(bin.uuid);
      });
    }

    // Trigger the next event
    this.onSelectedBinsChanged.next(this.selectedBins);
  }

  /**
   * Update bin
   *
   * @param bin
   * @returns {Promise<any>}
   */
  updateBin(bin): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      this._httpClient
        .post(this.baseURL + '/bins', { ...bin })
        .subscribe(response => {
          this.getBins()
            .then(res => {})
            .finally(() => {
              this.hideLoader();
              resolve(response);
            });
        });
    });
  }

  /**
   * Deselect bins
   */
  deselectBins(): void {
    this.selectedBins = [];

    // Trigger the next event
    this.onSelectedBinsChanged.next(this.selectedBins);
  }

  /**
   * Delete bin
   *
   * @param bin
   */
  deleteBin(bin): void {
    this.showLoader();
    this._httpClient
      .delete(this.baseURL + '/bins/' + bin.uuid, {})
      .subscribe(response => {
        const binIndex = this.bins.indexOf(bin);
        this.bins.splice(binIndex, 1);
        this.onBinsChanged.next(this.bins);
        this.hideLoader();
      });
  }

  /**
   * Delete selected bins
   */
  deleteSelectedBins(): void {
    for (const binId of this.selectedBins) {
      const bin = this.bins.find(_bin => {
        return _bin.uuid === binId;
      });
      const binIndex = this.bins.indexOf(bin);
      this.bins.splice(binIndex, 1);
    }
    this.onBinsChanged.next(this.bins);
    this.deselectBins();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
