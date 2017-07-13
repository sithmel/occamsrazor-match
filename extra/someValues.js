var objectValuesOf = require('./objectValuesOf');

module.exports = function someValues(args) {
  return objectValuesOf(args, true);
};
