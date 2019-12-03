var setName = require('../lib/setName')

module.exports = function has (args) {
  if (!Array.isArray(args)) throw new Error('"has": requires an array')
  var newfunc = function (o) {
    for (var i = 0, len = args.length; i < len; i++) {
      if (!(args[i] in o)) {
        return false
      }
    }
    return true
  }
  return setName(newfunc, 'has(' + args.join(',') + ')')
}
