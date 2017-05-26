var assert = require('chai').assert;
var match = require('../lib/match');
var has = require('../extra/has');
var isInstanceOf = require('../extra/isInstanceOf');
var isPrototypeOf = require('../extra/isPrototypeOf');
var not = require('../extra/not');
var and = require('../extra/and');
var or = require('../extra/or');

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
    it('must return name for array (2)', function () {
      assert.equal(match([1,'test']).name, 'isArray:[isNumber:1,isString:test]');
    });
    it('must return name for object', function () {
      assert.equal(match({}).name, 'isObject:{}');
    });
  });
  describe('has', function () {
    it('must return name', function () {
      assert.equal(has(['test1', 'test2']).name, 'isObject:{test1:isAnything,test2:isAnything}');
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
  describe('not', function () {
    it('must return name', function () {
      assert.equal(not('test1').name, 'not(isString:test1)');
    });
  });
  describe('or', function () {
    it('must return name', function () {
      assert.equal(or([1, 2]).name, 'or(isNumber:1 isNumber:2)');
    });
  });
  describe('and', function () {
    it('must return name', function () {
      assert.equal(and([1, 2]).name, 'and(isNumber:1 isNumber:2)');
    });
  });

});
