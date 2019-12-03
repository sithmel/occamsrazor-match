var setName = require('../lib/setName')
var logger = require('../lib/logger')

function isNumber (n) {
  return typeof n === 'number' && !isNaN(n)
}

function greaterThan (n) {
  if (!isNumber(n)) {
    return logger(isNumber)
  }
  var newfunc = function (o) {
    return isNumber(o) && o > n
  }
  return logger(setName(newfunc, 'greaterThan(' + n + ')'))
}

module.exports = greaterThan
