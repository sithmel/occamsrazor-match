var setName = require('../lib/setName');
var logger = require('../lib/logger');

function isNumber(n) {
  return typeof n === 'number' && !isNaN(n);
}

function lessThan(n) {
  if (!isNumber(n)) {
    return logger(isNumber);
  }
  var newfunc = function (o) {
    return isNumber(o) && o < n;
  };
  return logger(setName(newfunc, 'lessThan(' + n + ')'));
}

module.exports = lessThan;
