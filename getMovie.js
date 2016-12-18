'use strict';
const Promise = require('bluebird');
const crawlerjs = require('crawler-js');
const _ = require('lodash');
const fetch = require('node-fetch');
const parseJson = require('parse-json');

const getUrlRemote = require('./getRemoteURL');
const urlRemote = getUrlRemote();

const getPlayEpRegex = /var.\PlayEp.\=.\"(.*)";/;
const getVideoIDRegex = /var.\PlayFilm.\=.\"(.*)";/;
const getEpisodesRegex = /sources:(.*)]\,/;

module.exports = function(remoteURL) {
  return fetch(remoteURL)
    .then(res => res.text())
    .then(content => {
      const playEp = content.match(getPlayEpRegex)[1];
      const videoID = content.match(getVideoIDRegex)[1];
      return {
        playEp,
        videoID,
      }
    })
    .then(({ playEp, videoID }) => {
      return fetch(urlRemote, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: 'POST',
        body: `server=${videoID}&id=${playEp}`
      })
    })
    .then(res => res.text())
    .then(body => {
      return body;
    })
    .then(body => {
      const testRE = body.match(getEpisodesRegex);
      const data = "'" + testRE[1].substring(1, testRE[1].length-1) + "]'";
      return data;
    })
    .then(data => eval(data))
    .catch(err => console.log(err))
};
