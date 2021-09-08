const matchingFs = {
  on: x => y => y(x) === true,
  with: x => y => y.test(x),
  equals: x => y => x === y,
  includes: x => y => typeof x === 'string' && x.includes(y),
  isIn: x => y =>  (Array.isArray(y) || typeof y === 'string') && y.includes(x),
  typeOf: x => y => typeof x === y,
  isGreaterThan: x => y => x > y,
  lessThan: x => y =>  x < y,
  atLeast: x => y =>  x >= y,
  atMost: x => y => x <= y,
  isTrue: x => () => !!x,
  isFalse: x => () =>  !x,
};

/**
 * Higher-order function to serve as prototype for other matching functions
 * @param {function} onFunction function to be used for matching functions
 * @param {boolean} evaluate whether condition should be evaluated
 * @param {*} x simple value to be matched
 * @returns {object} higherOrderMatch :: a -> b -> c {on: d -> e, with: d -> e, equals: d -> e, includes: d -> e, typeof: d -> e, ...etc}
 */
const higherOrderMatch = onFunction => evaluate => x => new Proxy(matchingFs, {
  /**
   * @param {object} target 
   * @param {string} name 
   * @returns higherOrderMatch :: a -> b -> c {on: d -> e, with: d -> e, equals: d -> e, includes: d -> e, typeof: d -> e, ...etc}
   */
  get(target, name) {
    return (...args) => onFunction(x)(evaluate && target[name](x)(...args));
  }
});

/**
 * Matching function to replace imperative switch statement with advanced functional pattern matching expression
 * @param {*} x simple value to be matched
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

/**
 * Matching function to be used within nested branch
 * @param {*} x simple value to be matched
 * @returns {object} nestedMatch: a -> {on: b -> c, with: b -> c, equals: b -> c, includes: b -> c, typeof: b -> c, else: b -> c}
 */
const nestedMatch = x => ({
  ...higherOrderMatch(onNestedMatch)(true)(x),
  else: y => matched(express(y)(x))
});

/**
 * Once a match is made we are not processing any conditions anymore
 * @param {*} x simple value to be matched
 * @returns {object} matched: a -> {on: a -> b, with: a -> b, equals: a -> b, includes: a -> b, typeof: a -> b, else: () -> a}
 */
const matched = x => ({
  ...higherOrderMatch(onMatched)(false)(x),
  else: () => x
});

/**
 * Once a nested match is made we are not processing any conditions anymore
 * @param {*} x simple value to be matched
 * @returns {object} nestedMatched: a -> {on: a -> b, with: a -> b, equals: a -> b, includes: a -> b, typeof: a -> b, else: () -> a}
 */
const nestedMatched = x => ({
  ...higherOrderMatch(onNestedMatched)(false)(x),
  else: () => matched(x)
});

/**
 * If nested branch is under false condition match we want to ignore it
 * @param {*} x simple value to be matched
 * @returns {object} ignoreNestedMatch: a -> {on: a -> b, with: a -> b, equals: a -> b, includes: a -> b, typeof: a -> b, else: () -> a}
 */
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
 * @example express(() => console.log('hello')); // prints out 'hello' to console
 */
const express = y => x => typeof y === 'function' ? y(x) : y;
  
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
 * @returns {object} onMatched: a -> () ->  {then: () -> b, thenMatch: () -> b}
 */
const onMatched = x => () => ({
  then: () => matched(x),
  thenMatch: () => nestedMatched(x)
});

/**
 * General function to evaluate nested matches
 * @param {*} x simple value to be matched
 * @returns {object} onNestedMatch: a -> function -> {then: b -> c}
 */
const onNestedMatch = x => evaluation => ({
  then: y => evaluation ? nestedMatched(express(y)(x)) : nestedMatch(x)
});

/**
 * Makes sure that then will be returning result of nested match
 * @param {*} x result of matching
 * @returns {object} onNestedMatched: a -> () ->  {then: () -> b}
 */
const onNestedMatched = x => () => ({
  then: () => nestedMatched(x)
});

/**
 * Makes sure that nested branch is not returning any result
 * @param {*} x simple value to be matched
 * @returns {object} onIgnoreNestedMatch: a -> () ->  {then: () -> b}
 */
const onIgnoreNestedMatch = x => () => ({
  then: () => ignoreNestedMatch(x)
});

/**
 * Extends match with a new method
 * @param {string} name new method name
 * @param {object} method the method of the form x => (...args) => bool
 * @returns {object} match: x => {then: () => b, else: () => c}
 * @example 
 *   match.extend('between', x => (a, b) => a <= x && b >= x)
 *   match(5).between(4, 6).then(true).else(false)
 */
const extend = (name, method, override = false) => {
  if (!override) {
    const existing = Object.keys(matchingFs);

    if(existing.includes(name)) {
      throw new Error(`Method ${name} already defined.`);
    }
  }

  matchingFs[name] = method;

  return match;
};

match.extend = extend;

export default match;