var setName = require('./setName');

module.exports = function (originalValidator) {
  var newvalidator = function (o, callback, path) {
    path = path || '';
    var result = originalValidator(o);
    if (callback) {
      callback({
        path: path,
        name: originalValidator.name,
        result:result,
        value: o
      });
    }
    return result;
  };
  setName(newvalidator, originalValidator.name);
  return newvalidator;
};
