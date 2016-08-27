'use strict';
const Promise = require('bluebird');
const crawlerjs = require('crawler-js');
const _ = require('lodash');
const getUrlRemote = require('../getRemoteURL');

const urlRemote = getUrlRemote('ENDPOINT_UNCEN');

console.log('url =', urlRemote);

// eslint-disable-next-line immutable/no-mutation
const getList = (url, page = 1) => {
	const finalUrl = url ? `${urlRemote}${url}/page-${page}` : urlRemote;
	console.log(finalUrl);
	return new Promise((resolve) => {
		const result = [];
		const crawler = {
			interval: 1000,
			getSample: finalUrl,
			get: finalUrl,
			preview: 0,
			extractors: [
				{
					selector: '.main_loop > li',
					callback(err, html) {
						if (html) {
							const movies = _.map(html.find('a'), node => {
								const image = _.find(node.children, el => el.name === 'img');
								if (image) {
									return {
										link: `${node.attribs.href}`,
										title: node.attribs.title,
										image: image.attribs.src,
									};
								}
								return null;
							});

							result.push(...movies.filter(m => m));
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

getList('recent', 3)
	.then(console.log.bind(console));

module.exports = getList;
