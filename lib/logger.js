var setName = require('./setName');

module.exports = function (originalValidator) {
  var newvalidator = function (o, callback, path) {
    path = path || '';
    var result = originalValidator(o);
    if (!result && callback) {
      callback({
        path: path,
        name: originalValidator.name,
        value: o
      });
    }
    return result;
  };
  return setName(newvalidator, originalValidator.name);
};
