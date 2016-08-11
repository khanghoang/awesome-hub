'use stricts';

const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient({
  url: process.env.REDIS_URL || null,
});
client.on('error', function (err) {
  console.log('Error ' + err);
});
module.exports = {
  saveMovieDataWithUrl(url, data) {
    const strData = JSON.stringify(data);
    return client.setAsync(url, strData);
  },

  getMovieWithUrl(url) {
    return client.getAsync(url);
  },
};
