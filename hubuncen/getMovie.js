'use strict';
const Promise = require('bluebird');
const crawlerjs = require('crawler-js');
const _ = require('lodash');
const request = require('superagent');

const link = '';
const regex = /sources:([\s\S]*)\],/;

request.get(link)
	.end((err, res) => {
		const testRE = res.text.match(regex);
		const data = eval(testRE[1] + ']');
		console.log(data);
		request.get(data[0].file)
			.end((err, res) => {
				console.log(res.redirects[0]);
			});
	});
