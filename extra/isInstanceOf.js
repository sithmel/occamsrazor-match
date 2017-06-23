var setName = require('../lib/setName');
var logger = require('../lib/logger');

module.exports = function isInstanceOf(constructor) {
  var func = function (obj) { return obj instanceof constructor; };
  return logger(setName(func, 'isInstanceOf:' + constructor.name));
};
