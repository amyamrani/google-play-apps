const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const googleApps = require('./playstore-data.js');

app.get('/apps', (req, res) => {
  const{ sort, genres = ''} = req.query;

  if (sort) {
    if(!['Rating', 'App'].includes(sort)) {
      return res 
        .status(400)
        .send('Sort must be one of Rating or App');
    }
  }

  if (genres) {
    if(!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres.toLowerCase())) {
      return res 
        .status(400)
        .send('Genres must be one of Action, Puzzle, Strategy, Casual, Arcade, Card');
    }
  }

  let results = googleApps
    .filter(googleApp => googleApp
      .Genres
      .toLowerCase()
      .includes(genres.toLowerCase()));


  if (sort) {
    results
      .sort((a, b) => {
        return a[sort].toLowerCase() > b[sort].toLowerCase() ? 1 : a[sort].toLowerCase() < b[sort].toLowerCase() ? -1 : 0;
    });
  }

  res
    .json(results)
});

app.listen(8000, () => {
  console.log('Server started on PORT 8000');
});