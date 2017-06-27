var setName = require('../lib/setName');
var logger = require('../lib/logger');

function isString(s) {
  return typeof s === 'string';
}

module.exports = logger(isString);
