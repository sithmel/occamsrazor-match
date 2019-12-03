var match = require('../lib/match')
var setName = require('../lib/setName')

function queueCallback (callback) {
  var queue = []
  return {
    queue: function (obj) { queue.push(obj) },
    execute: function () {
      if (!callback) return
      for (var i = 0; i < queue.length; i++) {
        callback(queue[i])
      }
    }
  }
}

module.exports = function or (args) {
  if (!Array.isArray(args)) throw new Error('"or": requires an array')
  if (args.length === 0) {
    return match(undefined)
  }
  if (args.length === 1) {
    return match(args[0])
  }
  var funcs = args.map(function (f) { return match(f) })

  var newfunc = function (o, callback, path) {
    callback = queueCallback(callback)
    for (var i = 0; i < funcs.length; i++) {
      if (funcs[i](o, callback.queue, path)) {
        return true
      }
    }
    callback.execute() // callback is only relevant if validation is false
    return false
  }

  var funcName = funcs
    .map(function (f) { return f.name })
    .join(' ')

  return setName(newfunc, 'or(' + funcName + ')')
}
