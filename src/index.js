/**
 * Higher-order function to serve as prototype for other matching functions
 * @param {function} onFunction function to be used for matching functions
 * @param {boolean} evaluate whether condition should be evaluated
 * @param {any} x simple value to be matched
 * @returns {object} higherOrderMatch :: a -> b -> c {on: d -> e, with: d -> e, equals: d -> e, includes: d -> e, typeof: d -> e}
 */
const higherOrderMatch = onFunction => evaluate => x => ({
  on: y => onFunction(x)(evaluate && y(x) === true),
  with: y => onFunction(x)(evaluate && y.test(x)),
  equals: y => onFunction(x)(evaluate && x === y),
  includes: y => onFunction(x)(evaluate && typeof x === 'string' && x.includes(y)),
  typeOf: y => onFunction(x)(evaluate && typeof x === y)
});

/**
 * Matching function to replace imperative switch statement with advanced functional pattern matching expression
 * @param {any} x simple value to be matched
 * @returns {object} match: a -> {on: b -> c, with: b -> c, equals: b -> c, includes: b -> c, typeof: b -> c, else: b -> c}
 * @example
 * match(2)
 * .equals(1).then('number one')
 * .equals(2).then('number two')
 * .else('unknown number');
 */
const match = x => ({
  ...higherOrderMatch(onMatch)(true)(x),
  else: y => express(y)(x)
});

/** */
const nestedMatch = x => ({
  ...higherOrderMatch(onNestedMatch)(true)(x),
  else: y => matched(express(y)(x))
});

/**
 * Once a match is made we are not processing any conditions anymore
 * @param {any} x
 * @returns {object} matched: a -> {on: a -> b, with: a -> b, equals: a -> b, includes: a -> b, typeof: a -> b, else: () -> a}
 */
const matched = x => ({
  ...higherOrderMatch(onMatched)(false)(x),
  else: () => x
});

/** */
const nestedMatched = x => ({
  ...higherOrderMatch(onNestedMatched)(false)(x),
  else: () => matched(x)
});

/** */
const ignoreNestedMatch = x => ({
  ...higherOrderMatch(onIgnoreNestedMatch)(false)(x),
  else: () => match(x)
});
  
/**
 * Triggeres a function or just returns a value depending on type of passed expression
 * @param {*} y value or a function
 * @param {*} x in case of expression being a function, param is passed as its parameter
 * @returns {*} express: (function, x) -> function (x), express: function -> function (), express: x -> x
 * @example express('hello'); // return hello
 * @example express(() => window.alert('hello')); // triggers alert
 */
const express = y => x => typeof y === 'function' ? y (x) : y;
  
/**
 * General function to evaluation matching based on a functional expression
 * @param {*} x simple value to be matched
 * @param {boolean} evaluation function used for matching
 * @returns {object} onMatch: a -> function -> {then: b -> c, thenMatch: b -> c}
 */
const onMatch = x => evaluation => ({
  then: y => evaluation ? matched(express(y)(x)) : match(x),
  thenMatch: y => evaluation ? nestedMatch(y) : ignoreNestedMatch(x)
});

/**
 * Makes sure that 'then' will be returning matched result
 * @param {*} x result of matching
 * @returns {object} onMatched: a -> () ->  {then: () -> b}
 */
const onMatched = x => () => ({
  then: () => matched(x),
  thenMatch: () => nestedMatched(x)
});

/** */
const onNestedMatch = x => evaluation => ({
  then: y => evaluation ? nestedMatched(express(y)(x)) : nestedMatch(x)
});

/** */
const onNestedMatched = x => () => ({
  then: () => nestedMatched(x)
});

/** */
const onIgnoreNestedMatch = x => () => ({
  then: () => ignoreNestedMatch(x)
});

export default match;