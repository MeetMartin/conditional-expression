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
  on: y => onMatch(x)(y),
  with: y => onMatch(x)(() => y.test(x)),
  equals: y => onMatch(x)(() => x === y),
  includes: y => onMatch(x)(() => x.includes(y)),
  typeof: y => onMatch(x)(() => typeof x === y),
  else: y => express(y)(x)
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
 * @param {function} fn function used for matching
 * @returns {object} onMatch: a -> function -> {then: b -> c}
 */
const onMatch = x => fn => ({then: z => fn(x) ? matched(express(z)(x)) : match(x)});
  
/**
 * Once a match is made we are not processing any conditions anymore
 * @param {*} x
 * @returns {object} matched: a -> {on: a -> b, with: a -> b, equals: a -> b, includes: a -> b, typeof: a -> b, else: () -> a}
 */
const matched = x => ({
  on: onMatched(x),
  with: onMatched(x),
  equals: onMatched(x),
  includes: onMatched(x),
  typeof: onMatched(x),
  else: () => x
});
  
/**
 * Makes sure that 'then' will be returning matched result
 * @param {*} x result of matching
 * @returns {object} onMatched: a -> () ->  {then: () -> b}
 */
const onMatched = x => () => ({then: () => matched(x)});
  
export default match;