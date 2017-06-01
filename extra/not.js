var match = require('../lib/match');
var setName = require('../lib/setName');
var logger = require('../lib/logger');

module.exports = function not(arg) {
  var func = match(arg);
  var newfunc = function (o) {
    return !func(o);
  };
  setName(newfunc, 'not(' + func.name + ')');
  return logger(newfunc);
};
