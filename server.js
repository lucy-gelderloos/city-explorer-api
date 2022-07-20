const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT;
const weather = require('../data/weather.json');
const { query } = require('express');

app.use(cors());

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.condition = condition;
  }
}

app.get('/weather', (request, response) => {

  const cityName = request.query.city;

  const weatherCity = weather.find(el => cityName === el.city_name);

  const forecastResult = cityName.data.map(el => {
    let date = el.valid_date;
    let condition = el.weather.description;
    return new Forecast(date,condition);
  });
});

app.get('/error', (request, response) => {

  throw new Error('Server not happy!!');

});

// put error handlers down here
app.use('*', (request, response) => {
  console.log('catch all route hit');
  response.status(404).send('Route Not found :(');
});

// opens up the server for requests
app.listen(port, () => {
  console.log('Server is running on port :: ' + port);
});
