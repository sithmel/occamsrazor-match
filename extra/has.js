var match = require('../lib/match');

module.exports = function has(args) {
  if (!Array.isArray(args)) throw new Error('"has": requires an array');
  var i, out = {};
  for (i = 0, len = args.length; i < len; i++) {
    if (typeof args[i] !== 'string') {
      throw new Error('Occamsrazor (has): The arguments can only be strings');
    }
    out[args[i]] = undefined;
  }
  return match(out);
};
