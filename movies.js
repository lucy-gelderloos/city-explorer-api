class Movie {
  constructor(title, overview, releaseDate, popularity) {
    this.title = title;
    this.overview = overview;
    this.releaseDate = releaseDate;
    this.popularity = popularity;
  }
}

const makeMoviesArray = function(city) {
  const moviesArr = city.map(el => {
    let title = el.title;
    let overview = el.overview;
    let releaseDate = el.release_date;
    let popularity = el.popularity;
    return new Movie(title, overview, releaseDate, popularity);
  });
  return moviesArr;
};

module.exports = makeMoviesArray;
