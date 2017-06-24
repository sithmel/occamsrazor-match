var match = require('../lib/match');
var setName = require('../lib/setName');
var logger = require('../lib/logger');

function getIsArray() {
  return logger(function isArray(o) {
    return Array.isArray(o);
  });
}

module.exports = function arrayOf(args, some) {
  var prefixName = some ? 'some' : 'every';
  var val = match(args);

  var func = function (arr, callback, path) {
    var result = !some;
    path = path || '';
    if (!getIsArray()(arr, callback, path)) return false;
    for (var i = 0; i < arr.length; i++) {
      result = val(arr[i], callback, path + '[' + i + ']');
      if (some) {
        if (result) {
          return true; // if true no needs to go on
        }
      } else {
        if (!result) {
          if (!callback) {
            return false;
          }
          result = false; // extra check only if callback
        }
      }
    }
    return result;
  };
  return setName(func, prefixName + '(' + val.name + ')');
};
