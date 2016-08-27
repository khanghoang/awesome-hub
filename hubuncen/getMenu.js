'use strict';
const Promise = require('bluebird');
const crawlerjs = require('crawler-js');
const _ = require('lodash');
const getUrlRemote = require('./getRemoteURL');
const urlRemote = getUrlRemote();

// eslint-disable-next-line immutable/no-mutation
module.exports = function () {
  return new Promise((resolve) => {
    const result = [];
    const crawler = {
      interval: 1000,
      getSample: urlRemote,
      get: urlRemote,
      preview: 0,
      extractors: [
        {
          selector: '.gnavsub',
          callback(err, html) {
            const menuItems = _.map(html.find('li > a'), node => {
              const url = node.attribs.href.toString().slice(1);
              return {
                link: url,
                title: _.get(node, 'children[0].data', 'Undefined'),
              };
            });

            result.push(...menuItems);
          },
          done: () => {
            resolve(result);
          },
        },
      ],
    };
    crawlerjs(crawler, {});
  });
};
