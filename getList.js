'use strict';
const Promise = require('bluebird');
const crawlerjs = require('crawler-js');
const _ = require('lodash');

let urlRemote = '';
if (process.env && process.env.ENDPOINT_URL) {
  urlRemote = process.env.ENDPOINT_URL;
} else {
  const config = require('./env');
  urlRemote = config.ENDPOINT_URL;
}

module.exports = function(url) {
  let finalUrl = url ? `${urlRemote}${url}` : urlRemote;
  return new Promise((resolve, reject) => {
    let result = [];
    const crawler = {
      interval: 1000,
      getSample: finalUrl,
      get: finalUrl,
      preview: 0,
      extractors: [
        {
          selector: '.tn-bxitem',
          callback: function(err, html, url, response){
            const movies = _.map(html.find('a'), node => {
              const span = _.find(node.children, el => el.name === 'span');
              const image = _.find(span.children, el => el.name === 'img');
              return {
                link: `${urlRemote}${node.attribs.href}`,
                title: node.attribs.title,
                image: image.attribs.src
              }
            });

            result.push(...movies);
          },
          done: () => {
            resolve(_.unionBy(result, m => m.title));
          }
        }
      ]
    }
    crawlerjs(crawler, {});
  })
}
