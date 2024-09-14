export interface TimeSeriesPoint {
  date: number;
  value: number;
}

export type TimeSeriesInterval = 'minute' | 'hour' | 'day' | 'week' | 'month';
