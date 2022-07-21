'use strict';

require('dotenv').config();
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
  constructor(date, condition) {
    this.date = date;
    this.condition = condition;
  }
}


app.get('/', (request, response) => {
  response.send('hello from the home route!');
});

app.get('/weather', (request, response) => {
  console.log('request.query', request.query);
  let cityName = request.query.cityName.toLowerCase();
  let lat = parseInt(request.query.lat);
  let lon = parseInt(request.query.lon);
  console.log('weather line 34[0].lat', weather[0].lat, 'lat', lat, 'lon', lon);

  let weatherCity = weather.find(el => {
    let weatherLat = Math.round(el.lat);
    let weatherLon = Math.round(el.lon);
    console.log('weatherLon', weatherLon);

    // return cityName === el.city_name.toLowerCase();
    return cityName === el.city_name.toLowerCase()
    && lat === weatherLat
    && lon === weatherLon;
  });
  console.log('weatherCity', weatherCity);
  let forecastArr = makeForecastArray(weatherCity);

  if(cityName) {
    response.send(forecastArr);
    console.log('forecastArr',forecastArr);
  } else {
    response.send('Please enter Seattle, Paris, or Amman');
  }
});

function makeForecastArray(weatherCity) {
  const forecastArr = weatherCity.data.map(el => {
    let date = el.valid_date;
    let condition = el.weather.description;
    return new Forecast(date, condition);
  });
  return forecastArr;
}

app.get('/error', (request, response) => {

  throw new Error('Server not happy!!');

});

// put error handlers down here
app.use('*', (request, response) => {
  console.log('catch all route hit');
  response.status(404).send('Route Not found :(');
});

// opens up the server for requests
app.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
