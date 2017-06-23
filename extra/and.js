var match = require('../lib/match');
var setName = require('../lib/setName');

module.exports = function and(args) {
  if (!Array.isArray(args)) throw new Error('"and": requires an array');
  if (args.length === 0) {
    return match(undefined);
  }
  if (args.length === 1) {
    return match(args[0]);
  }
  var funcs = args.map(function (f) { return match(f); });

  var newfunc = function (o, callback, path) {
    for (var i = 0; i < funcs.length; i++) {
      if (!funcs[i](o, callback, path)) {
        return false;
      }
    }
    return true;
  };

  var funcName = funcs
    .map(function (f) { return f.name; })
    .join(' ');

  return setName(newfunc, 'and(' + funcName + ')');
};
