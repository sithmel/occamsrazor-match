occamsrazor-match
=================
[![Build Status](https://travis-ci.org/sithmel/occamsrazor-match.svg?branch=master)](https://travis-ci.org/sithmel/occamsrazor-match)

This is an helper library for writing validators.

What is a  validators
=====================
A validator is a function. When it runs against an object, it returns true or false.
```js
var isFive = function(o) {
  return o === 5;
}

isFive(5); // true
isFive(4); // false
```
Writing complex validators may be a bit verbose. This library helps you to write short yet expressive validators. It also takes care of assigning the function a sensible name, this can be very helpful for debugging. For example:
```js
match([1,'test']).name === 'array:[isNumber:1,isString:test]'
```

Importing the library
=====================
This library contains a main helper called "match" and some extra ones.
```js
var match = require('occamsrazor-match');
var has = require('occamsrazor-match/extra/has');
var isInstanceOf = require('occamsrazor-match/extra/isInstanceOf');
var isPrototypeOf = require('occamsrazor-match/extra/isPrototypeOf');

var not = require('occamsrazor-match/extra/not');
var or = require('occamsrazor-match/extra/or');
var and = require('occamsrazor-match/extra/and');
var some = require('occamsrazor-match/extra/some');
var every = require('occamsrazor-match/extra/every');
var greaterThan = require('occamsrazor-match/extra/greaterThan');
var lessThan = require('occamsrazor-match/extra/lessThan');

var isUndefined = require('occamsrazor-match/extra/isDefined');
var isDefined = require('occamsrazor-match/extra/isUndefined');
var isNumber = require('occamsrazor-match/extra/isNumber');
var isString = require('occamsrazor-match/extra/isString');
```

match
=====
This is the main helper, and can be used to create a lot of different validators.

These ones matches the value in it.
```js
var isFive = match(5);
var isNull = match(null);
var isTrue = match(true);
var isFalse = match(true);
var isHello = match('hello');
```

For example:
```js
isHello('hello'); // true
isFive(5); // true
```

Using undefined you create a validator that matches any value.
```js
var isAnything = match(undefined);
isAnything(5);
isAnything('hello');
isAnything({ greeting: 'hello' });
```
To match **undefined** there is an helper (isUndefined), explained below. Also if you wish to use a more explicit style, you can use the isAnything helper.

Using a regular expression, the validator will run that, on the value.
```js
var doesMatch = match(/[0-9]+/);
doesMatch('123'); // true
```

Passing a function, the function itself will be returned:
```js
var isLessThan5 = match(function (n) {
  return n < 5;
});

isLessThan5(2); // true
isLessThan5(8); // false
```
It looks like there is no real reason to do it, this will make more sense in a bit.

match - recursion
-----------------
"match" can take an array or an object and perform a nested validation:
```js
var isPoint = match({ x : isNumber, y: isNumber });
isPoint({ x: 1, y: 2 }); // true
isPoint({ x: 1, y: 2, z: 3 }); // true
isPoint({ x: 1, z: 3 }); // false
```
Passing values as undefined indicates that I don't really care about their value. Or if they are defined
```js
var isPointOnXaxis = match({ x : 0, y: undefined });
isPointOnXaxis({ x: 1, y: 2 }); // false
isPointOnXaxis({ x: 0, y: 2 }); // true
isPointOnXaxis({ x: 0 }); // true
```
Values will be interpreted as specified before so I can implement recursive validation:
```js
function isSalary(n) { return typeof n === 'number' && n > 0; }

var isEmployee = match({
  name : /[A-Za-z]+/,
  job: {
    position: undefined,
    salary: isSalary
  }
});
```

Arrays are supported as well:
```js
var startsWith123 = match([1, 2, 3]);
startsWith123([1, 2, 3, 4]); // true
startsWith123([2, 3, 4]); // false
```
In Arrays the behaviour of undefined comes useful:
```js
var thirdArgIsNumber = match([undefined, undefined, isNumber]);
thirdArgIsNumber(['a', 'b', 3, 4]); // true
thirdArgIsNumber(['a', 'b', 'c']); // false
```

has
===
This checks for the existence of a list of attributes:
```js
var isPoint = has(['x', 'y']);
```

isInstanceOf
=============
It checks if an object has been built with a specific factory function:
```js
var isPoint = isInstanceOf(Point);
```

isPrototypeOf
=============
It checks if an object is the prototype of another:
```js
var isPoint = isPrototypeOf(Point.prototype);
```

not
===
Negate the result of a validator. I can take either a function or the argument used for the match function.
```js
var isNotAPoint = not(isPrototypeOf(Point.prototype));
var isNotFive = not(5);
```

and
===
A validator that returns true only if all validators passed as argument return true. Every validator passed is transformed into a function using "match".
```js
function isOdd(n) { return n % 2 !== 0; }
function isInteger(n) { return n % 1 === 0; }
function isSquares(n) { return isInteger(Math.sqrt(n)); }
var oddAndSquared = and([isOdd, isSquared]);
oddAndSquared(4); // false
oddAndSquared(9); // true
```

or
==
A validator that returns true if at least one validator passed as argument returns true. Every validator passed is transformed into a function using "match".
```js
var is5or9 = or(5, 9);
is5or9(5); // true
is5or9(9); // true
is5or9(3); // false
```

some/every
==========
This couple of validators can be used to validate arrays. It takes a validator as argument (it uses "match" behind the scene) and checks the array items against that validator. In the case of "some", at least a check should pass to return true. In the case of "every", all of them should pass.
```js
var atLeastOne5 = some(5);
atLeastOne5([1, 2, 5]); // true
atLeastOne5([5, 5, 2]); // true
atLeastOne5([1, 2, 3]); // false
```

```js
var allNegatives = every(function isNegative(n) { return n < 0; });
allNegatives([-1, -2, -5]); // true
allNegatives([-5, 5, -2]); // false
```

greaterThan, lessThan
=====================
They are be useful to validate if a number is in a specific range.

Example:
```js
var isGreaterThan0 = greaterThan(0);
isGreaterThan0(1); // true
isGreaterThan0(-1); // false

var isValidDiscount = and(greaterThan(0), lessThan(100));
```

Common validators
=================
The library includes a series of very common validators:
* isUndefined
* isDefined
* isString
* isNumber
* isAnything (always returns true)

Example:
```js
var isEmployee = match({
  id: isDefined,
  name: isString,
  salary: isNumber,
  title: or(isUndefined, 'mr', 'ms')
});
```

Custom validator
================
A validator is a simple function that given a value returns true or false. You can build your own and use it together with the other functions:
```js
function isEven(n) {return o % 2 === 0;};

match(isEven);

or([isEven, match(null)]);

match({
  numberOfShoes: isEven
});
```
Note: I have used a named function (not an anonymous function expression or an arrow function). It is important as logging and debugging rely entirely on the function name.

Mixing them up!
===============
Being able to use functions, you can mix-up and reuse validators:
```js
var isPoint = match({ x : undefined, y: undefined });
var isSquare = match([isPoint, isPoint, isPoint, isPoint]);
var isTriangle = match([isPoint, isPoint, isPoint]);
var containsSquareAndTriangle = {
  triangle: isTriangle,
  square: isSquare,
  extra: or([isSquare, isTriangle])
};
```

validator names
===============
Helpers provide always a descriptive name to the generated functions:
```js
match(true).name === 'isTrue'
match(2).name === 'isNumber:2'
match([1,'test']).name === 'array:[isNumber:1,isString:test]'
has('test1', 'test2').name === 'object:{test1:isAnything,test2:isAnything}'
```
This can be very helpful for debugging.

Validation errors
=================
This feature can be useful to have some insight about what went wrong in the validation.
When validating a value you can pass a function, as a second argument. This function is called whenever a validation step fail (only if it is relevant to the validation):
```js
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
}, function (val) {
  // val is an object containing:
  {
    path: path, // if this validation step is nested in an object or array
    name: name, // name of the function
    value: o // the value on which the validator ran
  }  
});
```
Returning:
```js
{ path: 'deleted', name: 'not(isTrue)', result: true, value: true }]);
```
If you want to collect all this informations in an array you can use the validationErrors helper:
```js
var validationErrors = require('occamsrazor-match/extra/validationErrors');
...
var errors = validationErrors();
var validator = arrayOf(5);
validator([5, 5], errors);

console.log(errors()); // returns a list of all errors
```

Validate decorator
==================
A very common use case for validation is checking if the arguments of a function match a certain criteria. Because of this I have included a function decorator that checks the arguments of the decorated function and throws an error if they don't match:
```js
var validate = require('occamsrazor-match/validate-decorators');

var sum = validate(isNumber, isNumber, isNumber)(function sum(a, b, c) {
  return a + b + c;
});
```
if supported you can use the succint es7 syntax:
```js
@validate(isNumber, isNumber, isNumber)
function sum(a, b, c) {
  return a + b + c;
}
```
The error object contains a description of all the things went wrong:
```js
try {
  var result = sum('1', 2, 3);
} catch (e) {
  console.log(e.message); // Function called with wrong arguments: array:[isNumber,isNumber,isNumber]
  console.log(e.errors); // [{ path: [0], name: 'isNumber', value: '1' }]
}
```
