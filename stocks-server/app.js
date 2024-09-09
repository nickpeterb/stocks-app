import express from "express";
import cors from "cors";
import { genRandomTSData } from "./randomData.js";

const app = express();
app.use(cors({ origin: ["http://localhost:4200"] }));

const TWELVE_HEADERS = {
  Accept: "application/json",
  Authorization: "apikey " + process.env.TWELVE_API_KEY,
};

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

app.get("/stocks", async (req, res) => {
  // TODO: Maybe run a cron job to save the output of this once a day in a database somwhere
  // so then I can do fast queries without using up a lot of api credits
  const symbol = req.query.ticker;

  // TODO: Remove country filter and add country flag in search results to distinguish them
  const url = "https://api.twelvedata.com/stocks?" + new URLSearchParams({ symbol, country: "United States" });
  const options = {
    method: "GET",
    headers: TWELVE_HEADERS,
  };

  const response = await fetch(url, options);
  const json = await response.json();
  // const result = json.data.map((entry) => ({ ticker: entry.symbol, name: entry.name }));

  res.json(json.data);
});

app.get("/time-series", async (req, res) => {
  // Convert basic intervals into formats Twelve Data recognizes
  const intervals = {
    minute: "1min",
    hour: "1h",
    day: "1day",
    week: "1week",
    month: "month",
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
  const json = await response.json();

  res.json(json);
});

const PORT = 5000;
app.listen(PORT, (error) => {
  if (!error) console.log("Listening on port " + PORT);
  else console.log(error);
});
