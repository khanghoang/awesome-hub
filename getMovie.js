const Promise = require('bluebird');
const crawlerjs = require('crawler-js');
const _ = require('lodash');

module.exports = function(remoteURL) {
  return new Promise((resolve, reject) => {
    const crawler = {
      interval: 1000,
      getSample: remoteURL,
      get: remoteURL,
      preview: 0,
      extractors: [
        {
          selector: '#viewplayer',
          callback: function(err, html, url, response){
            const regex = /sources:(.*)]\,/;
            var testRE = response.body.match(regex);
            resolve(eval(testRE[1] + ']'));
          }
        }
      ]
    }
    crawlerjs(crawler, {});
  })
}
