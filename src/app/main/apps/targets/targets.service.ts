import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Target } from './target.model';

@Injectable({
  providedIn: 'root'
})
export class TargetsService {
  onTargetsChanged: BehaviorSubject<any>;
  onSelectedTargetsChanged: BehaviorSubject<any>;

  targets: Target[];
  user: any;
  selectedTargets: string[] = [];

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onTargetsChanged = new BehaviorSubject([]);
    this.onSelectedTargetsChanged = new BehaviorSubject([]);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Get targets
   *
   * @returns {Promise<any>}
   */
  getTargets(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/targets-targets').subscribe((response: any) => {
        this.targets = response;
        this.targets = this.targets.map(target => {
          return new Target(target);
        });

        this.onTargetsChanged.next(this.targets);
        resolve(this.targets);
      }, reject);
    });
  }

  /**
   * Toggle selected target by id
   *
   * @param id
   */
  toggleSelectedTarget(id): void {
    // First, check if we already have that target as selected...
    if (this.selectedTargets.length > 0) {
      const index = this.selectedTargets.indexOf(id);

      if (index !== -1) {
        this.selectedTargets.splice(index, 1);

        // Trigger the next event
        this.onSelectedTargetsChanged.next(this.selectedTargets);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedTargets.push(id);

    // Trigger the next event
    this.onSelectedTargetsChanged.next(this.selectedTargets);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedTargets.length > 0) {
      this.deselectTargets();
    } else {
      this.selectTargets();
    }
  }

  /**
   * Select targets
   *
   * @param filterParameter
   * @param filterValue
   */
  selectTargets(filterParameter?, filterValue?): void {
    this.selectedTargets = [];

    // If there is no filter, select all targets
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedTargets = [];
      this.targets.map(target => {
        this.selectedTargets.push(target.id);
      });
    }

    // Trigger the next event
    this.onSelectedTargetsChanged.next(this.selectedTargets);
  }

  /**
   * Update target
   *
   * @param target
   * @returns {Promise<any>}
   */
  updateTarget(target): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post('api/targets-targets/' + target.id, { ...target })
        .subscribe(response => {
          this.getTargets();
          resolve(response);
        });
    });
  }

  /**
   * Deselect targets
   */
  deselectTargets(): void {
    this.selectedTargets = [];

    // Trigger the next event
    this.onSelectedTargetsChanged.next(this.selectedTargets);
  }

  /**
   * Delete target
   *
   * @param target
   */
  deleteTarget(target): void {
    const targetIndex = this.targets.indexOf(target);
    this.targets.splice(targetIndex, 1);
    this.onTargetsChanged.next(this.targets);
  }

  /**
   * Delete selected targets
   */
  deleteSelectedTargets(): void {
    for (const targetId of this.selectedTargets) {
      const target = this.targets.find(_target => {
        return _target.id === targetId;
      });
      const targetIndex = this.targets.indexOf(target);
      this.targets.splice(targetIndex, 1);
    }
    this.onTargetsChanged.next(this.targets);
    this.deselectTargets();
  }
}
