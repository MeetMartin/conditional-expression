# matchexp

![npm](https://img.shields.io/npm/v/matchexp.svg)
![NpmLicense](https://img.shields.io/npm/l/matchexp.svg)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/matchexp.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/matchexp.svg)

Providing 'match' function as a JavaScript functional conditional
expression to replace conditional statements 'if' and 'switch'
as an alternative to ternary operator expression.

GitHub repository: https://github.com/photonite/matchexp

Forked from: https://github.com/MartinGentleman/conditional-expression

Medium article explaining motivation and use for the (original) package: [How to replace switch and ternaries in functional JavaScript](https://medium.com/@martinnovk_22870/how-to-replace-switch-and-ternaries-in-functional-javascript-a011f0e93a31).

## Install


```sh
npm install matchexp --save
```

Without ES6:

```js
var match = require('matchexp').default;

match(1)
  .equals(1).then(function () {
    console.log('hello world');
  }).else(false);

```

With ES6:

```js
import match from 'matchexp';

match(1)
  .equals(1).then(() => console.log('hello world'))
  .else(false);

```

## Usage

First you call match function on an expression that you want to match:

```js
match('functional  programming');
```

Next you choose how you want to match the expression by choosing
appropriate matching function. For example:

```js
match('functional programming')
    .includes('programming');
```

You follow up by calling 'then' function to tell it what to do in case
of a positive match. You can pass a simple value as well as a function
that will be automatically evaluated:

```js
match('something')
    .with(/[a-z]/).then('awesome');

// or

match('functional programming')
    .includes('programming').then(() => console.log('awesome'));
```

You have the option of chaining:

```js
match(42)
    .typeOf('string').then('it is a string')
    .equals('42').then('Answer to the Ultimate Question of Life, the Universe, and Everything');
```

And you finish everything by calling 'else' which is mandatory:

```js
match('http://domain.tld')
    .on(url => url.substr(0, 5) === 'https').then('It is HTTPS indeed')
    .else('It is not HTTPS and that makes me sad :(');
// returns 'It is not HTTPS and that makes me sad :('
```

Once a match is found, no other matching is performed:

```js
match('funny joke')
    .equals('sad').then('I am false')
    .with(/[a-z]/).then('I am true and I am the result')
    .includes('joke').then('I am true but I am not evaluated')
    .else('I just execute everything');
// returns 'I am true and I am the result'
```

## Matching functions

### on({function})
Evaluates as true if passed function returns boolean true, every other
result of a function evaluates as false. Given function is also passed
the expression over which we are matching as a parameter.

```js
match({ grumpy: 'cat' })
    .on(x => x.grumpy === 'cat').then(true)
    .else(false);
// returns true
```

Internally this function is used to implement or other matching
functions.

### with({RegEx})
Evaluates as true based on passed regular expression.

```js
match(73)
    .with(/[0-9]/).then(true)
    .else(false);
// returns true
```

### equals({*})
Evaluates as true based on strict equality ===.

```js
match('tortoise')
    .equals('tortoise').then(true)
    .else(false);
// returns true
```

### includes({string})
Evaluates as true based on whether a substring is included. Always
evaluates as false if not used to match on a string.

```js
match('Martian')
    .includes('arti').then(true)
    .else(false);
// returns true
```

### isIn({string | array})

Evaluates as true based on whether the argument is included in an array or a string.

```js
match("apple")
    .isIn(["apple", "orange"]).then(true)
    .else(false)
// returns true

match("this")
    .isIn("This is it").then(1)
    .isIn("That is not it").then(2)
    .else(0)
// returns 1
```

### typeOf({string})
Evaluates as true based a type.

```js
match({})
    .typeOf('object').then(true)
    .else(false);
// returns true
```

### greaterThan({*}), lessThan({*}), atLeast({*}), atMost({*})
Evaluates as true based on sizes.

```js
match(2).greaterThan(1).then(true).else(false);
// returns true

match('ab').lessThan('abc').then(true).else(false);
// returns true

match(2).atLeast(2).then(true).else(false);
// returns true

match(2).atLeast(1).then(true).else(false);
// returns true

match(2).atMost(2).then(true).else(false);
// returns true

match(2).atMost(1).then(true).else(false);
// returns true
```

## thenMatch() nested matching

You can use nested matching to create subbranches for evaluation. Only
1 level deep nest is directly supported using thenMatch function.

```js
const param = 'this is string';

match(param)
    .includes('this').thenMatch(param)
        .includes('string').then(true)
        .else(false);
    .else(false);
// returns true
```

Notice that thenMatch uses its own parameter and that else in the nested branch
is still required.

To support deeper branching, you can pass match evaluation as a parameter
to then function.

```js
const param = 'this is string';

match(param)
    .includes('this').thenMatch(param)
        .includes('is').then(() => match(param)
            .includes('string').then(true)
            .else(false))
        .else(false);
    .else(false);
// returns true
```

## Extending
You can extend the match function adding more functionality by using the extend method, passing the new method's name and a method of this form:

```js
(param) => (...methodParams) => /* some logic that returns a boolean value*/
```

Example:
```js
match.extend('between', x => (a, b) => a < x && b > x);

const param = 5;

match(param).between(1, 6).then("Param is in between").else("Param is out of range");
// returns "Param is in between"
```


## matchexp changelog

### 1.0.1

- Added isIn matching function to check inclusion in arrays
- Added extending functionality to allow developers to add their own matching functions on the go.

### Forked from MartinGentleman/conditional-expression repository
