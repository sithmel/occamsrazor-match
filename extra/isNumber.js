var setName = require('../lib/setName');
var logger = require('../lib/logger');

function isNumber(n) {
  return typeof n === 'number' && !isNaN(n);
}

module.exports = logger(isNumber);
