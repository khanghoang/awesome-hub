const atob = require('atob');
const getMovie = require('./getMovie');
const getList = require('./getList');
const getMenu = require('./getMenu');
const redisStorage = require('./redis');
const search = require('./search');

// eslint-disable-next-line immutable/no-mutation
GLOBAL.window = {
  atob,
};

const express = require('express');
const app = express();

app.get('/getMovie', (req, res) => {
  const remote = req.query.url;
  getMovie(remote)
    .then(data => (
      redisStorage.saveMovieDataWithUrl(remote, data).then(() => data)
    ))
    .then(data => {
      res.status(200).json({ movie: data });
    });
});

app.get('/getList', (req, res) => {
  const url = req.query.url;
  const page = req.query.page || 1;
  getList(url, page)
  .then(data => {
    res.status(200).json({ movies: data });
  })
  .catch(err => {
    res.status(500).json({ error: err });
  });
});

app.get('/getMenu', (req, res) => {
  getMenu()
  .then(data => {
    res.status(200).json({ menu: data });
  })
  .catch(err => {
    res.status(500).json({ error: err });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Example app listening on port 3000!');
});

app.get('/search', (req, res) => {
  const keyword = req.query.q;
  const page = req.query.page || 1;
  if (!keyword) {
    res.status(401).json({ errorMessage: 'No keyword found' });
    return;
  }

  search(keyword, page)
  .then(data => {
    res.status(200).json({ movies: data });
  })
  .catch(err => {
    res.status(500).json({ error: err });
  });
});
