'use strict';

require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');

const movieAPIKey = process.env.REACT_APP_TMDB_API_KEY;

app.use(cors());

class Movie {
  constructor(title, overview, releaseDate, popularity) {
    this.title = title;
    this.overview = overview;
    this.releaseDate = releaseDate;
    this.popularity = popularity;
  }
}

const getMovies = (cityName, response) => {
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${movieAPIKey}&query=${cityName}`;
  axios.get(url)
    .then(res => {
      let moviesArr = makeMoviesArray(res.data.results);
      response.send(moviesArr);
    })
    .catch((e) => {
      console.log('movies error',e);
      response.status(500).send(e);
    });
};

const makeMoviesArray = (city) => {
  const moviesArr = city.map(el => {
    let title = el.title;
    let overview = el.overview;
    let releaseDate = el.release_date;
    let popularity = el.popularity;
    return new Movie(title, overview, releaseDate, popularity);
  });
  return moviesArr;
};

module.exports = getMovies;
