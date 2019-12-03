var logger = require('../lib/logger')

function isDefined (o) {
  return typeof o !== 'undefined'
}

module.exports = logger(isDefined)
