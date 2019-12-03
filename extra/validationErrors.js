module.exports = function validationErrors () {
  var logs = []
  return function (obj) {
    if (!obj) {
      return logs
    }
    logs.push(obj)
  }
}
