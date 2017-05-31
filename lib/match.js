var setName = require('./setName');
var logger = require('./logger');

function isAnything() {
  return true;
}

function isNull(s) {
  return s === null;
}

function isNumber(o) {
  var func = function (s) { return s === o; };
  setName(func, 'isNumber:' + o);
  return func;
}

function isString(o) {
  var func = function (s) { return s === o; };
  setName(func, 'isString:' + o);
  return func;
}

function isBoolean(o) {
  var func = function (s) { return s === o; };
  setName(func, o ? 'isTrue' : 'isFalse');
  return func;
}

function isRegExp(o) {
  var func = function (s) {
    return o.test(s);
  };
  setName(func, 'isRegExp:' + o.toString());
  return func;
}

function getIsArray() {
  return logger(function isArray(o) {
    return Array.isArray(o);
  });
}

function getIsObject() {
  return logger(function isObject(o) {
    return typeof o === 'object';
  });
}

function getHasAttr(attr) {
  return logger(function hasAttribute(o) {
    return attr in o;
  });
}

function array(o) {
  var functions = o.map(function (item, index) {
    return match(item);
  });

  var names = functions.map(function (f) { return f.name; }).join(',');

  var func = function (arr, callback, path) {
    path = path || '';
    if (!getIsArray()(arr, callback, path)) return false;
    for (var i = 0; i < functions.length; i++) {
      if (!functions[i](arr[i], callback, path + '[' + i + ']')) {
        return false;
      }
    }
    return true;
  };

  setName(func, 'array:[' + names + ']');
  return func;
}

function object(o) {
  var functions = Object.keys(o).map(function (k) {
    return {
      key: k,
      value: match(o[k])
    };
  })
  .reduce(function (obj, item) {
    obj[item.key] = item.value;
    return obj;
  }, {});

  var names = Object.keys(functions).map(function (k) {
    return k + ':' + functions[k].name;
  }).join(',');

  var func = function (obj, callback, path) {
    var currentPath;
    if (!getIsObject()(obj, callback, path)) return false;
    for (var k in o) {
      currentPath = path ? path + '.' + k : k;
      if (!getHasAttr(k)(obj, callback, currentPath)) return false;
      if (!functions[k](obj[k], callback, currentPath)) {
        return false;
      }
    }
    return true;
  };
  setName(func, 'object:{' + names + '}');
  return func;
}

function match(o) {
  var i, len, out = {};
  var func;

  if (typeof o === 'undefined') {
    func = isAnything;
  }
  else if (typeof o === 'string') {
    func = logger(isString(o));
  }
  else if (typeof o === 'number') {
    func = logger(isNumber(o));
  }
  else if (typeof o === 'boolean') {
    func = logger(isBoolean(o));
  }
  else if (o === null) {
    func = logger(isNull);
  }
  else if (o instanceof RegExp) {
    func = logger(isRegExp(o));
  }
  else if (typeof o === 'function') {
    if (o.length > 1) {
      func = o;
    } else {
      func = logger(o);
    }
  }
  else if (Array.isArray(o)) {
    func = array(o);
  }
  else if (typeof o === 'object') {
    func = object(o);
  }

  if (func) {
    return func;
  }
};

module.exports = match;
