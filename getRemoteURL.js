const getUrlRemote = () => {
  if (process.env && process.env.ENDPOINT_URL) {
    return process.env.ENDPOINT_URL;
  }

  // eslint-disable-next-line global-require
  const config = require('./env');
  return config.ENDPOINT_URL;
};

// eslint-disable-next-line immutable/no-mutation
module.exports = getUrlRemote;
