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

module.exports = function() {
  return new Promise((resolve, reject) => {
    let result = [];
    const crawler = {
      interval: 1000,
      getSample: urlRemote,
      get: urlRemote,
      preview: 0,
      extractors: [
        {
          selector: '.gnavsub',
          callback: function(err, html, url, response){
            const menuItems = _.map(html.find('li > a'), node => {
            const url = node.attribs.href.toString().slice(1);
              return {
                link: url,
                title: _.get(node, 'children[0].data', 'Undefined')
              }
            });

            result.push(...menuItems);
          },
          done: () => {
            resolve(result);
          }
        }
      ]
    }
    crawlerjs(crawler, {});
  })
}
