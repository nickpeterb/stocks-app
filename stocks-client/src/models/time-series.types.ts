export interface TimeSeriesPoint {
  date: number;
  value: number;
}

export type TimeSeriesInterval = 'minute' | 'day' | 'week' | 'month';
