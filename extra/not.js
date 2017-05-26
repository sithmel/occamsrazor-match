var match = require('../lib/match');
var setName = require('../lib/setName');

module.exports = function not(arg) {
  var func = match(arg);
  var newfunc = function (o) {
    return !func(o);
  };
  setName(newfunc, 'not(' + func.name + ')');
  return newfunc;
};
