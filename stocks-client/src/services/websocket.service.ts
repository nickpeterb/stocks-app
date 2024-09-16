import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { TwelvePriceUpdate } from '../models/twelve-data.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private wsSubject: WebSocketSubject<any> = webSocket('ws://localhost:5001');
  stockUpdates$: Observable<TwelvePriceUpdate> = this.wsSubject.asObservable();

  constructor() {}

  subscribeToStock(symbol: string): void {
    console.log('subscribeToStock', symbol);
    this.wsSubject.next({ action: 'subscribe', symbol: symbol });
  }

  unsubscribeFromStock(symbol: string): void {
    this.wsSubject.next({ action: 'unsubscribe', symbol: symbol });
  }

  closeConnection(): void {
    this.wsSubject.complete();
  }
}
