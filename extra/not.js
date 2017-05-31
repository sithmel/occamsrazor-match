var match = require('../lib/match');
var setName = require('../lib/setName');

module.exports = function not(arg) {
  var func = match(arg);
  var newfunc = function (o, callback, path) {
    return !func(o, callback, path);
  };
  setName(newfunc, 'not(' + func.name + ')');
  return newfunc;
};
