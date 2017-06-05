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
Writing complex validators may be a bit verbose. This library helps you to write short yet expressive validators.

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

Using undefined you create a validator that matches any value:
```js
var isAnything = match(undefined);
isAnything(5);
isAnything('hello');
isAnything({ greeting: 'hello' });
```

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
var isPoint = match({ x : undefined, y: undefined });
isPoint({ x: 1, y: 2 }); // true
isPoint({ x: 1, y: 2, z: 3 }); // true
isPoint({ x: 1, z: 3 }); // false
```
Object matching ensures the object has all the properties specified. It is not in the scope of the library find out what an object isn't, but rather what it is.
Passing values as undefined indicates that I don't really care about their value.
```js
var isPointOnXaxis = match({ x : 0, y: undefined });
isPointOnXaxis({ x: 1, y: 2 }); // false
isPointOnXaxis({ x: 0, y: 2 }); // true
```
Values will be interpreted as specified before so I can implement recursive validation:
```js
function isNumber(n) { return typeof n === 'number'; }

var isEmployee = match({
  name : /[A-Za-z]+/,
  job: {
    position: undefined,
    salary: isNumber
  }
});
```

Arrays are supported as well:
```js
var startsWith123 = match([1, 2, 3]);
startsWith123([1, 2, 3, 4]); // true
startsWith123([2, 3, 4]); // false
```

has
===
This is a shortcut for a very common match:
```js
var isPoint = has(['x', 'y']);
```
is equivalent to:
```js
var isPoint = match({ x : undefined, y: undefined });
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

Validation introspection
========================
This feature can be useful to have some insight about the validation. Like where did it fail, for example.
When validating a value you can pass a function, as a second argument. This function is called whenever a validation step succeed or fail:
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
  deleted: false
}, function (val) {
  // val is an object containing:
  {
    path: path, // if this validation step is nested in an object or array
    name: name, // name of the function
    result: result, // true or false
    value: o // the value on which the validator ran
  }  
});
```
Returning:
```js
{ path: '', name: 'isObject', result: true, value: { user: { name: 'Maurizio', jobtitle: 'engineer' }, deleted: false } },
{ path: 'user', name: 'hasAttribute', result: true, value: { user: { name: 'Maurizio', jobtitle: 'engineer' }, deleted: false } },
{ path: 'user', name: 'isObject', result: true, value: { name: 'Maurizio', jobtitle: 'engineer' } },
{ path: 'user.name', name: 'hasAttribute', result: true, value: { name: 'Maurizio', jobtitle: 'engineer' } },
{ path: 'user.name', name: 'isRegExp:/[a-zA-Z]+/', result: true, value: 'Maurizio' },
{ path: 'user.jobtitle', name: 'hasAttribute', result: true, value: { name: 'Maurizio', jobtitle: 'engineer' } },
{ path: 'user.jobtitle', name: 'isString:engineer', result: true, value: 'engineer' },
{ path: 'deleted', name: 'hasAttribute', result: true, value: { user: { name: 'Maurizio', jobtitle: 'engineer' }, deleted: false } },
{ path: 'deleted', name: 'not(isTrue)', result: true, value: false }]);
```
