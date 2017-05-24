var match = require('./match');

module.exports = function has() {
  var args = Array.prototype.slice.call(arguments);
  var i, out = {};
  for (i = 0, len = args.length; i < len; i++) {
    if (typeof args[i] !== 'string') {
      throw new Error('Occamsrazor (has): The arguments can only be strings');
    }
    out[args[i]] = undefined;
  }
  return match(out);
};
