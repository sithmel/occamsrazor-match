var assert = require('chai').assert;
var has = require('../extra/has');
var isInstanceOf = require('../extra/isInstanceOf');
var isPrototypeOf = require('../extra/isPrototypeOf');

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
    hasWidthAndHeight = has('width', 'height');
  });

  it('must match', function () {
    assert.isTrue(hasWidthAndHeight({width: 8, height: 10}));
  });

  it('must not match', function () {
    assert.isFalse(hasWidthAndHeight({width: 12}));
  });
});
