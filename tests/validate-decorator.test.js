var assert = require('chai').assert;
var validateDecorator = require('../validate-decorator');
var or = require('../extra/or');

describe('validate', function () {

  it('must pass validation', function () {
    var validate = validateDecorator(1, or([false, true]));

    var func = validate(function (number, bool) {
      return number;
    });

    assert.equal(func(1, true), 1);
  });

  it('must pass validation (with extra arg)', function () {
    var validate = validateDecorator(1, or([false, true]));

    var func = validate(function (number, bool, extra) {
      return number;
    });

    assert.equal(func(1, true), 1);
  });

  it('must not pass validation', function () {
    var validate = validateDecorator(1, or([false, true]));

    var func = validate(function (number, bool) {
      return number;
    });

    assert.throw(function () { func(2, true); }, Error);
  });
});
