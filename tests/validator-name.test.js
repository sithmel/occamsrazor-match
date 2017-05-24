var assert = require('chai').assert;
var match = require('../lib/match');
var has = require('../lib/has');
var isInstanceOf = require('../lib/isInstanceOf');
var isPrototypeOf = require('../lib/isPrototypeOf');

describe('validator name', function () {
  describe('match', function () {
    it('must return name for undefined', function () {
      assert.equal(match().name, 'isAnything');
    });
    it('must return name for string', function () {
      assert.equal(match('a').name, 'isString:a');
    });
    it('must return name for number', function () {
      assert.equal(match(2).name, 'isNumber:2');
    });
    it('must return name for null', function () {
      assert.equal(match(null).name, 'isNull');
    });
    it('must return name for boolean', function () {
      assert.equal(match(true).name, 'isTrue');
    });
    it('must return name for boolean', function () {
      assert.equal(match(false).name, 'isFalse');
    });
    it('must return name for regexp', function () {
      assert.equal(match(/abc/).name, 'isRegExp:/abc/');
    });
    it('must return name for function', function () {
      assert.equal(match(function test() {}).name, 'test');
    });
    it('must return name for array', function () {
      assert.equal(match([]).name, 'isArray:[]');
    });
    it('must return name for ', function () {
      assert.equal(match([1,'test']).name, 'isArray:[isNumber:1,isString:test]');
    });
    it('must return name for object', function () {
      assert.equal(match({}).name, 'isObject:{}');
    });
  });
  describe('has', function () {
    it('must return name', function () {
      assert.equal(has('test1', 'test2').name, 'isObject:{test1:isAnything,test2:isAnything}');
    });
  });
  describe('isInstanceOf', function () {
    it('must return name', function () {
      assert.equal(isInstanceOf(String).name, 'isInstanceOf:String');
    });
  });
  describe('isPrototypeOf', function () {
    it('must return name', function () {
      assert.equal(isPrototypeOf('test').name, 'isPrototypeOf:String');
    });
  });
});
