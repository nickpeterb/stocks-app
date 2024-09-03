const express = require('express');
const { DateTime } = require('luxon');

const app = express();
const PORT = 5000;

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function genRandomData(start, end, granularity) {
  const result = [];
  let curr = start;
  while (curr < end) {
    const value = Math.round(getRandomNumber(-100, 100) * 100) / 100;
    result.push({ date: curr, value });
    curr = DateTime.fromMillis(curr)
      .plus({ [granularity]: 1 })
      .toMillis();
  }
  return result;
}

app.get('/', (req, res) => {
  res.send('Success');
});

app.get('/time-series', (req, res) => {
  const startDate = parseInt(req.query.startDate);
  const endDate = parseInt(req.query.endDate);
  const granularity = req.query.granularity;
  const result = genRandomData(startDate, endDate, granularity);
  res.json(result);
});

app.listen(PORT, (error) => {
  if (!error) console.log('Listening on port ' + PORT);
  else console.log(error);
});
