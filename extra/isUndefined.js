var logger = require('../lib/logger');

function isUndefined(o) {
  return typeof o === 'undefined';
}

module.exports = logger(isUndefined);
