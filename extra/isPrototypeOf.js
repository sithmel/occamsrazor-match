var setName = require('../lib/setName');
var logger = require('../lib/logger');

module.exports = function isPrototypeOf(proto) {
  var func = function (obj) { return proto.isPrototypeOf(obj); };
  setName(func, 'isPrototypeOf:' + proto.constructor.name);
  return logger(func);
};
