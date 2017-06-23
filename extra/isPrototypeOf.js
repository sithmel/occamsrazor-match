var setName = require('../lib/setName');
var logger = require('../lib/logger');

module.exports = function isPrototypeOf(proto) {
  var func = function (obj) { return proto.isPrototypeOf(obj); };
  return logger(setName(func, 'isPrototypeOf:' + proto.constructor.name));
};
