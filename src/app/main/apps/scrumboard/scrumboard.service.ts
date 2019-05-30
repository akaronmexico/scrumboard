import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
// import { Socket } from 'ngx-socket-io';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScrumboardService implements Resolve<any> {
  boards: any[];
  routeParams: any;
  board: any;
  article: any;
  baseURL = environment.baseUrl;
  onBoardsChanged: BehaviorSubject<any>;
  onBoardChanged: BehaviorSubject<any>;
  onArticleChanged: BehaviorSubject<any>;
  // currentEvent = this.socket.fromEvent<any>('article');
  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onBoardsChanged = new BehaviorSubject([]);
    this.onBoardChanged = new BehaviorSubject([]);
    this.onArticleChanged = new BehaviorSubject([]);
    // this.currentEvent.subscribe(
    //   event => {}
    // got socket event
    // );
  }

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
    this.routeParams = route.params;

    return new Promise((resolve, reject) => {
      Promise.all([this.getBoards()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get boards
   *
   * @returns {Promise<any>}
   */
  getBoards(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/partnerboards').subscribe(
        (response: any) => {
          this.boards = response;
          this.onBoardsChanged.next(this.boards);
          resolve(this.boards);
        },
        err => {
          console.log('caught err:' + err);
          reject(err);
        }
      );
    });
  } /** 
  getBoard(boardUri): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/alldata')
        .subscribe((response: any) => {
          this.board = response;
          // this.socket.emit('subscribe', boardUri);
          this.onBoardChanged.next(this.board);
          resolve(this.board);
        }, reject);
    });
  }
  */

  getArticle(articleId: string): Promise<any> {
    /** return new Promise((resolve, reject) => {
      this._httpClient.get(this.baseURL + '/articles/' + articleId).subscribe(
        (response: any) => {
          this.article = response;
          this.onArticleChanged.next(this.article);
          resolve(this.article);
        },
        err => {
          console.log('caught err getting article:' + err);
          reject(err);
        }
      );
    });*/
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/articles-article').subscribe(
        (response: any) => {
          this.article = response;
          this.onArticleChanged.next(this.article);
          resolve(this.article);
        },
        err => {
          console.log('caught err getting article:' + err);
          reject(err);
        }
      );
    });
  }

  /**
   * Get board
   *
   * @param boardUri
   * @returns {Promise<any>}
   **/
  getBoard(boardUri): Promise<any> {
    return new Promise((resolve, reject) => {
      let url = this.baseURL;
      if (boardUri === 'all') {
        url += '/allbypartner';
      } else {
        url += '/partnerdata/' + boardUri;
      }
      this._httpClient.get(url).subscribe((response: any) => {
        this.board = response;
        // this.socket.emit('subscribe', boardUri);
        this.onBoardChanged.next(this.board);
        resolve(this.board);
      }, reject);
    });
  }

  /**
   * Add card
   *
   * @param listId
   * @param newCard
   * @returns {Promise<any>}
   */
  addCard(listId, newCard): Promise<any> {
    this.board.lists.map(list => {
      if (list.id === listId) {
        return list.idCards.push(newCard.id);
      }
    });

    this.board.cards.push(newCard);

    return this.updateBoard();
  }

  updateCardStatus(card: any, status: string): Promise<any> {
    return new Promise((resolve, reject) => {
      card.status = status;
      this._httpClient
        .put(this.baseURL + '/partnerdata/' + card.id, card)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  sendList(boardUri: string, listId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get(this.baseURL + '/output/' + boardUri)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  /**
   * Add list
   *
   * @param newList
   * @returns {Promise<any>}
   */
  addList(newList): Promise<any> {
    this.board.lists.push(newList);

    return this.updateBoard();
  }

  /**
   * Remove list
   *
   * @param listId
   * @returns {Promise<any>}
   */
  removeList(listId): Promise<any> {
    const list = this.board.lists.find(_list => {
      return _list.id === listId;
    });

    for (const cardId of list.idCards) {
      this.removeCard(cardId);
    }

    const index = this.board.lists.indexOf(list);

    this.board.lists.splice(index, 1);

    return this.updateBoard();
  }

  /**
   * Remove card
   *
   * @param cardId
   * @param listId
   */
  removeCard(cardId, listId?): void {
    const card = this.board.cards.find(_card => {
      return _card.id === cardId;
    });

    if (listId) {
      const list = this.board.lists.find(_list => {
        return listId === _list.id;
      });
      list.idCards.splice(list.idCards.indexOf(cardId), 1);
    }

    this.board.cards.splice(this.board.cards.indexOf(card), 1);

    this.updateBoard();
  }

  /**
   * Update board
   *
   * @returns {Promise<any>}
   */
  updateBoard(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post('api/scrumboard-boards/' + this.board.id, this.board)
        .subscribe(response => {
          this.onBoardChanged.next(this.board);
          resolve(this.board);
        }, reject);
    });
  }

  /**
   * Update card
   *
   * @param newCard
   */
  updateCard(newCard): void {
    this.board.cards.map(_card => {
      if (_card.id === newCard.id) {
        return newCard;
      }
    });

    this.updateBoard();
  }

  /**
   * Create new board
   *
   * @param board
   * @returns {Promise<any>}
   */
  createNewBoard(board): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post('api/scrumboard-boards/' + board.id, board)
        .subscribe(response => {
          resolve(board);
        }, reject);
    });
  }
}

@Injectable()
export class BoardResolve implements Resolve<any> {
  /**
   * Constructor
   *
   * @param {ScrumboardService} _scrumboardService
   */
  constructor(private _scrumboardService: ScrumboardService) {}

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @returns {Promise<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this._scrumboardService.getBoard(route.paramMap.get('boardId'));
  }
}

@Injectable()
export class ArticleResolve implements Resolve<any> {
  /**
   * Constructor
   *
   * @param {ScrumboardService} _scrumboardService
   */
  constructor(private _scrumboardService: ScrumboardService) {}

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @returns {Promise<any>}
   */
  resolve(route: ActivatedRouteSnapshot): Promise<any> {
    return this._scrumboardService.getArticle(route.paramMap.get('articleId'));
  }
}
