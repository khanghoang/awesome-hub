'use strict';
const Promise = require('bluebird');
const crawlerjs = require('crawler-js');
const _ = require('lodash');
const getUrlRemote = require('./getRemoteURL');

const urlRemote = getUrlRemote();

// eslint-disable-next-line immutable/no-mutation
module.exports = function (url, page = 1) {
  const finalUrl = url ? `${urlRemote}${url}/page-${page}/` : urlRemote;
  return new Promise((resolve) => {
    const result = [];
    const crawler = {
      interval: 1000,
      getSample: finalUrl,
      get: finalUrl,
      preview: 0,
      extractors: [
        {
          selector: '.tn-bxitem',
          callback(err, html) {
            if (html) {
              const movies = _.map(html.find('a'), node => {
                const span = _.find(node.children, el => el.name === 'span');
                const image = _.find(span.children, el => el.name === 'img');
                return {
                  link: `${urlRemote}${node.attribs.href}`,
                  title: node.attribs.title,
                  image: image.attribs.src,
                };
              });

              result.push(...movies);
            }
          },
          done: () => {
            resolve(_.unionBy(result, m => m.title));
          },
        },
      ],
    };
    crawlerjs(crawler, {});
  });
};
