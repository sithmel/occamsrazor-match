var assert = require('chai').assert;
var has = require('../extra/has');
var isInstanceOf = require('../extra/isInstanceOf');
var isPrototypeOf = require('../extra/isPrototypeOf');
var not = require('../extra/not');
var and = require('../extra/and');
var or = require('../extra/or');
var arrayOf = require('../extra/arrayOf');
var every = require('../extra/every');
var some = require('../extra/some');
var everyValues = require('../extra/everyValues');
var someValues = require('../extra/someValues');
var isUndefined = require('../extra/isUndefined');
var greaterThan = require('../extra/greaterThan');
var lessThan = require('../extra/lessThan');

describe('isPrototype/isInstanceOf', function () {
  var Square, square;

  before(function () {
    Square = function (l) {
      this.l = l;
    };
    square = new Square(4);
  });

  it('must validate using isPrototypeOf', function () {
    var isSquareProto = isPrototypeOf(Square.prototype);
    assert.isTrue(isSquareProto(square));
  });

  it('must validate using isInstanceOf', function () {
    var isSquareInstance = isInstanceOf(Square);
    assert.isTrue(isSquareInstance(square));
  });
});

describe('has', function () {
  var hasWidthAndHeight;

  before(function () {
    hasWidthAndHeight = has(['width', 'height']);
  });

  it('must match', function () {
    assert.isTrue(hasWidthAndHeight({width: 8, height: 10}));
  });

  it('must not match', function () {
    assert.isFalse(hasWidthAndHeight({width: 12}));
  });
});

describe('not', function () {
  var notWidth;

  before(function () {
    notWidth = not('width');
  });

  it('must match', function () {
    assert.isTrue(notWidth('height'));
  });

  it('must not match', function () {
    assert.isFalse(notWidth('width'));
  });

  it('must never match', function () {
    var v = not();
    assert.isFalse(v('any'));
  });

});

describe('or', function () {
  var fiveOrNine;

  before(function () {
    fiveOrNine = or([5, 9]);
  });

  it('must match', function () {
    assert.isTrue(fiveOrNine(5));
    assert.isTrue(fiveOrNine(9));
  });

  it('must not match', function () {
    assert.isFalse(fiveOrNine('width'));
  });

  it('must never match', function () {
    var v = or([]);
    assert.isTrue(v('width'));
  });
});

describe('and', function () {
  var fiveAndOdd;

  before(function () {
    function isOdd(n) { return n % 2 !== 0; }
    fiveAndOdd = and([isOdd, 5]);
  });

  it('must match', function () {
    assert.isTrue(fiveAndOdd(5));
  });

  it('must not match', function () {
    assert.isFalse(fiveAndOdd('width'));
    assert.isFalse(fiveAndOdd(9));
  });

  it('must always match', function () {
    var v = and([]);
    assert.isTrue(v('width'));
  });
});

describe('every', function () {
  var areFive;

  before(function () {
    areFive = every(5);
  });

  it('must match', function () {
    assert.isTrue(areFive([5]));
  });

  it('must match (2)', function () {
    assert.isTrue(areFive([5, 5]));
  });

  it('must not match', function () {
    assert.isFalse(areFive([3]));
  });

  it('must not match (2)', function () {
    assert.isFalse(areFive([5, 3]));
  });

  it('must not match (3)', function () {
    assert.isTrue(areFive([]));
  });
});

describe('some', function () {
  var someFive;

  before(function () {
    someFive = some(5);
  });

  it('must match', function () {
    assert.isTrue(someFive([5]));
  });

  it('must match (2)', function () {
    assert.isTrue(someFive([5, 5]));
  });

  it('must not match', function () {
    assert.isFalse(someFive([3]));
  });

  it('must not match (2)', function () {
    assert.isTrue(someFive([5, 3]));
  });

  it('must not match (3)', function () {
    assert.isTrue(someFive([3, 5]));
  });

  it('must not match (4)', function () {
    assert.isFalse(someFive([]));
  });
});

describe('everyValues', function () {
  var areFive;

  before(function () {
    areFive = everyValues(5);
  });

  it('must match', function () {
    assert.isTrue(areFive({v: 5}));
  });

  it('must match (2)', function () {
    assert.isTrue(areFive({ v: 5, v1: 5 }));
  });

  it('must not match', function () {
    assert.isFalse(areFive({ v: 3 }));
  });

  it('must not match (2)', function () {
    assert.isFalse(areFive({ v: 5, v1: 3 }));
  });

  it('must not match (3)', function () {
    assert.isTrue(areFive({}));
  });
});

describe('someValues', function () {
  var someFive;

  before(function () {
    someFive = someValues(5);
  });

  it('must match', function () {
    assert.isTrue(someFive({ v: 5 }));
  });

  it('must match (2)', function () {
    assert.isTrue(someFive({ v: 5, v1: 5 }));
  });

  it('must not match', function () {
    assert.isFalse(someFive({ v: 3 }));
  });

  it('must not match (2)', function () {
    assert.isTrue(someFive({ v: 5, v1: 3 }));
  });

  it('must not match (3)', function () {
    assert.isFalse(someFive({}));
  });
});

describe('isUndefined', function () {
  it('must match', function () {
    assert.isTrue(isUndefined(undefined));
  });

  it('must not match', function () {
    assert.isFalse(isUndefined('defined'));
  });
});

describe('number', function () {
  it('must be a number', function () {
    var isNumber = greaterThan();
    assert.isTrue(isNumber(1));
    assert.isFalse(isNumber('1'));
  });

  it('must be greater than', function () {
    var greaterThan0 = greaterThan(0);
    assert.isTrue(greaterThan0(1));
    assert.isFalse(greaterThan0(-1));
  });

  it('must be greater than', function () {
    var lessThan0 = lessThan(0);
    assert.isTrue(lessThan0(-1));
    assert.isFalse(lessThan0(1));
  });
});
