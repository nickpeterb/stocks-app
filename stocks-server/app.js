import express from "express";
import cors from "cors";
import { genRandomTSData } from "./randomData.js";
import { DateTime } from "luxon";
import { startWebSocketConnection } from "./webSockets.js";

const app = express();
app.use(cors({ origin: ["http://localhost:4200"] }));

const TWELVE_HEADERS = {
  Accept: "application/json",
  Authorization: "apikey " + process.env.TWELVE_API_KEY,
};

/* --- API ROUTES --- */

app.get("/random-time-series", (req, res) => {
  const startDate = parseInt(req.query.startDate);
  const endDate = parseInt(req.query.endDate);
  if (startDate >= endDate) {
    res.status(400).send("Start date should be after end date");
    return;
  }
  const startPrice = parseInt(req.query.startPrice);
  const interval = req.query.interval;
  const result = genRandomTSData(startDate, endDate, startPrice, interval);
  res.json(result);
});

app.get("/search", async (req, res) => {
  const symbol = req.query.ticker;

  // TODO: Remove country filter and add country flag in search results to distinguish them
  const url = "https://api.twelvedata.com/symbol_search?" + new URLSearchParams({ symbol });
  const options = {
    method: "GET",
    headers: TWELVE_HEADERS,
  };

  const response = await fetch(url, options);
  const json = await response.json();

  const filtered = json.data.filter((result) => result.country === "United States" || result.country === "");

  res.json(filtered);
});

app.get("/time-series", async (req, res) => {
  // Convert basic intervals into formats Twelve Data recognizes
  const intervals = {
    minute: "1min",
    hour: "1h",
    day: "1day",
    week: "1week",
    month: "1month",
  };
  if (!(req.query.interval in intervals)) res.status(400).send("Invalid interval");

  const interval = intervals[req.query.interval];
  const symbol = req.query.ticker;

  const url = "https://api.twelvedata.com/time_series?" + new URLSearchParams({ interval, symbol });
  const options = {
    method: "GET",
    headers: TWELVE_HEADERS,
  };

  const response = await fetch(url, options);
  if (response.status === 429) {
    res.status(429).send("You've reached your API request limits");
    return;
  }
  const result = await response.json();

  if (!result.values) {
    res.status(500).send("Internal error: No data");
    return;
  }

  // Map values to numbers
  result.values = result.values.map((value) => ({
    datetime: DateTime.fromSQL(value.datetime).toMillis(),
    open: parseFloat(value.open),
    close: parseFloat(value.close),
    high: parseFloat(value.high),
    low: parseFloat(value.low),
    volume: parseFloat(value.volume),
  }));

  res.json(result);
});

/* --- REGISTER LISTENER --- */

const PORT = 5000;
app.listen(PORT, (error) => {
  if (!error) console.log("API server running on http://localhost:" + PORT);
  else console.log(error);
});

/* --- WEBSOCKET --- */

const wsPORT = 5001;
startWebSocketConnection(wsPORT);
