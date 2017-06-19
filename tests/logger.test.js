var assert = require('chai').assert;
var match = require('../lib/match');
var has = require('../extra/has');
var not = require('../extra/not');
var and = require('../extra/and');
var or = require('../extra/or');
var arrayOf = require('../extra/arrayOf');

var isPrototypeOf = require('../extra/isPrototypeOf');
var isInstanceOf = require('../extra/isInstanceOf');
var validationResult = require('../extra/validationResult');

describe('logger', function () {
  describe('match - simple objects', function () {
    it('must log simple object', function () {
      var result = validationResult(true);
      var validator = match(1);
      validator(1, result);
      assert.deepEqual(result(), [ { path: '', name: 'isNumber:1', result: true, value: 1 } ]);
    });

    it('must log simple object - false', function () {
      var result = validationResult(true);
      var validator = match(1);
      validator(2, result);
      assert.deepEqual(result(), [ { path: '', name: 'isNumber:1', result: false, value: 2 } ]);
    });

    it('must log a custom function', function () {
      var result = validationResult(true);
      var validator = match(function isCool(o) { return o === 'cool'; });
      validator('cool', result);
      assert.deepEqual(result(), [ { path: '', name: 'isCool', result: true, value: 'cool' } ]);
    });

    it('must log an array', function () {
      var result = validationResult(true);
      var validator = match([1, 2]);
      validator([1, 2], result);

      assert.deepEqual(result(), [
        { path: '', name: 'isArray', result: true, value: [ 1, 2 ] },
        { path: '[0]', name: 'isNumber:1', result: true, value: 1 },
        { path: '[1]', name: 'isNumber:2', result: true, value: 2 } ]);
    });

    it('must log an array (valid false)', function () {
      var result = validationResult(true);
      var validator = match([1, 2]);
      validator([3, 2], result);

      assert.deepEqual(result(), [
        { path: '', name: 'isArray', result: true, value: [ 3, 2 ] },
        { path: '[0]', name: 'isNumber:1', result: false, value: 3 },
        { path: '[1]', name: 'isNumber:2', result: true, value: 2 } ]);
    });

    it('must log an object', function () {
      var result = validationResult(true);
      var validator = match({ key1: 1, key2: 2 });
      validator({ key1: 1, key2: 2 }, result);

      assert.deepEqual(result(), [
        { path: '', name: 'isObject', result: true, value: { key1: 1, key2: 2 } },
        { path: 'key1', name: 'hasAttribute', result: true, value: { key1: 1, key2: 2 } },
        { path: 'key1', name: 'isNumber:1', result: true, value: 1 },
        { path: 'key2', name: 'hasAttribute', result: true, value: { key1: 1, key2: 2 } },
        { path: 'key2', name: 'isNumber:2', result: true, value: 2 } ]);
    });

    it('must log an object, validate false', function () {
      var result = validationResult(true);
      var validator = match({ key1: 1, key2: 2 });
      validator({ key1: 1 }, result);

      assert.deepEqual(result(), [
        { path: '', name: 'isObject', result: true, value: { key1: 1 } },
        { path: 'key1', name: 'hasAttribute', result: true, value: { key1: 1 } },
        { path: 'key1', name: 'isNumber:1', result: true, value: 1 },
        { path: 'key2', name: 'hasAttribute', result: false, value: { key1: 1 } }]);
    });

    it('must log an object, validate false', function () {
      var result = validationResult(true);
      var validator = match({ key1: 1, key2: 2 });
      validator({ key1: 3, key2: 2 }, result);

      assert.deepEqual(result(), [
        { path: '', name: 'isObject', result: true, value: { key1: 3, key2: 2 } },
        { path: 'key1', name: 'hasAttribute', result: true, value: { key1: 3, key2: 2 } },
        { path: 'key1', name: 'isNumber:1', result: false, value: 3 },
        { path: 'key2', name: 'hasAttribute', result: true, value: { key1: 3, key2: 2 } },
        { path: 'key2', name: 'isNumber:2', result: true, value: 2 } ]);
    });

    it('must log an object, validate false, show only false', function () {
      var result = validationResult(false);
      var validator = match({ key1: 1, key2: 2 });
      validator({ key1: 1 }, result);

      assert.deepEqual(result(), [
        { path: 'key2', name: 'hasAttribute', result: false, value: { key1: 1 } }]);
    });
  });

  describe('has', function () {
    it('must log simple object', function () {
      var result = validationResult(true);
      var validator = has(['test1', 'test2']);
      validator({test1: 1, test2: 2}, result);
      assert.deepEqual(result(), [
        { path: '', name: 'isObject', result: true, value: {test1: 1, test2: 2} },
        { path: 'test1', name: 'hasAttribute', result: true, value: {test1: 1, test2: 2} },
        { path: 'test2', name: 'hasAttribute', result: true, value: {test1: 1, test2: 2} }
      ]);
    });
  });

  describe('isPropotypeOf, isInstanceOf', function () {
    it('must log isPropotypeOf', function () {
      var result = validationResult(true);
      var validator = isPrototypeOf(Array.prototype);
      validator([], result);
      assert.deepEqual(result(), [
        { path: '', name: 'isPrototypeOf:Array', result: true, value: [] },
      ]);
    });

    it('must log isInstanceOf', function () {
      var result = validationResult(true);
      var validator = isInstanceOf(Array);
      validator([], result);
      assert.deepEqual(result(), [
        { path: '', name: 'isInstanceOf:Array', result: true, value: [] },
      ]);
    });
  });

  describe('not', function () {
    it('must log not', function () {
      var result = validationResult(true);
      var validator = not(1);
      validator(1, result);
      assert.deepEqual(result(), [
        { path: '', name: 'not(isNumber:1)', result: false, value: 1 },
      ]);
    });
  });

  describe('and', function () {
    it('must log and', function () {
      var result = validationResult(true);
      var validator = and([
        function sum3(o) { return o[0] + o[1] === 3; },
        function are2Items(o) { return o.length === 2; }]);
      validator([1, 2], result);
      assert.deepEqual(result(), [
        { path: '', name: 'sum3', result: true, value: [1, 2] },
        { path: '', name: 'are2Items', result: true, value: [1, 2] },
      ]);
    });

    it('must log and, one fails', function () {
      var result = validationResult(true);
      var validator = and([
        function sum3(o) { return o[0] + o[1] === 3; },
        function are2Items(o) { return o.length === 2; }]);
      validator([1, 3], result);
      assert.deepEqual(result(), [
        { path: '', name: 'sum3', result: false, value: [1, 3] },
      ]);
    });
  });

  describe('or', function () {
    it('must log or', function () {
      var result = validationResult(true);
      var validator = or([
        function sum3(o) { return o[0] + o[1] === 3; },
        function are2Items(o) { return o.length === 2; }]);
      validator([1, 2], result);
      assert.deepEqual(result(), [
       { path: '', name: 'sum3', result: true, value: [1, 2] },
      ]);
    });

    it('must log or, one fails', function () {
      var result = validationResult(true);
      var validator = or([
        function sum3(o) { return o[0] + o[1] === 3; },
        function are2Items(o) { return o.length === 2; }]);
      validator([1, 3], result);
      assert.deepEqual(result(), [
        { path: '', name: 'sum3', result: false, value: [1, 3] },
        { path: '', name: 'are2Items', result: true, value: [1, 3] },
      ]);
    });
  });

  describe('arrayOf', function () {
    it('must log arrayOf', function () {
      var result = validationResult(true);
      var validator = arrayOf(5);
      validator([5, 5], result);
      assert.deepEqual(result(), [
       { path: '', name: 'isArray', result: true, value: [5, 5] },
       { path: '[0]', name: 'isNumber:5', result: true, value: 5 },
       { path: '[1]', name: 'isNumber:5', result: true, value: 5 },
      ]);
    });

    it('must log arrayOf, one fails', function () {
      var result = validationResult(true);
      var validator = arrayOf(5);
      validator([2, 5], result);
      assert.deepEqual(result(), [
       { path: '', name: 'isArray', result: true, value: [2, 5] },
       { path: '[0]', name: 'isNumber:5', result: false, value: 2 },
       { path: '[1]', name: 'isNumber:5', result: true, value: 5 },
      ]);
    });
  });

  describe('match - composed object', function () {
    it('must log composed object', function () {
      var result = validationResult(true);
      var validator = match({
        user: {
          name: /[a-zA-Z]+/,
          jobtitle: or(['engineer', 'analyst'])
        },
        deleted: not(true)
      });
      validator({
        user: {
          name: 'Maurizio',
          jobtitle: 'engineer'
        },
        deleted: false
      }, result);

      assert.deepEqual(result(), [
        { path: '', name: 'isObject', result: true, value: { user: { name: 'Maurizio', jobtitle: 'engineer' }, deleted: false } },
        { path: 'user', name: 'hasAttribute', result: true, value: { user: { name: 'Maurizio', jobtitle: 'engineer' }, deleted: false } },
        { path: 'user', name: 'isObject', result: true, value: { name: 'Maurizio', jobtitle: 'engineer' } },
        { path: 'user.name', name: 'hasAttribute', result: true, value: { name: 'Maurizio', jobtitle: 'engineer' } },
        { path: 'user.name', name: 'isRegExp:/[a-zA-Z]+/', result: true, value: 'Maurizio' },
        { path: 'user.jobtitle', name: 'hasAttribute', result: true, value: { name: 'Maurizio', jobtitle: 'engineer' } },
        { path: 'user.jobtitle', name: 'isString:engineer', result: true, value: 'engineer' },
        { path: 'deleted', name: 'hasAttribute', result: true, value: { user: { name: 'Maurizio', jobtitle: 'engineer' }, deleted: false } },
        { path: 'deleted', name: 'not(isTrue)', result: true, value: false }]);
    });
  });
});
