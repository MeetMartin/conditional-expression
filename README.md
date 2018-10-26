# conditional-expression

![npm](https://img.shields.io/npm/v/conditional-expression.svg)
![NpmLicense](https://img.shields.io/npm/l/conditional-expression.svg)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/conditional-expression.svg)
![npm bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/conditional-expression.svg)

Providing 'match' function as a JavaScript functional conditional
expression to replace conditional statements 'if' and 'switch'
as an alternative to ternary operator expression.

GitHub repository: https://github.com/MartinGentleman/conditional-expression

## Install


```sh
npm install conditional-expression --save
```

Without ES6:

```js
var match = require('conditional-expression');

match(1)
  .equals(1).then(function () {
    alert('hello world');
  }).else(false);

```

With ES6:

```js
import match from 'conditional-expression';

match(1)
  .equals(1).then(() => alert('hello world'))
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
    .includes('programming').then(() => alert('awesome'));
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

### equals({any})
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

### typeOf({string})
Evaluates as true based a type.

```js
match({})
    .typeOf('object').then(true)
    .else(false);
// returns true
```

## Social

Find me on Twitter: https://twitter.com/PerAsperaEU

Find me on Medium: https://medium.com/@martinnovk_22870