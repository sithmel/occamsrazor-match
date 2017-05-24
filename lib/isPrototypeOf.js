function setName(fn, name) {
  Object.defineProperty(fn, 'name', { value: name });
}

module.exports = function isPrototypeOf(proto) {
  var func = function (obj) { return proto.isPrototypeOf(obj); };
  setName(func, 'isPrototypeOf:' + proto.constructor.name);
  return func;
};
