var assert = require('chai').assert;
var validator = require('..');

describe('validator match', function () {

  it('must match using undefined', function () {
    var is_anything = validator().match(undefined);
    assert.equal(is_anything('hello').value(), 1);
    assert.equal(is_anything('nothello').value(), 1);
  });

  it('must match using a string', function () {
    var is_hello = validator().match('hello');
    assert.equal(is_hello('hello').value(), 1);
    assert.isNull(is_hello('nothello'));
  });

  it('must match using a regexp', function () {
    var is_hello = validator().match(/hello/);
    assert.equal(is_hello('hello world').value(), 1);
    assert.isNull(is_hello('good morning world'));
  });

  describe('single/multiple match', function () {
    var isAnything, hasWidth, hasHeight_hasWidth;

    before(function () {
      isAnything = validator();
      hasWidth = isAnything.match({'width': undefined});
      hasHeight_hasWidth = isAnything.match({'width': undefined, 'height': undefined});
    });

    it('must set score correctly', function () {
      assert.equal(isAnything.score(), 0);
      assert.equal(hasWidth.score(), 1);
      assert.equal(hasHeight_hasWidth.score(), 1);
    });

    it('must match', function () {
      assert.equal(hasWidth({width: 1, height: 2}).value(), 1);
      assert.equal(hasHeight_hasWidth({width: 1, height: 2}).value(), 1);
    });
  });

  describe('single/multiple match using objects', function () {
    var isAnything, hasWidth10, hasX10;

    before(function () {
      isAnything = validator();
      hasWidth10 = isAnything.match({'width': '10'});
      hasX10 = isAnything.match({
        center: {
          x: '10', y: undefined
        }
      });
    });

    it('must set score correctly', function () {
      assert.equal(hasWidth10.score(), 1);
      assert.equal(hasX10.score(), 1);
    });

    it('must match', function () {
      assert.equal(hasWidth10({width: '10'}).value(), 1);
      assert.equal(hasX10({center: {x:'10', y:'1'}}).value(), 1);
    });

    it('must not match', function () {
      assert.isNull(hasX10({center: {x:'11', y:'1'}}));
      assert.isNull(hasWidth10({width: 1}));
      assert.isNull(hasX10({center: {x:'10'}}));
      assert.isNull(hasX10({center: '1'}));
    });

  });

  describe('single/multiple match using functions', function () {
    var isAnything, hasWidthbetween5and10, isNotANumber, isArray;

    before(function () {
      isAnything = validator();
      hasWidthbetween5and10 = isAnything.match({width: function (w) {
        return w >= 5 && w <=10;
      }});
      isNotANumber = isAnything.match(isNaN);
      isArray = isAnything.match(Array.isArray);
    });

    it('must set score correctly', function () {
      assert.equal(hasWidthbetween5and10.score(), 1);
    });

    it('must match', function () {
      assert.equal(hasWidthbetween5and10({width: 8}).value(), 1);

      assert.equal(isNotANumber(NaN).value(), 1);
      assert.equal(isArray([1, 2, 3]).value(), 1);
    });

    it('must not match', function () {
      assert.isNull(hasWidthbetween5and10({width: 12}));
      assert.isNull(hasWidthbetween5and10({width: 4}));
      assert.isNull(isNotANumber(1));
      assert.isNull(isArray(true));
    });
  });

  describe('single/multiple match using arrays', function () {
    var isAnything, hasWidthAndHeight;

    before(function () {
      isAnything = validator();
      hasWidthAndHeight = isAnything.match(['width', 'height']);
      hasWidthAsSecondField = isAnything.match([undefined, 'width']);
      hasSecondNumberOdd = isAnything.match([undefined, function (n) {
        return n % 2;
      }]);
    });

    it('must set score correctly', function () {
      assert.equal(hasWidthAndHeight.score(), 1);
    });

    it('must match', function () {
      assert.equal(hasWidthAndHeight(['width', 'height']).value(), 1);
    });

    it('must not match', function () {
      assert.isNull(hasWidthAndHeight(['width']));
    });

    it('must match only second item', function () {
      assert.equal(hasWidthAsSecondField(['xxx', 'width']).value(), 1);
      assert.isNull(hasWidthAsSecondField(['width']));
    });

    it('must match only second item with function', function () {
      assert.equal(hasSecondNumberOdd(['xxx', 3]).value(), 1);
      assert.isNull(hasSecondNumberOdd(['xxx', 2]));
    });

  });

  describe('single/multiple match using null', function () {
    var isAnything, isNull;

    before(function () {
      isAnything = validator();
      isNull = isAnything.match(null);
    });

    it('must set score correctly', function () {
      assert.equal(isNull.score(), 1);
    });

    it('must match', function () {
      assert.equal(isNull(null).value(), 1);
    });

    it('must not match', function () {
      assert.isNull(isNull(1));
    });
  });

  describe('single/multiple match using boolean', function () {
    var isAnything, isTrue, isFalse;

    before(function () {
      isAnything = validator();
      isTrue = isAnything.match(true);
      isFalse = isAnything.match(false);
    });

    it('must set score correctly', function () {
      assert.equal(isTrue.score(), 1);
      assert.equal(isFalse.score(), 1);
    });

    it('must match', function () {
      assert.equal(isTrue(true).value(), 1);
      assert.equal(isFalse(false).value(), 1);
    });

    it('must not match', function () {
      assert.isNull(isTrue(false));
      assert.isNull(isFalse(true));
      assert.isNull(isFalse(''));
      assert.isNull(isTrue(''));
    });
  });

});
