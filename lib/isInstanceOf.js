function setName(fn, name) {
  Object.defineProperty(fn, 'name', { value: name });
}

module.exports = function isInstanceOf(constructor) {
  var func = function (obj) { return obj instanceof constructor; };
  setName(func, 'isInstanceOf:' + constructor.name);
  return func;
};
