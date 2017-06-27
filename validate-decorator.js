var match = require('./index');
var and = require('./extra/and');
var validationErrors = require('./extra/validationErrors');
var ValidateError = require('./validate-error');

function validatorDecorator() {
  var args = Array.prototype.slice.call(arguments, 0);
  var validators = match(args);
  return function (func) {
    return function () {
      var context = this;
      var args = Array.prototype.slice.call(arguments, 0);
      var argsToValidate = Array.prototype.slice.call(arguments, 0, args.length);
      var errors = validationErrors();
      if (validators(argsToValidate, errors)) {
        return func.apply(context, args);
      } else {
        throw new ValidatorError('Function called with wrong arguments: ' + validators.name, errors());
      }
    };
  };
}

module.exports = validatorDecorator;
