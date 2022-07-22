'use strict';

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');

const makeForecastArray = require('./weather');
const makeMoviesArray = require('./movies');
const PORT = process.env.PORT;
const weatherAPIKey = process.env.REACT_APP_WEATHERBIT_API_KEY;
const movieAPIKey = process.env.REACT_APP_TMDB_API_KEY;

app.use(cors());


app.get('/', (request, response) => {
  response.send('hello from the home route!');
});

app.get('/weather', (request, response) => {
  let url = `https://api.weatherbit.io/v2.0/forecast/daily?&key=${weatherAPIKey}&lat=${parseInt(request.query.lat)}&lon=${parseInt(request.query.lon)}`;
  axios.get(url)
    .then(res => {
      let forecastArr = makeForecastArray(res.data.data);
      response.send(forecastArr);
    })
    .catch((e) => {
      console.log(e);
      response.status(500).send(e);
    });
});

app.get('/movies', (request, response) => {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${movieAPIKey}&query=${request.query.cityName}`;
  axios.get(url)
    .then(res => {
      let moviesArr = makeMoviesArray(res.data.results);
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
