module.exports = function validationResult(all) {
  var logs = [];
  return function (obj) {
    if (!obj) {
      return logs;
    }
    if (all || obj.result === false) {
      logs.push(obj);
    }
  };
};
