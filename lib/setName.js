function setName(fn, name) {
  Object.defineProperty(fn, 'name', { value: name });
}

module.exports = setName;
