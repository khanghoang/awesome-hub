var crawlerjs = require('crawler-js');
const _ = require('lodash');
const atob = require('atob');
const getMovie = require('./getMovie');
const getList = require('./getList');
const getMenu = require('./getMenu');

GLOBAL.window = {
  atob: atob
};

var express = require('express');
var app = express();

app.get('/getMovie', function (req, res) {
  const remote = req.query.url;
  getMovie(remote)
  .then(data => {
    res.status(200).json({movie: data});
  })
  .catch(err => {
    res.status(500).json({error: err})
  })
});

app.get('/getList', function (req, res) {
  getList()
  .then(data => {
    res.status(200).json({movies: data});
  })
  .catch(err => {
    res.status(500).json({error: err})
  })
});

app.get('/getMenu', function (req, res) {
  getMenu()
  .then(data => {
    res.status(200).json({menu: data});
  })
  .catch(err => {
    res.status(500).json({error: err})
  })
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Example app listening on port 3000!');
});
