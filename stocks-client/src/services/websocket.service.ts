import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { TwelvePriceUpdate } from '../models/twelve-data.types';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private wsSubject: WebSocketSubject<any> = webSocket('ws://localhost:5001'); // Replace with your WebSocket server URL
  stockUpdates$: Observable<TwelvePriceUpdate> = this.wsSubject.asObservable();

  constructor() {}

  subscribeToStock(symbol: string): void {
    this.wsSubject.next({ action: 'subscribe', symbol: symbol });
  }

  closeConnection(): void {
    this.wsSubject.complete();
  }
}
