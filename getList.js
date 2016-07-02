var Promise = require('bluebird');
var crawlerjs = require('crawler-js');
var _ = require('lodash');

var urlRemote = '';
if (process.ENV && process.ENV.ENDPOINT_URL) {
  urlRemote = process.ENV.ENDPOINT_URL;
} else {
  var config = require('./env');
  urlRemote = config.ENDPOINT_URL;
}

module.exports = function() {
  return new Promise((resolve, reject) => {
    const crawler = {
      interval: 1000,
      getSample: urlRemote,
      get: urlRemote,
      preview: 0,
      extractors: [
        {
          selector: '.tn-boxsty',
          callback: function(err, html, url, response){
            const movies = _.map(html.find('.tn-bxitem > a'), node => {
              return {
                link: `${urlRemote}${node.attribs.href}`,
                title: node.attribs.title
              }
            });
            resolve(movies);
          }
        }
      ]
    }
    crawlerjs(crawler, {});
  })
}
