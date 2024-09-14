import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeSeriesInterval, TimeSeriesPoint } from '../models/time-series.types';
import { TwelveStockInfo, TwelveStockPriceResp } from '../models/twelve-data.types';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  readonly API_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getStockList(tickerFilter: string) {
    const options = {
      params: new HttpParams({
        fromObject: {
          ticker: tickerFilter,
        },
      }),
    };
    return this.http.get<TwelveStockInfo[]>(this.API_URL + '/stocks', options);
  }

  getStockTimeSeries(ticker: string, interval: string) {
    const options = {
      params: new HttpParams({
        fromObject: {
          ticker,
          interval,
        },
      }),
    };
    return this.http.get<TwelveStockPriceResp>(this.API_URL + '/time-series', options);
  }

  getRandomTimeSeries(
    startDate: number,
    endDate: number,
    startPrice: number = Math.random() * (200 - 100) + 100,
    interval: TimeSeriesInterval = 'day'
  ) {
    const options = {
      params: new HttpParams({
        fromObject: {
          startDate,
          endDate,
          startPrice,
          interval,
        },
      }),
    };
    return this.http.get<TimeSeriesPoint[]>(this.API_URL + '/random-time-series', options);
  }
}
