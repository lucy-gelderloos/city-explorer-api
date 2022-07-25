'use strict';

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const searchCache = require('./searchCache');

const weatherAPIKey = process.env.REACT_APP_WEATHERBIT_API_KEY;

class Forecast {
  constructor(date, condition, high, low) {
    this.date = date;
    this.condition = condition;
    this.high = high;
    this.low = low;
  }
}
const today = new Date();

const getWeather = (lat, lon, response) => {

  lat = truncateString(lat);
  lon = truncateString(lon);
  let locationID = `${lat}${lon}`;

  if(searchCache[locationID] && searchCache.cacheExpires > today) {
    console.log(`Location ID ${locationID} found in searchCache`);
    let cachedObj = searchCache[locationID];
    response.send(cachedObj.forecastArr);
  }

  else {
    console.log(`location ID ${locationID} not found in searchCache`);
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherAPIKey}&lat=${lat}&lon=${lon}&units=I`;

    axios.get(url)
      .then(weatherGet => {
        let forecastArr = makeForecastArray(weatherGet.data.data);
        searchCache.cacheExpires = setExpiration();
        searchCache.lastCached = today;
        searchCache[locationID] = {forecastArr:forecastArr};
        let cachedObj = searchCache[locationID];
        response.send(cachedObj.forecastArr);
      })
      .catch((e) => {
        console.log('weather error', e);
        response.status(500).send(e);
        let cachedObj = searchCache[locationID];
        response.send(cachedObj.forecastArr);
      });
  }
};


const makeForecastArray = (arr) => {
  console.log('makeForecastArray arr[0]',arr[0]);
  const forecastArr = arr.map(el => {
    let date = el.valid_date;
    let condition = el.weather.description;
    let high = el.high_temp;
    let low = el.low_temp;
    return new Forecast(date, condition, high, low);
  });
  return forecastArr;
};

const setExpiration = () => {
  const expiresDate = new Date(today);
  expiresDate.setDate(expiresDate.getDate() + 1);
  expiresDate.setHours(0,0,0,0);
  return expiresDate;
};

const truncateString = (str) => {
  let stringArr = str.split('');
  let twoDecimalPlaces = (stringArr.indexOf('.') + 3);
  stringArr.splice(twoDecimalPlaces);
  return stringArr.join('');
};

module.exports = getWeather;
