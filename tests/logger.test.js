var assert = require('chai').assert;
var match = require('../lib/match');
var has = require('../extra/has');
var not = require('../extra/not');
var and = require('../extra/and');
var or = require('../extra/or');
var arrayOf = require('../extra/arrayOf');

var isPrototypeOf = require('../extra/isPrototypeOf');
var isInstanceOf = require('../extra/isInstanceOf');
var validationErrors = require('../extra/validationErrors');

describe('logger', function () {
  describe('match - simple objects', function () {
    it('must log simple object', function () {
      var errors = validationErrors();
      var validator = match(1);
      validator(1, errors);
      assert.deepEqual(errors(), []);
    });

    it('must log simple object - false', function () {
      var errors = validationErrors();
      var validator = match(1);
      validator(2, errors);
      assert.deepEqual(errors(), [ { path: '', name: 'isNumber:1', value: 2 } ]);
    });

    it('must log a custom function', function () {
      var errors = validationErrors();
      var validator = match(function isCool(o) { return o === 'cool'; });
      validator('cool', errors);
      assert.deepEqual(errors(), []);
    });

    it('must log an array', function () {
      var errors = validationErrors();
      var validator = match([1, 2]);
      validator([1, 2], errors);

      assert.deepEqual(errors(), []);
    });

    it('must log an array (valid false)', function () {
      var errors = validationErrors();
      var validator = match([1, 2]);
      validator([3, 2], errors);

      assert.deepEqual(errors(), [
        { path: '[0]', name: 'isNumber:1', value: 3 }
      ]);
    });

    it('must log an object', function () {
      var errors = validationErrors();
      var validator = match({ key1: 1, key2: 2 });
      validator({ key1: 1, key2: 2 }, errors);

      assert.deepEqual(errors(), []);
    });

    it('must log an object, validate false', function () {
      var errors = validationErrors();
      var validator = match({ key1: 1, key2: 2 });
      validator({ key1: 3, key2: 2 }, errors);

      assert.deepEqual(errors(), [
        { path: 'key1', name: 'isNumber:1', value: 3 },
      ]);
    });
  });

  describe('has', function () {
    it('must log simple object', function () {
      var errors = validationErrors();
      var validator = has(['test1', 'test2']);
      validator({test1: 1, test2: 2}, errors);
      assert.deepEqual(errors(), []);
    });
  });

  describe('isPropotypeOf, isInstanceOf', function () {
    it('must log isPropotypeOf', function () {
      var errors = validationErrors();
      var validator = isPrototypeOf(Array.prototype);
      validator([], errors);
      assert.deepEqual(errors(), []);
    });

    it('must log isInstanceOf', function () {
      var errors = validationErrors();
      var validator = isInstanceOf(Array);
      validator([], errors);
      assert.deepEqual(errors(), []);
    });
  });

  describe('not', function () {
    it('must log not', function () {
      var errors = validationErrors();
      var validator = not(1);
      validator(1, errors);
      assert.deepEqual(errors(), [
        { path: '', name: 'not(isNumber:1)', value: 1 },
      ]);
    });
  });

  describe('and', function () {
    it('must log and', function () {
      var errors = validationErrors();
      var validator = and([
        function sum3(o) { return o[0] + o[1] === 3; },
        function are2Items(o) { return o.length === 2; }]);
      validator([1, 2], errors);
      assert.deepEqual(errors(), []);
    });

    it('must log and, one fails', function () {
      var errors = validationErrors();
      var validator = and([
        function sum3(o) { return o[0] + o[1] === 3; },
        function are2Items(o) { return o.length === 2; }]);
      validator([1, 3], errors);
      assert.deepEqual(errors(), [
        { path: '', name: 'sum3', value: [1, 3] },
      ]);
    });
  });

  describe('or', function () {
    it('must log or', function () {
      var errors = validationErrors();
      var validator = or([
        function sum3(o) { return o[0] + o[1] === 3; },
        function are2Items(o) { return o.length === 2; }]);
      validator([1, 2], errors);
      assert.deepEqual(errors(), []);
    });

    it('must log or, all fail', function () {
      var errors = validationErrors();
      var validator = or([
        function sum3(o) { return o[0] + o[1] === 3; },
        function are2Items(o) { return o.length === 2; }]);
      validator([1, 1, 4], errors);
      assert.deepEqual(errors(), [
        { path: '', name: 'sum3', value: [ 1, 1, 4 ] },
        { path: '', name: 'are2Items', value: [ 1, 1, 4 ] } ]);
    });

    it('must log or, only if relevant)', function () {
      var errors = validationErrors();
      var validator = or([false, true]);
      validator(true, errors);
      assert.deepEqual(errors(), []);
    });
  });

  describe('arrayOf', function () {
    it('must log arrayOf', function () {
      var errors = validationErrors();
      var validator = arrayOf(5);
      validator([5, 5], errors);
      assert.deepEqual(errors(), []);
    });

    it('must log arrayOf, one fails', function () {
      var errors = validationErrors();
      var validator = arrayOf(5);
      validator([2, 5], errors);
      assert.deepEqual(errors(), [
       { path: '[0]', name: 'isNumber:5', value: 2 },
      ]);
    });

    it('must stop logging is validation is true (some)', function () {
      var errors = validationErrors();
      var validator = arrayOf(5, 'some');
      validator([5, 2, 3], errors);
      assert.deepEqual(errors(), []);
    });
  });

  describe('match - composed object', function () {
    it('must log composed object', function () {
      var errors = validationErrors();
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
        deleted: true
      }, errors);

      assert.deepEqual(errors(), [
        { path: 'deleted', name: 'not(isTrue)', value: true }
      ]);
    });
  });
});
