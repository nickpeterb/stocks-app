import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  readonly KEY = 'dashboardTickers';

  savedTickers$ = new BehaviorSubject(this.getSavedTickers());

  getSavedTickers(): Set<string> {
    const stored = localStorage.getItem(this.KEY);
    const parsed = JSON.parse(stored ?? '[]');
    return new Set(parsed);
  }

  add(ticker: string): void {
    const tickers = this.getSavedTickers();
    tickers.add(ticker);
    localStorage.setItem(this.KEY, JSON.stringify([...tickers]));
    this.savedTickers$.next(tickers);
  }

  delete(ticker: string): void {
    const tickers = new Set(this.getSavedTickers());
    tickers.delete(ticker);
    localStorage.setItem(this.KEY, JSON.stringify([...tickers]));
    this.savedTickers$.next(tickers);
  }
}
