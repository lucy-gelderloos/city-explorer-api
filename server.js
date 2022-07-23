'use strict';

require('dotenv').config();
// const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());

const getWeather = require('./weather');
const getMovies = require('./movies');
const PORT = process.env.PORT;

app.get('/', (request, response) => {
  response.send('hello from the home route!');
});

app.get('/weather', (request, response) => {
  getWeather(request.query.lat, request.query.lon, response);
});

app.get('/movies', (request, response) => {
  getMovies(request.query.cityName, response);
});

app.use('*', (error, request, response, next) => {
  response.send(500).send(error);
});

// opens up the server for requests
app.listen(PORT, () => {
  console.log('Server is running on port :: ' + PORT);
});
