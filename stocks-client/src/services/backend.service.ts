import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TimeSeriesPoint } from '../models/time-series.types';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  readonly API_URL = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getRandomTimeSeries(
    startDate: number,
    endDate: number,
    startPrice: number = Math.random() * (200 - 100) + 100,
    interval: 'day' | 'week' | 'year' = 'day'
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
