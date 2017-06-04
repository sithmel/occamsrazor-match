var match = require('../lib/match');
var setName = require('../lib/setName');

module.exports = function and(args) {
  if (!Array.isArray(args)) throw new Error('"and": requires an array');
  var funcs = args.map(function (f) { return match(f); });

  var newfunc = function (o, callback, path) {
    var result = true;
    for (var i = 0; i < funcs.length; i++) {
      if (!funcs[i](o, callback, path)) {
        if (!callback) {
          return false;
        }
        result = false;
      }
    }
    return result;
  };

  var funcName = funcs
    .map(function (f) { return f.name; })
    .join(' ');

  setName(newfunc, 'and(' + funcName + ')');
  return newfunc;
};
