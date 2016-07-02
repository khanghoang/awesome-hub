const Promise = require('bluebird');
const crawlerjs = require('crawler-js');
const _ = require('lodash');

let urlRemote = '';
if (process.ENV.ENDPOINT_URL) {
  urlRemote = process.ENV.ENDPOINT_URL;
} esle {
  const config = require('./env');
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
