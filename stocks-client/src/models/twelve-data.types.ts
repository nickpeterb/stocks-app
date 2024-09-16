export interface TwelveSearchResult {
  symbol: string;
  instrument_name: string;
  exchange: string;
  mic_code: string;
  exchange_timezone: string;
  instrument_type: string;
  country: string;
  currency: string;
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

export interface TwelvePriceUpdate {
  event: string;
  symbol: string;
  currency_base: string;
  currency_quote: string;
  exchange: string;
  type: string;
  timestamp: number;
  price: number;
  bid: number;
  ask: number;
  day_volume: number;
}
