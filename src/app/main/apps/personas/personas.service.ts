import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Persona } from 'app/main/apps/personas/persona.model';
import { FuseProgressBarService } from '@fuse/components/progress-bar/progress-bar.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonasService implements Resolve<any> {
  onPersonasChanged: BehaviorSubject<any>;
  onSelectedPersonasChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;
  baseURL = environment.baseUrl;
  personas: Persona[];
  user: any;
  selectedPersonas: string[] = [];

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
    this.onPersonasChanged = new BehaviorSubject([]);
    this.onSelectedPersonasChanged = new BehaviorSubject([]);
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
      Promise.all([this.getPersonas()]).then(([files]) => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getPersonas();
        });

        this.onFilterChanged.subscribe(filter => {
          this.filterBy = filter;
          this.getPersonas();
        });

        resolve();
      }, reject);
    });
  }

  /**
   * Get personas
   *
   * @returns {Promise<any>}
   */
  getPersonas(): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/personas')
        .subscribe((response: any) => {
          this.personas = response;

          if (this.searchText && this.searchText !== '') {
            this.personas = FuseUtils.filterArrayByString(
              this.personas,
              this.searchText
            );
          }

          this.personas = this.personas.map(persona => {
            return new Persona(persona);
          });
          this.onPersonasChanged.next(this.personas);
          this.hideLoader();
          resolve(this.personas);
        }, reject);
    });
  }

  /**
   * Toggle selected persona by id
   *
   * @param id
   */
  toggleSelectedPersona(id): void {
    // First, check if we already have that persona as selected...
    if (this.selectedPersonas.length > 0) {
      const index = this.selectedPersonas.indexOf(id);

      if (index !== -1) {
        this.selectedPersonas.splice(index, 1);

        // Trigger the next event
        this.onSelectedPersonasChanged.next(this.selectedPersonas);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedPersonas.push(id);

    // Trigger the next event
    this.onSelectedPersonasChanged.next(this.selectedPersonas);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedPersonas.length > 0) {
      this.deselectPersonas();
    } else {
      this.selectPersonas();
    }
  }

  /**
   * Select personas
   *
   * @param filterParameter
   * @param filterValue
   */
  selectPersonas(filterParameter?, filterValue?): void {
    this.selectedPersonas = [];

    // If there is no filter, select all personas
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedPersonas = [];
      this.personas.map(persona => {
        this.selectedPersonas.push(persona.uuid);
      });
    }

    // Trigger the next event
    this.onSelectedPersonasChanged.next(this.selectedPersonas);
  }

  /**
   * Update persona
   *
   * @param persona
   * @returns {Promise<any>}
   */
  updatePersona(persona): Promise<any> {
    this.showLoader();
    return new Promise((resolve, reject) => {
      if (persona.uuid && persona.uuid !== '') {
        this._httpClient
          .put(this.baseURL + '/personas/' + persona.uuid, { ...persona })
          .subscribe(response => {
            this.getPersonas()
              .then(res => {
                resolve(response);
              })
              .finally(() => {
                resolve(response);
                this.hideLoader();
              });
          });
      } else {
        this._httpClient
          .post(this.baseURL + '/personas', { ...persona })
          .subscribe(response => {
            this.getPersonas()
              .then(res => {})
              .finally(() => {
                this.hideLoader();
                resolve(response);
              });
          });
      }
    });
  }

  /**
   * Deselect personas
   */
  deselectPersonas(): void {
    this.selectedPersonas = [];

    // Trigger the next event
    this.onSelectedPersonasChanged.next(this.selectedPersonas);
  }

  /**
   * Delete persona
   *
   * @param persona
   */
  deletePersona(persona): void {
    this.showLoader();
    this._httpClient
      .delete(this.baseURL + '/personas/' + persona.uuid, {})
      .subscribe(response => {
        const personaIndex = this.personas.indexOf(persona);
        this.personas.splice(personaIndex, 1);
        this.onPersonasChanged.next(this.personas);
        this.hideLoader();
      });
  }

  /**
   * Delete selected personas
   */
  deleteSelectedPersonas(): void {
    for (const personaId of this.selectedPersonas) {
      const persona = this.personas.find(_persona => {
        return _persona.uuid === personaId;
      });
      const personaIndex = this.personas.indexOf(persona);
      this.personas.splice(personaIndex, 1);
    }
    this.onPersonasChanged.next(this.personas);
    this.deselectPersonas();
  }

  private showLoader(): void {
    this.loaderService.show();
  }

  private hideLoader(): void {
    this.loaderService.hide();
  }
}
