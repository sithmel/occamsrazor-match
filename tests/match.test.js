var assert = require('chai').assert;
var match = require('../lib/match');

describe('match', function () {

  it('must match using undefined', function () {
    var is_anything = match(undefined);
    assert.isTrue(is_anything('hello'));
    assert.isTrue(is_anything('nothello'));
  });

  it('must match using a string', function () {
    var is_hello = match('hello');
    assert.isTrue(is_hello('hello'));
    assert.isFalse(is_hello('nothello'));
  });

  it('must match using a regexp', function () {
    var is_hello = match(/hello/);
    assert.isTrue(is_hello('hello world'));
    assert.isFalse(is_hello('good morning world'));
  });

  it('must match using objects', function () {
    var hasWidth = match({ width: undefined });
    var hasHeight_hasWidth = match({ 'width': undefined, 'height': undefined });
    assert.isTrue(hasWidth({ width: 1, height: 2 }));
    assert.isTrue(hasHeight_hasWidth({ width: 1, height: 2 }));

    assert.isFalse(hasWidth({}));
    assert.isFalse(hasHeight_hasWidth({ height: 2 }));
  });

  it('must match using objects and values', function () {
    var hasWidth10 = match({ 'width': '10' });
    assert.isTrue(hasWidth10({ width: '10' }));
    assert.isFalse(hasWidth10({ width: '20' }));
  });

  it('must match using objects and nested values', function () {
    var hasX10 = match({
      center: {
        x: '10', y: undefined
      }
    });
    assert.isTrue(hasX10({ center: { x:'10', y:'1' } } ));
    assert.isFalse(hasX10( {center: { x:'11', y:'1' } } ));
  });

  it('must match null', function () {
    var isNull = match(null);
    assert.isTrue(isNull(null));
    assert.isFalse(isNull(1));
  });

  it('must match true', function () {
    var isTrue = match(true);
    assert.isTrue(isTrue(true));
    assert.isFalse(isTrue(false));
  });

  it('must match false', function () {
    var isFalse = match(false);
    assert.isTrue(isFalse(false));
    assert.isFalse(isFalse(true));
  });

  it('must match using function', function () {
    var isNotANumber = match(isNaN);
    assert.isTrue(isNotANumber(NaN));
    assert.isFalse(isNotANumber(2));
  });

  it('must match using function (2)', function () {
    var hasWidthbetween5and10 = match({ width: function (w) {
      return w >= 5 && w <=10;
    }});
    assert.isTrue(hasWidthbetween5and10({ width: 8 }));
    assert.isFalse(hasWidthbetween5and10({ width: 11 }));
  });

  it('must match using an array', function () {
    var hasWidthAndHeight = match(['width', 'height']);
    assert.isTrue(hasWidthAndHeight(['width', 'height']));
    assert.isFalse(hasWidthAndHeight(['width']));
  });

  it('must match using an array (2)', function () {
    var hasWidthAsSecondField = match([undefined, 'width']);
    assert.isTrue(hasWidthAsSecondField(['height', 'width']));
    assert.isFalse(hasWidthAsSecondField(['width', 'height']));
  });

  it('must match using an array (3)', function () {
    var hasSecondNumberOdd = match([undefined, function (n) {
      return n % 2;
    }]);
    assert.isTrue(hasSecondNumberOdd(['height', 3]));
    assert.isFalse(hasSecondNumberOdd(['width', 2]));
  });
});
