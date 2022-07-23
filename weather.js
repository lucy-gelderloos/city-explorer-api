'use strict';

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');

const weatherAPIKey = process.env.REACT_APP_WEATHERBIT_API_KEY;

app.use(cors());

const getWeather = (lat, lon, response) => {
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherAPIKey}&lat=${lat}&lon=${lon}`;
  axios.get(url)
    .then(weatherGet => {
      let forecastArr = makeForecastArray(weatherGet.data.data);
      response.send(forecastArr);
    })
    .catch((e) => {
      console.log('weather error', e);
      response.status(500).send(e);
    });
};

class Forecast {
  constructor(date, condition, high, low) {
    this.date = date;
    this.condition = condition;
    this.high = high;
    this.low = low;
  }
}

const makeForecastArray = function(arr) {
  const forecastArr = arr.map(el => {
    let date = el.valid_date;
    let condition = el.weather.description;
    let high = el.high_temp;
    let low = el.low_temp;
    return new Forecast(date, condition, high, low);
  });
  return forecastArr;
};

module.exports = getWeather;
