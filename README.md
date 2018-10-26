# conditional-expression ![npm](https://img.shields.io/npm/dt/conditional-expression.svg)![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/conditional-expression.svg)

JavaScript functional conditional expression

Usage
---

```sh
npm install conditional-expression --save
```

In node:

```js
var match = require('conditional-expression');

match(1)
  .equals(1).then(function () {
    alert('hello world');
  }).else(false);

```

In node with ES6:

```js
import match from 'conditional-expression';

match(1)
  .equals(1).then(() => alert('hello world');)
  .else(false);

```