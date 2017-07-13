var arrayOf = require('./arrayOf');

module.exports = function every(args) {
  return arrayOf(args, false);
};
