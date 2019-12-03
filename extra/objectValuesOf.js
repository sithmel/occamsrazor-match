var match = require('../lib/match')
var setName = require('../lib/setName')
var logger = require('../lib/logger')

function getIsObject () {
  return logger(function isObject (o) {
    return typeof o === 'object'
  })
}

module.exports = function objectValues (args, some) {
  var prefixName = some ? 'someValues' : 'everyValues'
  var val = match(args)

  var func = function (obj, callback, path) {
    var result = !some
    path = path || ''
    if (!getIsObject()(obj, callback, path)) return false
    for (var k in obj) {
      result = val(obj[k], callback, path + '[' + k + ']')
      if (some) {
        if (result) {
          return true // if true no needs to go on
        }
      } else {
        if (!result) {
          if (!callback) {
            return false
          }
          result = false // extra check only if callback
        }
      }
    }
    return result
  }
  return setName(func, prefixName + '(' + val.name + ')')
}
