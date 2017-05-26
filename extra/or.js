var match = require('../lib/match');
var setName = require('../lib/setName');

module.exports = function or(args) {
  if (!Array.isArray(args)) throw new Error('"or": requires an array');
  var funcs = args.map(function (f) { return match(f); });

  var newfunc = function (o) {
    for (var i = 0; i < funcs.length; i++) {
      if (funcs[i](o)) {
        return true;
      }
    }
    return false;
  };

  var funcName = funcs
    .map(function (f) { return f.name; })
    .join(' ');

  setName(newfunc, 'or(' + funcName + ')');
  return newfunc;
};
