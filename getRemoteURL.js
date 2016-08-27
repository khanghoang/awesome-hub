const getUrlRemote = (name = 'ENDPOINT_URL') => {
  if (process.env && process.env[name]) {
    return process.env[name];
  }

  // eslint-disable-next-line global-require
  const config = require('dotenv').config();
	console.log(config);
  return config[name];
};

// eslint-disable-next-line immutable/no-mutation
module.exports = getUrlRemote;
