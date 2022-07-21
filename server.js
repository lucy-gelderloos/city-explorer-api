'use strict';

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
// const PORT = 3000;
const PORT = process.env.PORT;


app.use(cors());

class Forecast {
  constructor(date, condition, high, low) {
    this.date = date;
    this.condition = condition;
    this.high = high;
    this.low = low;
    this.weatherAPIKey = process.env.REACT_APP_WEATHERBIT_API_KEY;
    this.movieAPIKey = process.env.REACT_APP_TMDB_API_KEY;
  }
}

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

class Movie {
  constructor(title, overview, releaseDate, popularity) {
    this.title = title;
    this.overview = overview;
    this.releaseDate = releaseDate;
    this.popularity = popularity;
  }
}

function makeMoviesArray(city) {
  const moviesArr = city.map(el => {
    let title = el.title;
    let overview = el.overview;
    let releaseDate = el.release_date;
    let popularity = el.popularity;
    return new Movie(title, overview, releaseDate, popularity);
  });
  return moviesArr;
}


app.get('/', (request, response) => {
  response.send('hello from the home route!');
});

app.get('/weather', (request, response) => {

  let url = `https://api.weatherbit.io/v2.0/forecast/daily?&key=048b4716799246529c392254d49ff3dc&lat=${request.query.lat}&lon=${request.query.lon}`;

  axios.get(url)
    .then(res => {
      // console.log('res.data.data', res.data.data);
      let forecastArr = makeForecastArray(res.data.data);
      response.send(forecastArr);
    })
    .catch((e) => {
      console.log(e);
      response.status(500).send(e);
    });
});

app.get('/movies', (request, response) => {

  let url = `https://api.themoviedb.org/3/search/movie?api_key=5fc45765a1e23e490961b517caaaf372&query=${request.query.cityName}`;
  console.log('movie url',url);

  axios.get(url)
    .then(res => {
      console.log('res.data', res.data);
      let moviesArr = makeMoviesArray(res.data.results);
      // let forecastArr = makeForecastArray(res.data.data);
      response.send(moviesArr);
    })
    .catch((e) => {
      console.log(e);
      response.status(500).send(e);
    });
});

app.use('*', (error, request, response, next) => {
  response.send(500).send(error);
});

// opens up the server for requests
app.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
