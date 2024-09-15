export interface TwelveStockInfo {
  country: string;
  currency: string;
  exchange: string;
  figi_code: string;
  mic_code: string;
  name: string;
  symbol: string;
  type: string;
}

export interface StockPriceMeta {
  symbol: string;
  interval: string;
  currency: string;
  exchange_timezone: string;
  exchange: string;
  mic_code: string;
  type: string;
}

export interface StockPriceValues {
  datetime: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TwelveStockPriceResp {
  meta: StockPriceMeta;
  values: StockPriceValues[];
}
