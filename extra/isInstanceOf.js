var setName = require('../lib/setName');

module.exports = function isInstanceOf(constructor) {
  var func = function (obj) { return obj instanceof constructor; };
  setName(func, 'isInstanceOf:' + constructor.name);
  return func;
};
