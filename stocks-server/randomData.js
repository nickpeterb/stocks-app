import { DateTime } from "luxon";
import * as stoch from "stochastic";

export function genRandomTSData(startDate, endDate, startPrice, interval) {
  const mu = 0.1;
  const sigma = 0.1;
  const T = 1;

  const start = DateTime.fromMillis(startDate);
  const end = DateTime.fromMillis(endDate);
  const steps = end.diff(start, interval).as(interval);

  const geometricBrownianMotion = stoch.GBM(startPrice, mu, sigma, T, steps - 1);

  return geometricBrownianMotion.map((value, i) => {
    return { date: start.plus({ day: i }).toMillis(), value: Math.round(value * 100) / 100 };
  });
}
