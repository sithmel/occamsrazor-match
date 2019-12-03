function setName (fn, name) {
  try {
    Object.defineProperty(fn, 'name', { value: name })
    return fn
  } catch (e) { // stupid safari: name is not configurable!
  }
  return fn
}

module.exports = setName
