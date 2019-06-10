import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Partner } from 'app/main/apps/partners/partner.model';
import { environment } from 'environments/environment';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';

@Injectable({
  providedIn: 'root'
})
export class PartnersService implements Resolve<any> {
  onPartnersChanged: BehaviorSubject<any>;
  onSelectedPartnersChanged: BehaviorSubject<any>;
  onUserDataChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;
  baseURL = environment.baseUrl;
  partners: Partner[];
  user: any;
  selectedPartners: string[] = [];

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
    this.onPartnersChanged = new BehaviorSubject([]);
    this.onSelectedPartnersChanged = new BehaviorSubject([]);
    this.onUserDataChanged = new BehaviorSubject([]);
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
      Promise.all([this.getPartners()]).then(([files]) => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getPartners();
        });

        this.onFilterChanged.subscribe(filter => {
          this.filterBy = filter;
          this.getPartners();
        });

        resolve();
      }, reject);
    });
  }

  /**
   * used to populate dropdowns to select a partner
   */
  getpartnerNames(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/partners')
        .subscribe((response: any) => {
          try {
            this.partners = response;
            this.partners = this.partners.map(partner => {
              return new Partner(partner);
            });
            resolve(this.partners);
          } catch (err) {
            console.log('getpartnerNames err: ' + JSON.stringify(err, null, 2));
          }
        }, reject);
    });
  }

  /**
   * Get partners
   *
   * @returns {Promise<any>}
   */
  getPartners(): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/partnerconfig')
        .subscribe((response: any) => {
          try {
            this.partners = response;

            if (this.searchText && this.searchText !== '') {
              this.partners = FuseUtils.filterArrayByString(
                this.partners,
                this.searchText
              );
            }

            this.partners = this.partners.map(partner => {
              return new Partner(partner);
            });

            this.onPartnersChanged.next(this.partners);
            this.hideLoader();
            resolve(this.partners);
          } catch (err) {
            console.log('err: ' + JSON.stringify(err, null, 2));
          }
        }, reject);
    });
  }

  /**
   * Toggle selected partner by id
   *
   * @param id
   */
  toggleSelectedpartner(id): void {
    // First, check if we already have that partner as selected...
    if (this.selectedPartners.length > 0) {
      const index = this.selectedPartners.indexOf(id);

      if (index !== -1) {
        this.selectedPartners.splice(index, 1);

        // Trigger the next event
        this.onSelectedPartnersChanged.next(this.selectedPartners);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedPartners.push(id);

    // Trigger the next event
    this.onSelectedPartnersChanged.next(this.selectedPartners);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedPartners.length > 0) {
      this.deselectPartners();
    } else {
      this.selectPartners();
    }
  }

  /**
   * Select partners
   *
   * @param filterParameter
   * @param filterValue
   */
  selectPartners(filterParameter?, filterValue?): void {
    this.selectedPartners = [];

    // If there is no filter, select all partners
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedPartners = [];
      this.partners.map(partner => {
        this.selectedPartners.push(partner.uuid);
      });
    }

    // Trigger the next event
    this.onSelectedPartnersChanged.next(this.selectedPartners);
  }

  /**
   * Update partner
   *
   * @param partner
   * @returns {Promise<any>}
   */
  createPartner(partner: Partner): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      delete partner['chart'];
      delete partner['histogram'];
      try {
        this._httpClient
          .post(this.baseURL + '/partnerconfig/' + partner.uuid, { ...partner })
          .subscribe(
            response => {
              this.getPartners()
                .then(res => {})
                .finally(() => {
                  this.hideLoader();
                  resolve(response);
                });
            },
            err => {
              this.hideLoader();
              console.log('error: ' + JSON.stringify(err, null, 2));
              reject(null);
            }
          );
      } catch (e) {
        console.log('e2: ' + JSON.stringify(e, null, 2));
      }
    });
  }

  updatePartner(partner: Partner): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      delete partner['chart'];
      delete partner['histogram'];
      try {
        this._httpClient
          .put(this.baseURL + '/partnerconfig/' + partner.uuid, { ...partner })
          .subscribe(
            response => {
              this.getPartners()
                .then(res => {})
                .finally(() => {
                  this.hideLoader();
                  resolve(response);
                });
            },
            err => {
              this.hideLoader();
              console.log('error: ' + JSON.stringify(err, null, 2));
              reject(null);
            }
          );
      } catch (e) {
        console.log('e2: ' + JSON.stringify(e, null, 2));
      }
    });
  }

  /**
   * Deselect partners
   */
  deselectPartners(): void {
    this.selectedPartners = [];

    // Trigger the next event
    this.onSelectedPartnersChanged.next(this.selectedPartners);
  }

  /**
   * Delete partner
   *
   * @param partner
   */
  deletepartner(partner): void {
    this.showLoader();
    this._httpClient
      .delete(this.baseURL + '/partners/' + partner.id, {})
      .subscribe(response => {
        const partnerIndex = this.partners.indexOf(partner);
        this.partners.splice(partnerIndex, 1);
        this.onPartnersChanged.next(this.partners);
        this.hideLoader();
      });
  }

  /**
   * Delete selected partners
   */
  deleteSelectedPartners(): void {
    for (const partnerId of this.selectedPartners) {
      const partner = this.partners.find(_partner => {
        return _partner.uuid === partnerId;
      });
      this._httpClient
        .delete(this.baseURL + '/partners/' + partner.uuid, {})
        .subscribe(response => {
          const partnerIndex = this.partners.indexOf(partner);
          this.partners.splice(partnerIndex, 1);
        });
    }
    this.onPartnersChanged.next(this.partners);
    this.deselectPartners();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
