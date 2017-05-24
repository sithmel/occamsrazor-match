var setName = require('../lib/setName');

module.exports = function isPrototypeOf(proto) {
  var func = function (obj) { return proto.isPrototypeOf(obj); };
  setName(func, 'isPrototypeOf:' + proto.constructor.name);
  return func;
};
