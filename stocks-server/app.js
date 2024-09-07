import express from "express";
import cors from "cors";
import { genRandomTSData } from "./randomData.js";

const app = express();
const PORT = 5000;

app.use(cors({ origin: ["http://localhost:4200"] }));

app.get("/", (req, res) => {
  res.send("Success");
});

app.get("/random-time-series", (req, res) => {
  const startDate = parseInt(req.query.startDate);
  const endDate = parseInt(req.query.endDate);
  if (startDate >= endDate) {
    res.status(400).send("Start date should be after end date.");
    return;
  }
  const startPrice = parseInt(req.query.startPrice);
  const interval = req.query.interval;
  const result = genRandomTSData(startDate, endDate, startPrice, interval);
  res.json(result);
});

app.listen(PORT, (error) => {
  if (!error) console.log("Listening on port " + PORT);
  else console.log(error);
});
