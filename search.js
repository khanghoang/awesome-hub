const getList = require('./getList');

// eslint-disable-next-line immutable/no-mutation
module.exports = function (keyword, page = 1) {
  const key = keyword.trim().replace(/\s+/, ' ');
  return getList(`/search/${key}`, page);
};
