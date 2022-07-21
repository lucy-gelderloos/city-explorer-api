'use strict';

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
// const PORT = 3000;
const PORT = process.env.PORT;
const weather = require('./data/weather.json');
const { query } = require('express');
const e = require('express');


app.use(cors());

class Forecast {
//   static weather = require('./data/weather.json');
  constructor(date, condition, high, low) {
    this.date = date;
    this.condition = condition;
    this.high = high;
    this.low = low;
    this.weatherAPIKey = process.env.REACT_APP_WEATHERBIT_API_KEY;
  }
}


app.get('/', (request, response) => {
  response.send('hello from the home route!');
});

app.get('/weather', (request, response) => {
  console.log('request.query', request.query);

  // let weatherAPIQuery = request.query.weatherAPIQuery;

  let url = `https://api.weatherbit.io/v2.0/forecast/daily?&key=048b4716799246529c392254d49ff3dc&lat=${request.query.lat}&lon=${request.query.lon}`;

  axios.get(url)
    .then(res => {
      console.log('res.data.data', res.data.data);
      let forecastArr = makeForecastArray(res.data.data);
      response.send(forecastArr);
    })
    .catch((e) => {
      console.log(e);
      response.status(500).send(e);
    });
});

function makeForecastArray(weatherCity) {
  const forecastArr = weatherCity.map(el => {
    let date = el.valid_date;
    let condition = el.weather.description;
    let high = el.high_temp;
    let low = el.low_temp;
    return new Forecast(date, condition, high, low);
  });
  return forecastArr;
}

app.use('*', (error, request, response, next) => {
  response.send(500).send(error);
});

// opens up the server for requests
app.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
